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
    height: 40,
    width: 'auto',
  },
  logo: {
    height: '32px',
    width: 'auto',
    maxWidth: '200px',
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

  // Official Gresham Technologies logo
  const logoSrc = '/gresham-logo-dark.svg';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={classes.container}>
      {!imageError ? (
        <img
          src={logoSrc}
          alt="Gresham Technologies"
          className={classes.logo}
          onError={handleImageError}
        />
      ) : (
        // Fallback to text logo if image fails to load
        <span className={classes.fallbackText}>
          Gresham<span className={classes.accent}>Technologies</span>
        </span>
      )}
    </div>
  );
};

export default LogoFull;
