/**
 * TabNavigationContext.js
 * Place this file at: src/navigation/TabNavigationContext.js
 *
 * Provides a context so any screen can switch the active top-level tab
 * without relying on React Navigation's cross-container navigation (which
 * doesn't work when each tab has its own independent NavigationContainer).
 *
 * Usage in any screen:
 *
 *   import { useTabNavigation } from '../navigation/TabNavigationContext';
 *
 *   const { switchTab } = useTabNavigation();
 *   switchTab('Inventory');               // just switch tab
 *   switchTab('Inventory', { category: 'scooters' });  // switch + pass params
 */

import React, { createContext, useContext } from 'react';

export const TabNavigationContext = createContext({
  switchTab: () => {},
});

export const useTabNavigation = () => useContext(TabNavigationContext);