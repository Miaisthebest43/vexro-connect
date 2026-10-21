const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If we are on the web, mock out the native LiveKit packages
  if (platform === 'web' && (moduleName === '@livekit/react-native' || moduleName === '@livekit/react-native-webrtc')) {
    return {
      filePath: path.resolve(__dirname, 'src/mocks/livekit-web.js'),
      type: 'sourceFile',
    };
  }
  
  // Fallback to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;