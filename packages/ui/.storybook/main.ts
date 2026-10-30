import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['./generated/*.stories.tsx'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    // Separate config: the package vite.config.ts is a library build (externals, preserveModules).
    options: { builder: { viteConfigPath: '.storybook/vite.config.ts' } },
  },
  core: { disableTelemetry: true },
};

export default config;
