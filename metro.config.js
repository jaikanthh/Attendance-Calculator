// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add the asset registry path for asset modules
config.resolver.extraNodeModules = {
  'missing-asset-registry-path': path.resolve(__dirname, 'node_modules/react-native/Libraries/Image/AssetRegistry'),
};

// Add ttf and svg to asset extensions
config.resolver.assetExts.push('ttf', 'svg');

module.exports = config;
