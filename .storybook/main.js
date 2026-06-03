module.exports = {
  stories: ['../storybook/stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-essentials'
  ],
  framework: { name: '@storybook/html-webpack5' },
  staticDirs: ['../build']
};