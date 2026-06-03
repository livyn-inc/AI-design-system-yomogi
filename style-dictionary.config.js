module.exports = {
  source: [
    'tokens/colors/index.json',
    'tokens/spacing/primitives.json',
    'tokens/font/primitives.json',
    'tokens/layout/primitives.json',
    'tokens/radius/primitives.json',
    'tokens/shadow/primitives.json',
    'tokens/opacity/primitives.json',
    'tokens/border/primitives.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables'
      }]
    }
  }
};