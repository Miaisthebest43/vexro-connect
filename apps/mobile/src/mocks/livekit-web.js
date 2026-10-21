// Mock for LiveKit on Web to prevent native crashes
export const registerGlobals = () => {};
export const RTCView = () => null;
export const MediaStream = () => null;
export const Room = () => null;
export const RoomEvent = {};
export default {
  registerGlobals,
  RTCView,
  MediaStream,
  Room,
  RoomEvent,
};