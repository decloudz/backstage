/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Router } from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { CatalogApi } from '@backstage/catalog-client';
import { InputError, NotFoundError } from '@backstage/errors';
import { ArgocdService } from './ArgocdService';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  catalogApi: CatalogApi;
}

export async function createRouter(options: RouterOptions): Promise<Router> {
  const { logger, config, catalogApi } = options;
  const router = Router();
  const argocdService = new ArgocdService(logger, config, catalogApi);

  router.use(express.json());

  // Get all applications
  router.get('/applications', async (req, res) => {
    try {
      const instance = req.query.instance as string | undefined;
      const applications = await argocdService.getAllApplications(instance);
      res.json({ applications });
    } catch (error) {
      logger.error('Failed to get applications', error);
      res.status(500).json({ error: 'Failed to get applications' });
    }
  });

  // Get application by name
  router.get('/applications/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const instance = req.query.instance as string | undefined;
      const application = await argocdService.getApplication(name, instance);
      res.json(application);
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        logger.error(`Failed to get application ${req.params.name}`, error);
        res.status(500).json({ error: 'Failed to get application' });
      }
    }
  });

  // Get applications for a specific entity
  router.get('/applications/entity/:namespace/:kind/:name', async (req, res) => {
    try {
      const { namespace, kind, name } = req.params;
      const instance = req.query.instance as string | undefined;
      
      // Get entity from catalog
      const entityRef = `${kind}:${namespace}/${name}`;
      const entity = await catalogApi.getEntityByRef(entityRef);
      
      if (!entity) {
        res.status(404).json({ error: 'Entity not found' });
        return;
      }

      const applications = await argocdService.getApplicationsForEntity(entity, instance);
      res.json({ applications });
    } catch (error) {
      logger.error(`Failed to get applications for entity ${req.params.namespace}/${req.params.kind}/${req.params.name}`, error);
      res.status(500).json({ error: 'Failed to get applications for entity' });
    }
  });

  // Sync application
  router.post('/applications/:name/sync', async (req, res) => {
    try {
      const { name } = req.params;
      const instance = req.query.instance as string | undefined;
      const syncRequest = req.body;
      
      await argocdService.syncApplication(name, syncRequest, instance);
      res.json({ message: 'Sync triggered successfully' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        logger.error(`Failed to sync application ${req.params.name}`, error);
        res.status(500).json({ error: 'Failed to sync application' });
      }
    }
  });

  // Refresh application
  router.post('/applications/:name/refresh', async (req, res) => {
    try {
      const { name } = req.params;
      const instance = req.query.instance as string | undefined;
      
      await argocdService.refreshApplication(name, instance);
      res.json({ message: 'Refresh triggered successfully' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        logger.error(`Failed to refresh application ${req.params.name}`, error);
        res.status(500).json({ error: 'Failed to refresh application' });
      }
    }
  });

  // Get available instances
  router.get('/instances', async (req, res) => {
    try {
      const instances = argocdService.getAvailableInstances();
      res.json({ instances });
    } catch (error) {
      logger.error('Failed to get instances', error);
      res.status(500).json({ error: 'Failed to get instances' });
    }
  });

  return router;
}