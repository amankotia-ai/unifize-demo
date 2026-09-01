import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const unifizeTheme = create({
  base: 'light',
  brandTitle: 'Unifize',
  brandUrl: 'https://www.unifize.com',
  brandImage: '/unifize-logo.svg',
  brandTarget: '_blank',
});

addons.setConfig({ theme: unifizeTheme });
