import { Platform, Dimensions } from 'react-native';

export const WEB_LAYOUT_BREAKPOINT = 768;
export const WEB_BODY_MAX_WIDTH = 1280;
export const WEB_BODY_SIDE_INSET = 48;

export function isWebDesktopLayout() {
  if (Platform.OS !== 'web') return false;
  return Dimensions.get('window').width >= WEB_LAYOUT_BREAKPOINT;
}

/** Width available inside the centered column (for grids/cards). */
export function getWebBodyContentWidth() {
  const sw = Dimensions.get('window').width;
  if (Platform.OS !== 'web' || sw < WEB_LAYOUT_BREAKPOINT) return sw;
  const column = Math.min(sw, WEB_BODY_MAX_WIDTH);
  return column - WEB_BODY_SIDE_INSET * 2;
}
