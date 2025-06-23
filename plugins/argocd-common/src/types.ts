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

/**
 * ArgoCD application sync status
 * @public
 */
export type ArgoCDSyncStatus = 'Synced' | 'OutOfSync' | 'Unknown';

/**
 * ArgoCD application health status
 * @public
 */
export type ArgoCDHealthStatus = 'Healthy' | 'Progressing' | 'Degraded' | 'Suspended' | 'Missing' | 'Unknown';

/**
 * ArgoCD application operation state
 * @public
 */
export type ArgoCDOperationState = 'Running' | 'Succeeded' | 'Failed' | 'Error' | 'Terminating';

/**
 * ArgoCD application source
 * @public
 */
export interface ArgoCDApplicationSource {
  repoURL: string;
  path?: string;
  targetRevision?: string;
  helm?: {
    valueFiles?: string[];
    parameters?: { name: string; value: string }[];
  };
  kustomize?: {
    images?: string[];
  };
}

/**
 * ArgoCD application destination
 * @public
 */
export interface ArgoCDApplicationDestination {
  server?: string;
  namespace?: string;
  name?: string;
}

/**
 * ArgoCD application sync policy
 * @public
 */
export interface ArgoCDSyncPolicy {
  automated?: {
    prune?: boolean;
    selfHeal?: boolean;
    allowEmpty?: boolean;
  };
  syncOptions?: string[];
  retry?: {
    limit?: number;
    backoff?: {
      duration?: string;
      factor?: number;
      maxDuration?: string;
    };
  };
}

/**
 * ArgoCD application status
 * @public
 */
export interface ArgoCDApplicationStatus {
  sync: {
    status: ArgoCDSyncStatus;
    revision?: string;
    comparedTo?: {
      source: ArgoCDApplicationSource;
      destination: ArgoCDApplicationDestination;
    };
  };
  health: {
    status: ArgoCDHealthStatus;
    message?: string;
  };
  operationState?: {
    phase: ArgoCDOperationState;
    message?: string;
    syncResult?: {
      revision: string;
      source: ArgoCDApplicationSource;
    };
    startedAt?: string;
    finishedAt?: string;
  };
  conditions?: Array<{
    type: string;
    message: string;
    lastTransitionTime?: string;
  }>;
  resources?: Array<{
    group?: string;
    version: string;
    kind: string;
    namespace?: string;
    name: string;
    status: ArgoCDSyncStatus;
    health?: {
      status: ArgoCDHealthStatus;
      message?: string;
    };
  }>;
}

/**
 * ArgoCD application spec
 * @public
 */
export interface ArgoCDApplicationSpec {
  source: ArgoCDApplicationSource;
  destination: ArgoCDApplicationDestination;
  project: string;
  syncPolicy?: ArgoCDSyncPolicy;
}

/**
 * ArgoCD application
 * @public
 */
export interface ArgoCDApplication {
  metadata: {
    name: string;
    namespace?: string;
    creationTimestamp?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
  };
  spec: ArgoCDApplicationSpec;
  status?: ArgoCDApplicationStatus;
}

/**
 * ArgoCD instance configuration
 * @public
 */
export interface ArgoCDInstanceConfig {
  name: string;
  url: string;
  username?: string;
  password?: string;
  token?: string;
}

/**
 * ArgoCD API response for applications list
 * @public
 */
export interface ArgoCDApplicationListResponse {
  items: ArgoCDApplication[];
}

/**
 * ArgoCD sync request
 * @public
 */
export interface ArgoCDSyncRequest {
  revision?: string;
  prune?: boolean;
  dryRun?: boolean;
  strategy?: {
    apply?: {
      force?: boolean;
    };
    hook?: {
      force?: boolean;
    };
  };
  resources?: Array<{
    group?: string;
    version: string;
    kind: string;
    name: string;
    namespace?: string;
  }>;
  syncOptions?: string[];
}

/**
 * ArgoCD API client interface
 * @public
 */
export interface ArgoCDApiClient {
  getApplications(selector?: string): Promise<ArgoCDApplication[]>;
  getApplication(name: string): Promise<ArgoCDApplication>;
  syncApplication(name: string, syncRequest?: ArgoCDSyncRequest): Promise<void>;
  refreshApplication(name: string): Promise<void>;
}