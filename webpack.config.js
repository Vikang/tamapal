const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'three',
          '@react-three/fiber',
          '@react-three/drei',
        ],
      },
    },
    argv
  );

  // Handle .glb files as assets
  config.module.rules.push({
    test: /\.glb$/,
    type: 'asset/resource',
  });

  return config;
};
