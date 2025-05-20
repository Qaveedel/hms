const path = require('path');

module.exports = function override(config, env) {
  // Add an alias for stylis-plugin-rtl
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  config.resolve.alias['stylis-plugin-rtl'] = path.resolve(__dirname, 'node_modules/stylis-plugin-rtl/dist/stylis-rtl.js');

  // Add a rule to ignore source map warnings for stylis-plugin-rtl
  config.module.rules.push({
    test: /node_modules[\\/]stylis-plugin-rtl[\\/].*\.js$/,
    enforce: 'pre',
    use: [{
      loader: 'source-map-loader',
      options: {
        filterSourceMappingUrl: (url, resourcePath) => {
          // Completely ignore source maps for stylis-plugin-rtl
          if (resourcePath.includes('stylis-plugin-rtl')) {
            return false;
          }
          return true;
        },
      },
    }],
  });

  return config;
}; 