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

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: 30,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: theme.palette.primary?.main || '#1976d2',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    letterSpacing: '-0.5px',
  },
  accent: {
    color: theme.palette.secondary?.main || '#dc004e',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: 400,
    marginLeft: '8px',
    color: '#666',
  },
}));

const LogoFull = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <span className={classes.logo}>
        Gresham<span className={classes.accent}>Tech</span>
        <span className={classes.subtitle}>Developer Portal</span>
      </span>
    </div>
  );
};

export default LogoFull;
