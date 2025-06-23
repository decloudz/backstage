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

export interface Config {
  argocd?: {
    instances?: Array<{
      /**
       * Name of the ArgoCD instance
       */
      name: string;
      /**
       * URL of the ArgoCD API server
       */
      url: string;
      /**
       * Username for basic authentication (optional if using token)
       */
      username?: string;
      /**
       * Password for basic authentication (optional if using token)
       */
      password?: string;
      /**
       * Bearer token for authentication (optional if using username/password)
       */
      token?: string;
    }>;
  };
}