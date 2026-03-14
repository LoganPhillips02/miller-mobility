/**
 * AppNavigator.js
 * Place this file at: src/navigation/AppNavigator.js
 *
 * Architecture
 * ────────────
 * createBottomTabNavigator hard-wires its layout as [screen][tabBar], so the
 * tab bar always ends up at the bottom. To put it at the top we own the layout:
 *
 *   <SafeAreaView>
 *     <TopNavBar />       ← rendered first → physically at the top
 *     <View flex:1>
 *       {tab screens}     ← each in its own independent NavigationContainer
 *     </View>
 *   </SafeAreaView>
 *
 * Because each tab has its own NavigationContainer (independent={true}),
 * cross-tab calls like navigation.navigate('Inventory') won't work through
 * React Navigation. Instead we expose a TabNavigationContext so screens can
 * call switchTab('Inventory') to change the active tab.
 *
 * Screens that need updating (only cross-tab navigate calls):
 *   - HomeScreen          → replace navigation.navigate('Inventory'/'Deals') with switchTab(...)
 *   - FavoritesScreen     → replace navigation.navigate('Inventory') with switchTab('Inventory')
 *   Within-tab navigation (e.g. ProductDetail, DealDetail) still uses the
 *   normal navigation prop and needs no changes.
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
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

import { useFavorites }         from '../hooks/useFavorites';
import { Colors, Typography, Spacing } from '../constants/theme';
import { TabNavigationContext }  from './TabNavigationContext';

// ─── Stack instances ──────────────────────────────────────────────────────────
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
// Each wraps its own independent NavigationContainer so React Navigation
// doesn't throw "multiple navigators under a single container".

const HomeTab = () => (
  <NavigationContainer independent={true}>
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  </NavigationContainer>
);

const InventoryTab = ({ pendingParams }) => {
  // pendingParams lets HomeScreen pass { category, categoryName } when it
  // switches to this tab. The ref is consumed once by InventoryScreen via
  // route.params (set as initialParams on the screen).
  return (
    <NavigationContainer independent={true}>
      <InventoryStack.Navigator screenOptions={stackHeaderOptions}>
        <InventoryStack.Screen
          name="InventoryList"
          component={InventoryScreen}
          options={{ title: 'Inventory' }}
          initialParams={pendingParams ?? {}}
        />
        <InventoryStack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ route }) => ({ title: route.params?.name ?? 'Product Details' })}
        />
      </InventoryStack.Navigator>
    </NavigationContainer>
  );
};

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
  { key: 'Home',      emoji: '🏠', label: 'Home'      },
  { key: 'Inventory', emoji: '🚐', label: 'Inventory' },
  { key: 'Deals',     emoji: '🏷️', label: 'Deals'     },
  { key: 'Favorites', emoji: '❤️', label: 'Saved'     },
  { key: 'Contact',   emoji: '📞', label: 'Contact'   },
];

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
const TopNavBar = ({ activeTab, onTabPress, favoriteCount }) => (
  <View style={styles.navBar}>
    <View style={styles.brandStrip}>
      <TouchableOpacity onPress={() => onTabPress('Home')} activeOpacity={0.7}>
        <Image
          source={require('../../assets/MM-Logo-DB.webp')}
          style={styles.brandLogoImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
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
  const [inventoryParams, setInventoryParams] = useState(null);
  const { favoriteCount } = useFavorites();

  // switchTab is exposed via context so any screen can call it
  const switchTab = useCallback((tabKey, params) => {
    if (tabKey === 'Inventory' && params) {
      setInventoryParams(params);
    }
    setActiveTab(tabKey);
  }, []);

  const handleTabPress = useCallback((key) => setActiveTab(key), []);

  const tabComponents = {
    Home:      <HomeTab />,
    Inventory: <InventoryTab pendingParams={inventoryParams} />,
    Deals:     <DealsTab />,
    Favorites: <FavoritesTab />,
    Contact:   <ContactTab />,
  };

  return (
    <TabNavigationContext.Provider value={{ switchTab }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

        {/* TOP NAV BAR — first in the tree → renders at the top */}
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
              {tabComponents[tab.key]}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </TabNavigationContext.Provider>
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
    backgroundColor: Colors.white,
  },
  
  brandLogo: { fontSize: 22 },
  brandLogoImg: {
    width: 400,
    height: 120,
  },
  
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
  tabEmoji:        { fontSize: 18, opacity: 0.6 },
  tabEmojiFocused: { fontSize: 20, opacity: 1   },

  badge: {
    position: 'absolute',
    top: -4, right: -8,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16, height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: Colors.white, fontSize: 9, fontWeight: '700' },

  tabLabel:        { fontSize: 10, marginTop: 2, fontWeight: '400', color: 'rgba(255,255,255,0.55)' },
  tabLabelFocused: { fontWeight: '700', color: Colors.white },

  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background ?? '#F7F9FC',
  },
  screenSlot:    { ...StyleSheet.absoluteFillObject },
  screenVisible: { zIndex: 1, opacity: 1 },
  screenHidden:  { zIndex: 0, opacity: 0 },
});

export default AppNavigator;