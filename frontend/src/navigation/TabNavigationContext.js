/**
 * TabNavigationContext.js
 *
 * Provides two things to any screen:
 *   1. switchTab(key, params?) — switch the active top-level tab
 *   2. scrollY                 — shared Animated.Value that screens drive
 *                                with their scroll position so the brand
 *                                strip in AppNavigator can collapse/expand
 *
 * Usage in any screen:
 *
 *   import { useTabNavigation } from '../navigation/TabNavigationContext';
 *
 *   const { switchTab, scrollY } = useTabNavigation();
 *
 *   // On a ScrollView:
 *   <Animated.ScrollView
 *     onScroll={Animated.event(
 *       [{ nativeEvent: { contentOffset: { y: scrollY } } }],
 *       { useNativeDriver: false }
 *     )}
 *     scrollEventThrottle={16}
 *   >
 *
 *   // On a FlatList — pass via onScroll prop (wrap FlatList in Animated.FlatList):
 *   <Animated.FlatList
 *     onScroll={Animated.event(
 *       [{ nativeEvent: { contentOffset: { y: scrollY } } }],
 *       { useNativeDriver: false }
 *     )}
 *     scrollEventThrottle={16}
 *   >
 */

import React, { createContext, useContext } from 'react';
import { Animated } from 'react-native';

// Fallback so screens that lack a Provider still compile safely
const fallbackScrollY = new Animated.Value(0);

export const TabNavigationContext = createContext({
  switchTab: () => {},
  scrollY: fallbackScrollY,
});

export const useTabNavigation = () => useContext(TabNavigationContext);