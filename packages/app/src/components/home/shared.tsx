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

import { TemplateBackstageLogoIcon } from '@backstage/plugin-home';
import { makeStyles } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import CloudIcon from '@material-ui/icons/Cloud';
import SecurityIcon from '@material-ui/icons/Security';
import BugReportIcon from '@material-ui/icons/BugReport';
import HelpIcon from '@material-ui/icons/Help';

export const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: theme.palette.primary.main, // Use GreshamTech theme colors
  },
}));

export const tools = [
  {
    url: '/docs',
    label: 'Documentation',
    icon: <HelpIcon />,
  },
  {
    url: '/create',
    label: 'Service Generator',
    icon: <CodeIcon />,
  },
  {
    url: '/api-docs',
    label: 'API Explorer',
    icon: <CloudIcon />,
  },
  {
    url: 'https://greshamtech.atlassian.net',
    label: 'Issue Tracker',
    icon: <BugReportIcon />,
  },
  {
    url: 'https://greshamtech.com/security',
    label: 'Security Guidelines',
    icon: <SecurityIcon />,
  },
];
