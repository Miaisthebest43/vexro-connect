const { getDefaultConfig } = require('expo/metro-config');
const resolveFrom = require('resolve-from');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 1. Disable package exports to allow resolution of the nested event-target-shim v6
config.resolver.unstable_enablePackageExports = false;

// 2. Force Metro to resolve event-target-shim imports from react-native-webrtc to its nested v6 package
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith('event-target-shim') &&
    context.originModulePath.includes('react-native-webrtc')
  ) {
    try {
      const eventTargetShimPath = resolveFrom(
        context.originModulePath,
        moduleName
      );
      return {
        filePath: eventTargetShimPath,
        type: 'sourceFile',
      };
    } catch (e) {
      // Fall through to default resolution if this fails
    }
  }
  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;