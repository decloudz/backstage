# ArgoCD Plugin Setup

This guide shows how to integrate the Roadie ArgoCD plugin with your Backstage instance.

## Prerequisites

- A running ArgoCD instance
- Backstage application setup
- Access to ArgoCD API and web UI

## Installation Steps

### 1. Install the Frontend Plugin

```bash
cd packages/app
yarn add @roadiehq/backstage-plugin-argo-cd
```

### 2. Install the Backend Plugin (Optional but Recommended)

```bash
cd packages/backend
yarn add @roadiehq/backstage-plugin-argo-cd-backend
```

### 3. Configure the Frontend

Add the ArgoCD components to your entity page:

```typescript
// packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityArgoCDOverviewCard,
  EntityArgoCDHistoryCard,
  isArgocdAvailable,
} from '@roadiehq/backstage-plugin-argo-cd';

// Add to your service entity page
const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3} alignItems="stretch">
        {/* Other overview cards */}
        <EntitySwitch>
          <EntitySwitch.Case if={e => Boolean(isArgocdAvailable(e))}>
            <Grid item md={6}>
              <EntityArgoCDOverviewCard />
            </Grid>
          </EntitySwitch.Case>
        </EntitySwitch>
      </Grid>
    </EntityLayout.Route>
    
    <EntityLayout.Route path="/argocd" title="ArgoCD">
      <EntityArgoCDHistoryCard />
    </EntityLayout.Route>
  </EntityLayout>
);
```

### 4. Configure the Backend Plugin

Create the backend plugin file:

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

Add to your backend router:

```typescript
// packages/backend/src/index.ts
import argocd from './plugins/argocd';

const argocdEnv = useHotMemoize(module, () => createEnv('argocd'));

// Add the route
apiRouter.use('/argocd', await argocd(argocdEnv));
```

## Configuration Options

### Option 1: Using Proxy Configuration (Simpler)

Add proxy configuration to your `app-config.yaml`:

```yaml
proxy:
  '/argocd/api':
    target: https://your-argocd-instance.com/api/v1/
    changeOrigin: true
    secure: false  # Only if using self-signed certificates
    headers:
      Cookie:
        $env: ARGOCD_AUTH_TOKEN

# Optional: Base URL for ArgoCD web UI links
argocd:
  baseUrl: https://your-argocd-instance.com
```

### Option 2: Using Backend Plugin (Recommended for Multiple Instances)

Add ArgoCD configuration to your `app-config.yaml`:

```yaml
argocd:
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
```

### Multiple Instance Configuration

For multiple ArgoCD instances using proxy method:

```yaml
proxy:
  '/argocd/api':
    target: https://argocd-prod.example.com/api/v1/
    changeOrigin: true
    secure: false
    headers:
      Cookie:
        $env: ARGOCD_PROD_TOKEN

  '/argocd/staging':
    target: https://argocd-staging.example.com/api/v1/
    changeOrigin: true
    secure: false
    headers:
      Cookie:
        $env: ARGOCD_STAGING_TOKEN
```

## Entity Configuration

### Single Application

Add the annotation to your entity's `catalog-info.yaml`:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    argocd/app-name: my-service
    # Or use alternative annotation formats:
    # argoproj.io/app-name: my-service
    # backstage.io/argocd-app-selector: my-service
spec:
  type: service
  lifecycle: production
  owner: team-backend
```

### Multiple Applications

Use label selector for multiple applications:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    argocd/app-selector: app=my-service,tier=frontend
spec:
  type: service
  lifecycle: production
  owner: team-backend
```

### Specific Instance

To target a specific ArgoCD instance:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    argocd/app-name: my-service
    argocd/proxy-url: '/argocd/staging'  # For proxy method
spec:
  type: service
  lifecycle: production
  owner: team-backend
```

## Authentication Setup

### Getting ArgoCD Token

1. **Via ArgoCD CLI:**
   ```bash
   argocd login your-argocd-instance.com
   argocd account generate-token
   ```

2. **Via API:**
   ```bash
   curl -X POST https://your-argocd-instance.com/api/v1/session \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your-password"}'
   ```

### Environment Variables

Set the required environment variables:

```bash
# For basic auth
export ARGOCD_USERNAME=admin
export ARGOCD_PASSWORD=your-password

# For token auth
export ARGOCD_AUTH_TOKEN='argocd.token=your-token-here'

# For multiple instances
export ARGOCD_PROD_TOKEN='argocd.token=prod-token-here'
export ARGOCD_STAGING_TOKEN='argocd.token=staging-token-here'
```

## Advanced Configuration

### Namespaced Applications (Beta)

Enable support for applications in any namespace:

```yaml
argocd:
  namespacedApps: true
```

Then use the namespace annotation:

```yaml
metadata:
  annotations:
    argocd/app-namespace: my-namespace
    argocd/app-name: my-service
```

### Limiting Revision History

To improve performance for applications with many revisions:

```yaml
argocd:
  revisionsToLoad: 10
```

## Features Available

### ArgoCD Overview Card
- Application sync status
- Health status
- Last sync time
- Quick actions (sync, refresh)

### ArgoCD History Card
- Deployment history
- Sync operations
- Rollback capabilities
- Detailed revision information

### Multi-Instance Support
- Support for multiple ArgoCD instances
- Instance-specific configurations
- Flexible routing options

## Troubleshooting

### Common Issues

1. **Plugin not showing up**: Ensure the entity has the correct annotation and the ArgoCD application exists
2. **Authentication errors**: Verify the token format and permissions
3. **CORS issues**: Check proxy configuration and CORS settings
4. **Multiple instances**: Ensure proper routing configuration

### Debug Steps

1. Check browser network tab for API calls
2. Verify ArgoCD API accessibility
3. Confirm entity annotations are correct
4. Test ArgoCD authentication independently

## Security Considerations

- Use token-based authentication when possible
- Implement proper RBAC in ArgoCD
- Use environment variables for sensitive data
- Consider using secrets management solutions
- Regularly rotate authentication tokens

This setup provides a comprehensive ArgoCD integration with your Backstage instance, supporting both single and multiple ArgoCD instances with flexible configuration options.