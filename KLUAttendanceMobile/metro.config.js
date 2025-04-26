const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolution for the empty-module
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'metro-runtime': path.resolve(__dirname, 'node_modules/metro-runtime')
  }
};

// Add svg to assetExts
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// Configure transformer for svg
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

module.exports = config; 