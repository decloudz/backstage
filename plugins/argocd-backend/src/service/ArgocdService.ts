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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { 
  ArgoCDApplication,
  ArgoCDInstanceConfig,
  ArgoCDSyncRequest,
} from '@backstage/plugin-argocd-common';
import { ArgocdApiClient } from './ArgocdApiClient';
import { NotFoundError } from '@backstage/errors';

/**
 * ArgoCD service for handling business logic
 * @public
 */
export class ArgocdService {
  private readonly logger: Logger;
  private readonly config: Config;
  private readonly catalogApi: CatalogApi;
  private readonly clients: Map<string, ArgocdApiClient>;

  constructor(logger: Logger, config: Config, catalogApi: CatalogApi) {
    this.logger = logger;
    this.config = config;
    this.catalogApi = catalogApi;
    this.clients = new Map();
    this.initializeClients();
  }

  private initializeClients() {
    const argocdConfigs = this.config.getOptionalConfigArray('argocd.instances') ?? [];
    
    for (const configItem of argocdConfigs) {
      const instanceConfig: ArgoCDInstanceConfig = {
        name: configItem.getString('name'),
        url: configItem.getString('url'),
        username: configItem.getOptionalString('username'),
        password: configItem.getOptionalString('password'),
        token: configItem.getOptionalString('token'),
      };

      const client = new ArgocdApiClient(this.logger, instanceConfig);
      this.clients.set(instanceConfig.name, client);
      this.logger.info(`Initialized ArgoCD client for instance: ${instanceConfig.name}`);
    }

    if (this.clients.size === 0) {
      this.logger.warn('No ArgoCD instances configured');
    }
  }

  private getClient(instanceName?: string): ArgocdApiClient {
    if (!instanceName) {
      const defaultClient = this.clients.values().next().value;
      if (!defaultClient) {
        throw new NotFoundError('No ArgoCD instances configured');
      }
      return defaultClient;
    }

    const client = this.clients.get(instanceName);
    if (!client) {
      throw new NotFoundError(`ArgoCD instance '${instanceName}' not found`);
    }
    return client;
  }

  async getApplicationsForEntity(entity: Entity, instanceName?: string): Promise<ArgoCDApplication[]> {
    const client = this.getClient(instanceName);
    
    // Get application name from entity annotations
    const appSelector = this.getAppSelectorFromEntity(entity);
    if (!appSelector) {
      this.logger.debug(`No ArgoCD application selector found for entity ${entity.metadata.name}`);
      return [];
    }

    try {
      return await client.getApplications(appSelector);
    } catch (error) {
      this.logger.error(`Failed to get applications for entity ${entity.metadata.name}`, error);
      throw error;
    }
  }

  async getApplication(name: string, instanceName?: string): Promise<ArgoCDApplication> {
    const client = this.getClient(instanceName);
    return client.getApplication(name);
  }

  async getAllApplications(instanceName?: string): Promise<ArgoCDApplication[]> {
    const client = this.getClient(instanceName);
    return client.getApplications();
  }

  async syncApplication(name: string, syncRequest?: ArgoCDSyncRequest, instanceName?: string): Promise<void> {
    const client = this.getClient(instanceName);
    return client.syncApplication(name, syncRequest);
  }

  async refreshApplication(name: string, instanceName?: string): Promise<void> {
    const client = this.getClient(instanceName);
    return client.refreshApplication(name);
  }

  getAvailableInstances(): string[] {
    return Array.from(this.clients.keys());
  }

  private getAppSelectorFromEntity(entity: Entity): string | undefined {
    // Check for ArgoCD annotations
    const annotations = entity.metadata.annotations ?? {};
    
    // Common annotation patterns used in the community
    const appName = annotations['argocd/app-name'] || 
                   annotations['argoproj.io/app-name'] ||
                   annotations['backstage.io/argocd-app-selector'];
    
    if (appName) {
      return `metadata.name=${appName}`;
    }

    // Try to match by entity name if no specific annotation
    const entityName = entity.metadata.name;
    if (entityName) {
      return `metadata.name=${entityName}`;
    }

    return undefined;
  }
}