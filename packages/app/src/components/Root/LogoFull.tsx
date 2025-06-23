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
    height: 40, // Increased height for logo
    width: 'auto',
  },
  logo: {
    height: '32px', // Adjust height as needed
    width: 'auto',
    maxWidth: '200px', // Prevent logo from being too wide
    objectFit: 'contain',
  },
  fallbackText: {
    fontSize: 20,
    fontWeight: 600,
    color: theme.palette.primary?.main || '#003366',
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '-0.5px',
  },
  accent: {
    color: theme.palette.secondary?.main || '#FF6B35',
  },
}));

const LogoFull = () => {
  const classes = useStyles();
  const [imageError, setImageError] = React.useState(false);

  // Try multiple logo file formats
  const logoSources = [
    '/gresham-logo-full.svg',
    '/gresham-logo-full.png',
    '/gresham-logo.svg',
    '/gresham-logo.png',
    '/greshamtech-logo.svg',
    '/greshamtech-logo.png',
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = React.useState(0);

  const handleImageError = () => {
    if (currentLogoIndex < logoSources.length - 1) {
      setCurrentLogoIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={classes.container}>
      {!imageError ? (
        <img
          src={logoSources[currentLogoIndex]}
          alt="Gresham Technologies"
          className={classes.logo}
          onError={handleImageError}
        />
      ) : (
        // Fallback to text logo if no image files are found
        <span className={classes.fallbackText}>
          Gresham<span className={classes.accent}>Technologies</span>
        </span>
      )}
    </div>
  );
};

export default LogoFull;
