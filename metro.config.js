const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Handle image and font assets properly
config.resolver.assetExts.push(
  // Images
  'png', 'jpg', 'jpeg', 'gif', 'webp',
  // Sounds
  'mp3', 'wav', 'ogg',
  // Fonts
  'ttf', 'otf'
);

// Avoid issues with the Pokemon logo PNG
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = config; 