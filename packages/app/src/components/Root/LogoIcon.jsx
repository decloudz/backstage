/*
 * Copyright 2025 The Backstage Authors
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

import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 32,
  },
  logoIcon: {
    height: '24px', // Compact size for icon
    width: 'auto',
    maxWidth: '40px', // Maximum width for icon
    objectFit: 'contain',
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.palette.primary?.main || '#003366',
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.5px',
  },
  accent: {
    color: theme.palette.secondary?.main || '#FF6B35',
  },
}));

const LogoIcon = () => {
  const classes = useStyles();
  const [imageError, setImageError] = React.useState(false);

  // Try multiple icon logo file formats
  const logoIconSources = [
    '/gresham-logo-icon.svg',
    '/gresham-logo-icon.png',
    '/gresham-icon.svg',
    '/gresham-icon.png',
    '/greshamtech-icon.svg',
    '/greshamtech-icon.png',
    // Fallback to full logo if no icon version exists
    '/gresham-logo-full.svg',
    '/gresham-logo-full.png',
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = React.useState(0);

  const handleImageError = () => {
    if (currentLogoIndex < logoIconSources.length - 1) {
      setCurrentLogoIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={classes.container}>
      {!imageError ? (
        <img
          src={logoIconSources[currentLogoIndex]}
          alt="Gresham Technologies"
          className={classes.logoIcon}
          onError={handleImageError}
        />
      ) : (
        // Fallback to abbreviated text logo if no image files are found
        <span className={classes.fallbackText}>
          G<span className={classes.accent}>T</span>
        </span>
      )}
    </div>
  );
};

export default LogoIcon;
