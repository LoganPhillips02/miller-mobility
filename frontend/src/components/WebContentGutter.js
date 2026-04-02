import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  isWebDesktopLayout,
  WEB_BODY_MAX_WIDTH,
  WEB_BODY_SIDE_INSET,
} from '../constants/webLayout';

/**
 * Web desktop (≥768px): centers content with max width and horizontal inset.
 * Native / narrow web: no-op wrapper (children keep their own padding).
 */
export default function WebContentGutter({ children, style }) {
  if (!isWebDesktopLayout()) {
    return <View style={style}>{children}</View>;
  }
  return (
    <View style={[styles.outer, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: WEB_BODY_MAX_WIDTH,
    paddingHorizontal: WEB_BODY_SIDE_INSET,
  },
});
