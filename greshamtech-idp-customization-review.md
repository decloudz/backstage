# GreshamTech IDP - Backstage UI Customization Review

## Overview

This document provides a comprehensive review of the current Backstage application structure and recommendations for customizing the UI to create a branded GreshamTech Internal Developer Platform (IDP).

## Current State Analysis

### Application Configuration (`app-config.yaml`)
- **Current Title**: "Backstage Example App"
- **Organization**: "My Company"
- **Base URL**: localhost:3000 (development)
- **Authentication**: Multiple providers configured (Google, GitHub, GitLab, etc.)

### UI Structure Analysis

#### Main Application (`packages/app/`)
- Uses standard Backstage frontend architecture
- Material-UI v4 theme system
- Modular component structure in `src/components/`

#### Current Branding Elements
1. **Logos**: 
   - `LogoFull.tsx` - Full Backstage logo with teal color (#7df3e1)
   - `LogoIcon.jsx` - Collapsed sidebar logo
2. **Theme**: Default Backstage light/dark themes
3. **Navigation**: Standard sidebar with default menu items
4. **Home Page**: Generic Backstage home page with company logo placeholder

## Customization Recommendations for GreshamTech IDP

### 1. Branding & Identity

#### A. Application Configuration Updates
```yaml
# app-config.yaml updates needed
app:
  title: GreshamTech Developer Portal
  baseUrl: https://developers.greshamtech.com  # Production URL

organization:
  name: GreshamTech

# Update support links
app:
  support:
    url: https://greshamtech.atlassian.net/servicedesk  # Internal support
    items:
      - title: IT Support
        icon: support
        links:
          - url: https://greshamtech.atlassian.net/servicedesk
            title: Submit Ticket
      - title: Developer Slack
        icon: chat
        links:
          - url: https://greshamtech.slack.com/channels/developers
            title: '#developers'
```

#### B. Custom Logo Implementation
**Priority: High**

Replace the current Backstage logos with GreshamTech branding:

1. **Create GreshamTech Logo Components**:
   - Replace `packages/app/src/components/Root/LogoFull.tsx`
   - Replace `packages/app/src/components/Root/LogoIcon.jsx`
   - Add GreshamTech logo SVG or PNG assets

2. **Logo Assets Needed**:
   - Full logo (for expanded sidebar): ~200px width
   - Icon logo (for collapsed sidebar): ~28px height
   - Favicon and app icons in `public/` directory

#### C. Custom Theming
**Priority: High**

Create a GreshamTech-branded theme:

```typescript
// packages/app/src/themes/greshamTechTheme.ts
import {
  createBaseThemeOptions,
  createUnifiedTheme,
  palettes,
} from '@backstage/theme';

export const greshamTechTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.light,
      primary: {
        main: '#1976d2', // GreshamTech primary color
      },
      secondary: {
        main: '#dc004e', // GreshamTech accent color
      },
      navigation: {
        background: '#f5f5f5',
        indicator: '#1976d2',
        color: '#333',
        selectedColor: '#1976d2',
      },
    },
  }),
  fontFamily: 'Arial, sans-serif', // GreshamTech brand font
  defaultPageTheme: 'home',
});
```

### 2. Navigation Customization

#### A. Sidebar Menu Structure
**File**: `packages/app/src/components/Root/Root.tsx`

Customize the sidebar to reflect GreshamTech's development workflow:

```typescript
// Suggested navigation structure
<SidebarGroup label="Menu" icon={<MenuIcon />}>
  <SidebarItem icon={HomeIcon} to="home" text="Developer Home" />
  <SidebarItem icon={CategoryIcon} to="/" text="Service Catalog">
    <SidebarSubmenu title="Services">
      <SidebarSubmenuItem title="Microservices" to="catalog?filters[kind]=component&filters[spec.type]=service" />
      <SidebarSubmenuItem title="Libraries" to="catalog?filters[kind]=component&filters[spec.type]=library" />
      <SidebarSubmenuItem title="APIs" to="catalog?filters[kind]=api" />
      <SidebarSubmenuItem title="Databases" to="catalog?filters[kind]=resource&filters[spec.type]=database" />
    </SidebarSubmenu>
  </SidebarItem>
  <SidebarItem icon={CreateComponentIcon} to="create" text="Create Service" />
  <SidebarItem icon={DocumentIcon} to="docs" text="Documentation" />
  <SidebarItem icon={BuildIcon} to="ci-cd" text="CI/CD Pipelines" />
  <SidebarItem icon={SecurityIcon} to="security" text="Security Hub" />
</SidebarGroup>
```

### 3. Home Page Customization

#### A. GreshamTech Developer Dashboard
**File**: `packages/app/src/components/home/HomePage.tsx`

Transform the home page into a GreshamTech-specific developer dashboard:

```typescript
// Key customizations needed:
1. Welcome message: "Welcome to GreshamTech Developer Portal"
2. Company-specific quick links
3. GreshamTech service metrics
4. Development team announcements
5. Compliance and security alerts
```

### 4. Page Title & Metadata Updates

#### A. HTML Document
**File**: `packages/app/public/index.html`

```html
<title>GreshamTech Developer Portal</title>
<meta name="description" content="GreshamTech Internal Developer Platform - Your gateway to development tools, services, and documentation" />
```

#### B. Manifest File
**File**: `packages/app/public/manifest.json`

```json
{
  "short_name": "GreshamTech IDP",
  "name": "GreshamTech Developer Portal",
  "description": "Internal Developer Platform for GreshamTech"
}
```

### 5. Domain-Specific Customizations

#### A. Catalog Configuration
Based on GreshamTech's tech stack, customize catalog kinds and types:

```yaml
# app-config.yaml
catalog:
  rules:
    - allow:
        - Component
        - API
        - Resource
        - System
        - Domain
        - Location
        - Team        # GreshamTech teams
        - Project     # GreshamTech projects
```

#### B. Scaffolder Templates
Create GreshamTech-specific service templates:
- Microservice template with company standards
- Library template with GreshamTech conventions
- API template with security requirements
- Database schema template

### 6. Authentication & Security

#### A. SSO Integration
Configure with GreshamTech's identity provider:

```yaml
# app-config.yaml
auth:
  providers:
    azure: # or whichever GreshamTech uses
      development:
        clientId: ${GRESHAMTECH_SSO_CLIENT_ID}
        clientSecret: ${GRESHAMTECH_SSO_CLIENT_SECRET}
        tenantId: ${GRESHAMTECH_TENANT_ID}
```

### 7. Implementation Priority

#### Phase 1 (Immediate - 1-2 weeks)
1. ✅ Update app-config.yaml with GreshamTech branding
2. ✅ Replace logos with GreshamTech assets
3. ✅ Update page titles and metadata
4. ✅ Basic theme customization (colors, fonts)

#### Phase 2 (Short-term - 2-4 weeks)
1. 🔄 Navigation menu restructure
2. 🔄 Home page customization
3. 🔄 Custom favicon and app icons
4. 🔄 SSO integration

#### Phase 3 (Medium-term - 1-2 months)
1. 📋 Custom scaffolder templates
2. 📋 Advanced theming and component overrides
3. 📋 Custom plugins for GreshamTech tools
4. 📋 Compliance and security integrations

### 8. Required Assets from GreshamTech

To complete the customization, the following assets are needed:

1. **Brand Assets**:
   - Company logo (SVG preferred)
   - Color palette (primary, secondary, accent colors)
   - Typography guidelines
   - Favicon (16x16, 32x32, etc.)

2. **Configuration Details**:
   - SSO/Identity provider details
   - Internal support URLs
   - Slack/Teams channel information
   - Preferred development workflow structure

3. **Content**:
   - Welcome message copy
   - Company-specific quick links
   - Developer onboarding resources

### 9. File Locations for Customization

#### Key Files to Modify:
```
├── app-config.yaml                           # Main configuration
├── packages/app/
│   ├── public/
│   │   ├── index.html                       # Page title, meta
│   │   ├── manifest.json                    # App manifest
│   │   └── favicon.ico                      # Favicon
│   └── src/
│       ├── App.tsx                          # Theme integration
│       ├── components/
│       │   ├── Root/
│       │   │   ├── LogoFull.tsx            # Main logo
│       │   │   ├── LogoIcon.jsx            # Sidebar logo
│       │   │   └── Root.tsx                # Navigation
│       │   └── home/
│       │       └── HomePage.tsx            # Home page
│       └── themes/
│           └── greshamTechTheme.ts         # Custom theme
```

## Conclusion

The current Backstage implementation provides a solid foundation for creating a customized GreshamTech IDP. The modular architecture allows for gradual customization while maintaining upgrade compatibility. The recommended phased approach ensures minimal disruption while delivering immediate visual improvements for the GreshamTech brand.

The most impactful initial changes will be logo replacement, theme customization, and navigation restructuring to reflect GreshamTech's development workflow and brand identity.