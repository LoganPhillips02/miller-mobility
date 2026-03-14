/**
 * AppNavigator.js
 *
 * Layout:
 *   <SafeAreaView>
 *     <TopNavBar />          ← physically first in the tree = TOP of screen
 *     <View flex:1>
 *       {each tab wrapped in its own independent NavigationContainer}
 *       {inactive tabs are hidden but kept mounted to preserve state}
 *     </View>
 *   </SafeAreaView>
 *
 * We use `independent={true}` on each tab's NavigationContainer so React
 * Navigation doesn't complain about multiple navigators sharing one container.
 * https://reactnavigation.org/docs/navigation-container/#independent
 */

import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen          from '../screens/HomeScreen';
import InventoryScreen     from '../screens/InventoryScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import DealsScreen         from '../screens/DealsScreen';
import DealDetailScreen    from '../screens/DealDetailScreen';
import FavoritesScreen     from '../screens/FavoritesScreen';
import ContactScreen       from '../screens/ContactScreen';

import { useFavorites } from '../hooks/useFavorites';
import { Colors, Typography, Spacing } from '../constants/theme';

// ─── Stack instances (one per tab) ───────────────────────────────────────────
const HomeStack      = createStackNavigator();
const InventoryStack = createStackNavigator();
const DealsStack     = createStackNavigator();
const FavStack       = createStackNavigator();
const ContactStack   = createStackNavigator();

const stackHeaderOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.md,
  },
  headerBackTitleVisible: false,
};

// ─── Per-tab navigators ───────────────────────────────────────────────────────
// Each one wraps its stack in an independent NavigationContainer so React
// Navigation doesn't throw "multiple navigators under a single container".

const HomeTab = () => (
  <NavigationContainer independent={true}>
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  </NavigationContainer>
);

const InventoryTab = () => (
  <NavigationContainer independent={true}>
    <InventoryStack.Navigator screenOptions={stackHeaderOptions}>
      <InventoryStack.Screen
        name="InventoryList"
        component={InventoryScreen}
        options={{ title: 'Inventory' }}
      />
      <InventoryStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params?.name ?? 'Product Details' })}
      />
    </InventoryStack.Navigator>
  </NavigationContainer>
);

const DealsTab = () => (
  <NavigationContainer independent={true}>
    <DealsStack.Navigator screenOptions={stackHeaderOptions}>
      <DealsStack.Screen
        name="DealsList"
        component={DealsScreen}
        options={{ headerShown: false }}
      />
      <DealsStack.Screen
        name="DealDetail"
        component={DealDetailScreen}
        options={({ route }) => ({ title: route.params?.title ?? 'Deal Details' })}
      />
    </DealsStack.Navigator>
  </NavigationContainer>
);

const FavoritesTab = () => (
  <NavigationContainer independent={true}>
    <FavStack.Navigator screenOptions={{ headerShown: false }}>
      <FavStack.Screen name="FavoritesMain" component={FavoritesScreen} />
    </FavStack.Navigator>
  </NavigationContainer>
);

const ContactTab = () => (
  <NavigationContainer independent={true}>
    <ContactStack.Navigator screenOptions={{ headerShown: false }}>
      <ContactStack.Screen name="ContactMain" component={ContactScreen} />
    </ContactStack.Navigator>
  </NavigationContainer>
);

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { key: 'Home',      emoji: '🏠', label: 'Home',      Component: HomeTab },
  { key: 'Inventory', emoji: '🚐', label: 'Inventory', Component: InventoryTab },
  { key: 'Deals',     emoji: '🏷️', label: 'Deals',     Component: DealsTab },
  { key: 'Favorites', emoji: '❤️', label: 'Saved',     Component: FavoritesTab },
  { key: 'Contact',   emoji: '📞', label: 'Contact',   Component: ContactTab },
];

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
const TopNavBar = ({ activeTab, onTabPress, favoriteCount }) => (
  <View style={styles.navBar}>
    <View style={styles.brandStrip}>
      <Text style={styles.brandLogo}>♿</Text>
      <Text style={styles.brandName}>Miller Mobility</Text>
    </View>
    <View style={styles.tabRow}>
      {TABS.map((tab) => {
        const focused = activeTab === tab.key;
        const badge   = tab.key === 'Favorites' ? favoriteCount : 0;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, focused && styles.tabItemFocused]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.75}
          >
            <View style={styles.tabIconWrap}>
              <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
                {tab.emoji}
              </Text>
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ─── Root App Navigator ───────────────────────────────────────────────────────
const AppNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const { favoriteCount } = useFavorites();
  const handleTabPress = useCallback((key) => setActiveTab(key), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* TOP NAV BAR — first in the tree so it renders at the top */}
      <TopNavBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        favoriteCount={favoriteCount}
      />

      {/* SCREEN AREA — fills all space below the nav bar */}
      <View style={styles.screenContainer}>
        {TABS.map((tab) => (
          <View
            key={tab.key}
            style={[
              styles.screenSlot,
              activeTab === tab.key ? styles.screenVisible : styles.screenHidden,
            ]}
            pointerEvents={activeTab === tab.key ? 'auto' : 'none'}
          >
            <tab.Component />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  navBar: {
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 100,
  },

  brandStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  brandLogo: { fontSize: 22 },
  brandName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.white,
    letterSpacing: 0.4,
  },

  tabRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.18)',
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemFocused: {
    borderBottomColor: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  tabIconWrap: { position: 'relative' },
  tabEmoji: { fontSize: 18, opacity: 0.6 },
  tabEmojiFocused: { fontSize: 20, opacity: 1 },

  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: Colors.white, fontSize: 9, fontWeight: '700' },

  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  tabLabelFocused: { fontWeight: '700', color: Colors.white },

  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background ?? '#F7F9FC',
  },
  screenSlot: {
    ...StyleSheet.absoluteFillObject,
  },
  screenVisible: { zIndex: 1, opacity: 1 },
  screenHidden:  { zIndex: 0, opacity: 0 },
});

export default AppNavigator;