const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow .glb files as assets so Three.js can load them
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
