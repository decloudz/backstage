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

import fetch from 'node-fetch';
import { Logger } from 'winston';
import { 
  ArgoCDApiClient,
  ArgoCDApplication,
  ArgoCDApplicationListResponse,
  ArgoCDInstanceConfig,
  ArgoCDSyncRequest,
} from '@backstage/plugin-argocd-common';
import { ResponseError } from '@backstage/errors';

/**
 * ArgoCD API client implementation
 * @public
 */
export class ArgocdApiClient implements ArgoCDApiClient {
  private readonly logger: Logger;
  private readonly config: ArgoCDInstanceConfig;
  private token?: string;

  constructor(logger: Logger, config: ArgoCDInstanceConfig) {
    this.logger = logger;
    this.config = config;
  }

  private async authenticate(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    if (this.config.token) {
      this.token = this.config.token;
      return this.token;
    }

    if (this.config.username && this.config.password) {
      const authUrl = `${this.config.url}/api/v1/session`;
      const authBody = {
        username: this.config.username,
        password: this.config.password,
      };

      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authBody),
      });

      if (!response.ok) {
        throw new ResponseError(
          `Failed to authenticate with ArgoCD: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json() as { token: string };
      this.token = data.token;
      return this.token;
    }

    throw new Error('No authentication method configured for ArgoCD');
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.authenticate();
    const url = `${this.config.url}/api/v1${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ResponseError(
        `ArgoCD API request failed: ${response.statusText}`,
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }

  async getApplications(selector?: string): Promise<ArgoCDApplication[]> {
    try {
      let endpoint = '/applications';
      if (selector) {
        endpoint += `?selector=${encodeURIComponent(selector)}`;
      }

      const response = await this.makeRequest<ArgoCDApplicationListResponse>(endpoint);
      this.logger.debug(`Retrieved ${response.items.length} applications from ArgoCD`);
      return response.items;
    } catch (error) {
      this.logger.error('Failed to fetch applications from ArgoCD', error);
      throw error;
    }
  }

  async getApplication(name: string): Promise<ArgoCDApplication> {
    try {
      const endpoint = `/applications/${encodeURIComponent(name)}`;
      const application = await this.makeRequest<ArgoCDApplication>(endpoint);
      this.logger.debug(`Retrieved application ${name} from ArgoCD`);
      return application;
    } catch (error) {
      this.logger.error(`Failed to fetch application ${name} from ArgoCD`, error);
      throw error;
    }
  }

  async syncApplication(name: string, syncRequest?: ArgoCDSyncRequest): Promise<void> {
    try {
      const endpoint = `/applications/${encodeURIComponent(name)}/sync`;
      await this.makeRequest(endpoint, {
        method: 'POST',
        body: syncRequest ? JSON.stringify(syncRequest) : undefined,
      });
      this.logger.info(`Triggered sync for application ${name}`);
    } catch (error) {
      this.logger.error(`Failed to sync application ${name}`, error);
      throw error;
    }
  }

  async refreshApplication(name: string): Promise<void> {
    try {
      const endpoint = `/applications/${encodeURIComponent(name)}/refresh`;
      await this.makeRequest(endpoint, {
        method: 'POST',
      });
      this.logger.info(`Triggered refresh for application ${name}`);
    } catch (error) {
      this.logger.error(`Failed to refresh application ${name}`, error);
      throw error;
    }
  }
}