# Kubernetes Plugin Setup

This guide shows how to configure the existing Kubernetes plugin in your Backstage instance. The Kubernetes plugin is already included in the Backstage monorepo and provides comprehensive Kubernetes resource visualization.

## Prerequisites

- Kubernetes cluster(s) access
- Backstage application setup
- kubectl configured for your clusters

## Plugin Architecture

The Kubernetes plugin consists of multiple packages:
- `@backstage/plugin-kubernetes` - Frontend plugin
- `@backstage/plugin-kubernetes-backend` - Backend plugin  
- `@backstage/plugin-kubernetes-common` - Shared types and utilities
- `@backstage/plugin-kubernetes-react` - React components
- `@backstage/plugin-kubernetes-node` - Node.js utilities

## Installation Steps

### 1. Install Frontend Plugin

Since this is part of the main Backstage repository, you need to add it to your app dependencies:

```bash
cd packages/app
yarn add @backstage/plugin-kubernetes
```

### 2. Install Backend Plugin

```bash
cd packages/backend  
yarn add @backstage/plugin-kubernetes-backend
```

### 3. Configure Frontend

Add the Kubernetes components to your entity page:

```typescript
// packages/app/src/components/catalog/EntityPage.tsx
import { EntityKubernetesContent } from '@backstage/plugin-kubernetes';

const serviceEntityPage = (
  <EntityLayoutWrapper>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {/* Other overview cards */}
      </Grid>
    </EntityLayout.Route>
    
    <EntityLayout.Route path="/kubernetes" title="Kubernetes">
      <EntityKubernetesContent />
    </EntityLayout.Route>
  </EntityLayoutWrapper>
);
```

### 4. Configure Backend Plugin

Create the backend plugin file:

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

Add to your backend router:

```typescript
// packages/backend/src/index.ts
import kubernetes from './plugins/kubernetes';

const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));

// Add the route
apiRouter.use('/kubernetes', await kubernetes(kubernetesEnv));
```

## Kubernetes Cluster Configuration

### Basic Configuration

Add Kubernetes configuration to your `app-config.yaml`:

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  clusters:
    - url: https://k8s.example.com
      name: production-cluster
      authProvider: 'serviceAccount'
      serviceAccountToken: ${K8S_PROD_TOKEN}
    - url: https://k8s-staging.example.com  
      name: staging-cluster
      authProvider: 'serviceAccount'
      serviceAccountToken: ${K8S_STAGING_TOKEN}
```

### Authentication Methods

#### Service Account Token

```yaml
clusters:
  - url: https://k8s.example.com
    name: my-cluster
    authProvider: 'serviceAccount'
    serviceAccountToken: ${K8S_SERVICE_ACCOUNT_TOKEN}
```

#### Google Cloud (GKE)

```yaml
clusters:
  - url: https://k8s.example.com
    name: gke-cluster
    authProvider: 'google'
```

#### AWS (EKS)

```yaml
clusters:
  - url: https://k8s.example.com
    name: eks-cluster
    authProvider: 'aws'
```

#### Azure (AKS)

```yaml
clusters:
  - url: https://k8s.example.com
    name: aks-cluster
    authProvider: 'azure'
```

#### Local Development (Minikube)

```yaml
clusters:
  - url: http://127.0.0.1:8001
    name: minikube
    authProvider: 'serviceAccount'
    serviceAccountToken: ${MINIKUBE_TOKEN}
    skipTLSVerify: true
```

### Advanced Configuration Options

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  customResources:
    - group: 'argoproj.io'
      apiVersion: 'v1alpha1'
      plural: 'rollouts'
    - group: 'networking.istio.io'
      apiVersion: 'v1alpha3' 
      plural: 'virtualservices'
  objectTypes:
    - 'pods'
    - 'services' 
    - 'configmaps'
    - 'deployments'
    - 'replicasets'
    - 'horizontalpodautoscalers'
    - 'ingresses'
    - 'jobs'
    - 'cronjobs'
    - 'daemonsets'
    - 'statefulsets'
  clusters:
    - url: https://k8s.example.com
      name: production
      authProvider: 'serviceAccount'
      serviceAccountToken: ${K8S_TOKEN}
      caData: ${K8S_CA_DATA}  # Base64 encoded CA certificate
      skipTLSVerify: false
      skipMetricsLookup: false
```

## Entity Configuration

### Using kubernetes-id Label

Add annotation to your entity:

```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    'backstage.io/kubernetes-id': my-service
spec:
  type: service
  lifecycle: production
  owner: team-backend
```

Then label your Kubernetes resources:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-service
  labels:
    backstage.io/kubernetes-id: my-service
spec:
  # ... deployment spec
```

### Using Label Selectors

For more complex selections:

```yaml
# catalog-info.yaml
metadata:
  annotations:
    'backstage.io/kubernetes-label-selector': 'app=my-service,component=frontend'
```

### Multiple Environments

Use different label selectors for different environments:

```yaml
# catalog-info.yaml  
metadata:
  annotations:
    'backstage.io/kubernetes-label-selector': 'app=my-service'
    'backstage.io/kubernetes-namespace': 'production,staging'
```

## RBAC Setup

Create the necessary RBAC permissions for the service account:

### Basic Read-Only ClusterRole

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: backstage-k8s-plugin
rules:
  - apiGroups: ['']
    resources: 
      - pods
      - pods/log
      - services
      - configmaps
      - events
    verbs: ['get', 'list', 'watch']
  - apiGroups: ['apps']
    resources:
      - deployments
      - replicasets
      - daemonsets
      - statefulsets
    verbs: ['get', 'list', 'watch']
  - apiGroups: ['autoscaling']
    resources:
      - horizontalpodautoscalers
    verbs: ['get', 'list', 'watch']
  - apiGroups: ['networking.k8s.io']
    resources:
      - ingresses
    verbs: ['get', 'list', 'watch']
  - apiGroups: ['batch']
    resources:
      - jobs
      - cronjobs
    verbs: ['get', 'list', 'watch']
```

### Service Account and Binding

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backstage-k8s-plugin
  namespace: default
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

### Get Service Account Token

```bash
# Get the token for the service account
kubectl get secret $(kubectl get sa backstage-k8s-plugin -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 --decode
```

## Environment Variables

Set up the required environment variables:

```bash
# Service account tokens
export K8S_PROD_TOKEN="your-production-token"
export K8S_STAGING_TOKEN="your-staging-token"

# Optional: CA certificates (base64 encoded)
export K8S_PROD_CA_DATA="LS0tL..."
export K8S_STAGING_CA_DATA="LS0tL..."
```

## Features Available

### Resource Visualization
- Pods, Services, Deployments
- ConfigMaps, Secrets
- Ingresses, Jobs, CronJobs
- HorizontalPodAutoscalers

### Real-time Status
- Pod status and health
- Resource utilization
- Events and logs
- Scaling information

### Multi-Cluster Support
- View resources across multiple clusters
- Cluster-specific configurations
- Environment-based filtering

### Custom Resources
- Support for CRDs
- ArgoCD Rollouts
- Istio resources
- Any Kubernetes custom resource

## Troubleshooting

### Common Issues

1. **No resources showing**: Check entity annotations and Kubernetes labels match
2. **Authentication errors**: Verify service account token and permissions
3. **RBAC issues**: Ensure proper ClusterRole and ClusterRoleBinding setup
4. **Network connectivity**: Test cluster accessibility from Backstage backend

### Debug Steps

1. **Test cluster connectivity**:
   ```bash
   curl -k -H "Authorization: Bearer $TOKEN" https://your-cluster/api/v1/namespaces
   ```

2. **Verify service account permissions**:
   ```bash
   kubectl auth can-i get pods --as=system:serviceaccount:default:backstage-k8s-plugin
   ```

3. **Check Backstage logs** for Kubernetes plugin errors

4. **Validate entity annotations** are correctly formatted

### Performance Optimization

```yaml
kubernetes:
  # Reduce API calls for large clusters
  skipMetricsLookup: true
  
  # Limit object types if not needed
  objectTypes:
    - 'pods'
    - 'services'
    - 'deployments'
  
  # Configure refresh intervals
  refreshIntervalMs: 30000
```

## Security Best Practices

- Use least-privilege RBAC permissions
- Rotate service account tokens regularly  
- Use namespace-scoped permissions when possible
- Enable audit logging in Kubernetes
- Monitor Backstage access patterns
- Use secure token storage (e.g., Kubernetes secrets, Vault)

## Integration with Other Plugins

### With ArgoCD Plugin

Label your ArgoCD applications and Kubernetes resources consistently:

```yaml
# ArgoCD Application
metadata:
  labels:
    backstage.io/kubernetes-id: my-service

# Kubernetes Deployment  
metadata:
  labels:
    backstage.io/kubernetes-id: my-service
    argocd.argoproj.io/instance: my-service
```

### With TechDocs

Document your Kubernetes setup in TechDocs and link to specific resources.

This comprehensive setup provides full Kubernetes integration with your Backstage instance, supporting multiple clusters, authentication methods, and resource types.