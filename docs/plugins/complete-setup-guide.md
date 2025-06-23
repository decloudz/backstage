# Complete ArgoCD and Kubernetes Plugin Setup Guide

This guide provides step-by-step instructions for implementing both the ArgoCD and Kubernetes plugins in your Backstage instance, creating a comprehensive GitOps and Kubernetes management experience.

## Overview

By the end of this guide, you'll have:
- ✅ Roadie ArgoCD plugin for GitOps workflow visibility
- ✅ Backstage Kubernetes plugin for resource monitoring
- ✅ Integrated view showing both deployment status and running resources
- ✅ Multi-cluster and multi-instance support
- ✅ Proper authentication and security setup

## Prerequisites

- Backstage application setup
- ArgoCD instance(s) running
- Kubernetes cluster(s) access
- Administrative access to both ArgoCD and Kubernetes

## Phase 1: Install Dependencies

### Frontend Dependencies

```bash
cd packages/app

# Install ArgoCD plugin
yarn add @roadiehq/backstage-plugin-argo-cd

# Install Kubernetes plugin (if not already present)
yarn add @backstage/plugin-kubernetes
```

### Backend Dependencies

```bash
cd packages/backend

# Install ArgoCD backend plugin
yarn add @roadiehq/backstage-plugin-argo-cd-backend

# Install Kubernetes backend plugin (if not already present)  
yarn add @backstage/plugin-kubernetes-backend
```

## Phase 2: Configure Backend Plugins

### 1. Create ArgoCD Backend Plugin

```typescript
// packages/backend/src/plugins/argocd.ts
import { createRouter } from '@roadiehq/backstage-plugin-argo-cd-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  return await createRouter({ logger, config });
}
```

### 2. Create Kubernetes Backend Plugin

```typescript
// packages/backend/src/plugins/kubernetes.ts
import { createRouter } from '@backstage/plugin-kubernetes-backend';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment) {
  return await createRouter({ logger, config });
}
```

### 3. Register Both Plugins

```typescript
// packages/backend/src/index.ts
import argocd from './plugins/argocd';
import kubernetes from './plugins/kubernetes';

// Create environments
const argocdEnv = useHotMemoize(module, () => createEnv('argocd'));
const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));

// Register routes
apiRouter.use('/argocd', await argocd(argocdEnv));
apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
```

## Phase 3: Configure Frontend Integration

### Complete Entity Page Setup

```typescript
// packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityArgoCDOverviewCard,
  EntityArgoCDHistoryCard,
  isArgocdAvailable,
} from '@roadiehq/backstage-plugin-argo-cd';

import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';

const serviceEntityPage = (
  <EntityLayout>
    {/* Overview Page with both ArgoCD and Kubernetes info */}
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {/* Existing overview cards */}
        <Grid item md={6} xs={12}>
          <EntityAboutCard variant="gridItem" />
        </Grid>
        
        {/* ArgoCD Overview Card */}
        <EntitySwitch>
          <EntitySwitch.Case if={e => Boolean(isArgocdAvailable(e))}>
            <Grid item md={6} xs={12}>
              <EntityArgoCDOverviewCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
        
        {/* Add more overview cards as needed */}
      </Grid>
    </EntityLayout.Route>

    {/* Dedicated ArgoCD Tab */}
    <EntityLayout.Route path="/argocd" title="ArgoCD">
      <EntityArgoCDHistoryCard />
    </EntityLayout.Route>

    {/* Dedicated Kubernetes Tab */}
    <EntityLayout.Route path="/kubernetes" title="Kubernetes">
      <EntityKubernetesContent />
    </EntityLayout.Route>

    {/* Other existing routes */}
  </EntityLayout>
);
```

## Phase 4: Application Configuration

### Complete app-config.yaml Setup

```yaml
# app-config.yaml

# ArgoCD Configuration
argocd:
  # Base URL for ArgoCD web UI links
  baseUrl: https://argocd.example.com
  
  # Backend plugin configuration (recommended for multiple instances)
  username: ${ARGOCD_USERNAME}
  password: ${ARGOCD_PASSWORD}
  appLocatorMethods:
    - type: 'config'
      instances:
        - name: production
          url: https://argocd-prod.example.com
          token: ${ARGOCD_PROD_TOKEN}
        - name: staging  
          url: https://argocd-staging.example.com
          token: ${ARGOCD_STAGING_TOKEN}
  
  # Optional: Performance tuning
  revisionsToLoad: 10
  namespacedApps: true

# Kubernetes Configuration  
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  
  # Custom resources (optional)
  customResources:
    - group: 'argoproj.io'
      apiVersion: 'v1alpha1' 
      plural: 'rollouts'
    - group: 'networking.istio.io'
      apiVersion: 'v1alpha3'
      plural: 'virtualservices'
  
  # Kubernetes clusters
  clusters:
    - url: https://k8s-prod.example.com
      name: production-cluster
      authProvider: 'serviceAccount'
      serviceAccountToken: ${K8S_PROD_TOKEN}
      caData: ${K8S_PROD_CA_DATA}
      
    - url: https://k8s-staging.example.com
      name: staging-cluster  
      authProvider: 'serviceAccount'
      serviceAccountToken: ${K8S_STAGING_TOKEN}
      caData: ${K8S_STAGING_CA_DATA}

# Alternative: Proxy configuration for ArgoCD (simpler setup)
proxy:
  '/argocd/api':
    target: https://argocd-prod.example.com/api/v1/
    changeOrigin: true
    secure: false
    headers:
      Cookie:
        $env: ARGOCD_AUTH_TOKEN
        
  '/argocd/staging':
    target: https://argocd-staging.example.com/api/v1/ 
    changeOrigin: true
    secure: false
    headers:
      Cookie:
        $env: ARGOCD_STAGING_TOKEN
```

## Phase 5: Entity Configuration Examples

### Complete Entity Configuration

```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example-service
  description: A sample microservice
  annotations:
    # ArgoCD Integration
    argocd/app-name: example-service
    # Alternative: argocd/app-selector: 'app=example-service,tier=backend'
    
    # Kubernetes Integration  
    backstage.io/kubernetes-id: example-service
    # Alternative: backstage.io/kubernetes-label-selector: 'app=example-service'
    
    # Optional: Specify environments
    backstage.io/kubernetes-namespace: 'production,staging'
    
    # Optional: Specific ArgoCD instance
    # argocd/proxy-url: '/argocd/staging'
    
spec:
  type: service
  lifecycle: production
  owner: team-platform
  system: example-system
```

### Kubernetes Resource Labels

Ensure your Kubernetes resources have matching labels:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-service
  namespace: production
  labels:
    # For Backstage Kubernetes plugin
    backstage.io/kubernetes-id: example-service
    
    # For ArgoCD tracking
    argocd.argoproj.io/instance: example-service
    
    # Standard labels
    app: example-service
    version: v1.0.0
    component: backend
spec:
  # ... deployment specification
```

### ArgoCD Application Configuration

```yaml
# argocd-application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: example-service
  namespace: argocd
  labels:
    # Match with Backstage entity
    backstage.io/kubernetes-id: example-service
spec:
  source:
    repoURL: https://github.com/example/example-service
    path: k8s/
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  # ... rest of ArgoCD application spec
```

## Phase 6: Authentication Setup

### Environment Variables

```bash
# ArgoCD Authentication
export ARGOCD_USERNAME=admin
export ARGOCD_PASSWORD=your-argocd-password

# ArgoCD Tokens (get from ArgoCD CLI or API)
export ARGOCD_PROD_TOKEN='argocd.token=your-prod-token'
export ARGOCD_STAGING_TOKEN='argocd.token=your-staging-token'

# Alternative: Single instance token
export ARGOCD_AUTH_TOKEN='argocd.token=your-token'

# Kubernetes Service Account Tokens  
export K8S_PROD_TOKEN=your-k8s-prod-token
export K8S_STAGING_TOKEN=your-k8s-staging-token

# Optional: CA Data for clusters with custom CAs
export K8S_PROD_CA_DATA=LS0tLS1CRUdJTi0...
export K8S_STAGING_CA_DATA=LS0tLS1CRUdJTi0...
```

### Get ArgoCD Token

```bash
# Method 1: Using ArgoCD CLI
argocd login argocd.example.com
argocd account generate-token

# Method 2: Using API
curl -X POST https://argocd.example.com/api/v1/session \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}' \
  | jq -r '.token'
```

### Get Kubernetes Token

```bash
# Create service account (if not exists)
kubectl create serviceaccount backstage-k8s-plugin

# Get the token
kubectl get secret $(kubectl get sa backstage-k8s-plugin -o jsonpath='{.secrets[0].name}') \
  -o jsonpath='{.data.token}' | base64 --decode
```

## Phase 7: RBAC Configuration

### Kubernetes RBAC

```yaml
# k8s-rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: backstage-k8s-plugin
rules:
  # Core resources
  - apiGroups: ['']
    resources: ['pods', 'services', 'configmaps', 'events', 'pods/log']
    verbs: ['get', 'list', 'watch']
  
  # Apps resources  
  - apiGroups: ['apps']
    resources: ['deployments', 'replicasets', 'daemonsets', 'statefulsets']
    verbs: ['get', 'list', 'watch']
    
  # ArgoCD resources (if ArgoCD runs in same cluster)
  - apiGroups: ['argoproj.io']
    resources: ['applications', 'rollouts']
    verbs: ['get', 'list', 'watch']
    
  # Other resources
  - apiGroups: ['autoscaling']
    resources: ['horizontalpodautoscalers'] 
    verbs: ['get', 'list', 'watch']
    
  - apiGroups: ['networking.k8s.io']
    resources: ['ingresses']
    verbs: ['get', 'list', 'watch']
    
  - apiGroups: ['batch']
    resources: ['jobs', 'cronjobs']
    verbs: ['get', 'list', 'watch']

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding  
metadata:
  name: backstage-k8s-plugin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: backstage-k8s-plugin
subjects:
  - kind: ServiceAccount
    name: backstage-k8s-plugin
    namespace: default
```

Apply the RBAC configuration:

```bash
kubectl apply -f k8s-rbac.yaml
```

## Phase 8: Testing and Validation

### 1. Start Backstage

```bash
# In the root of your Backstage application
yarn dev
```

### 2. Test Backend Endpoints

```bash  
# Test ArgoCD backend
curl http://localhost:7007/api/argocd/applications

# Test Kubernetes backend  
curl http://localhost:7007/api/kubernetes/clusters
```

### 3. Check Entity Views

1. Navigate to a service entity in Backstage
2. Verify ArgoCD overview card shows application status
3. Check Kubernetes tab shows cluster resources  
4. Confirm ArgoCD tab displays deployment history

### 4. Validate Integration

- Ensure both plugins display data for the same service
- Check that deployments triggered via ArgoCD appear in Kubernetes view
- Verify multi-cluster/multi-instance functionality

## Features You'll Have

### Comprehensive GitOps Visibility
- **ArgoCD Overview Card**: Sync status, health, last deployment
- **ArgoCD History**: Complete deployment timeline with rollback options
- **Application Management**: Direct links to ArgoCD UI for detailed management

### Full Kubernetes Monitoring  
- **Resource Status**: Real-time pod, service, and deployment status
- **Multi-Cluster View**: Resources across all configured clusters
- **Event Monitoring**: Kubernetes events and logs
- **Custom Resources**: Support for ArgoCD Rollouts, Istio, and other CRDs

### Integrated Experience
- **Unified View**: See both GitOps workflow and runtime status
- **Consistent Labeling**: Resources linked between ArgoCD and Kubernetes
- **Multi-Environment**: Production, staging, and development environments

## Troubleshooting

### Common Issues

1. **Plugins not showing**: Check entity annotations match exactly
2. **Authentication failures**: Verify tokens and permissions
3. **Missing resources**: Confirm RBAC and network connectivity
4. **Multiple instances**: Ensure proper routing configuration

### Debug Commands

```bash
# Check ArgoCD connectivity
curl -H "Authorization: Bearer $ARGOCD_TOKEN" https://argocd.example.com/api/v1/applications

# Test Kubernetes access
kubectl auth can-i get pods --as=system:serviceaccount:default:backstage-k8s-plugin

# Check Backstage logs
docker logs backstage-backend | grep -E "(argocd|kubernetes)"
```

This complete setup provides a production-ready GitOps and Kubernetes monitoring solution integrated into your Backstage developer portal.