import React, { useState, useCallback, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen          from '../screens/HomeScreen';
import InventoryScreen     from '../screens/InventoryScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import DealsScreen         from '../screens/DealsScreen';
import DealDetailScreen    from '../screens/DealDetailScreen';
import ContactScreen       from '../screens/ContactScreen';
import RentalsScreen  from '../screens/RentalsScreen';
import AboutScreen    from '../screens/AboutScreen';

import { Colors, Typography, Spacing } from '../constants/theme';
import { TabNavigationContext }  from './TabNavigationContext';
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Stack instances ──────────────────────────────────────────────────────────
const HomeStack      = createStackNavigator();
const InventoryStack = createStackNavigator();
const DealsStack     = createStackNavigator();
const RentalsStack   = createStackNavigator();
const AboutStack     = createStackNavigator();
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

const RentalsTab = () => (
  <NavigationContainer independent={true}>
    <RentalsStack.Navigator screenOptions={{ headerShown: false }}>
      <RentalsStack.Screen name="RentalsMain" component={RentalsScreen} />
    </RentalsStack.Navigator>
  </NavigationContainer>
);

const AboutTab = () => (
  <NavigationContainer independent={true}>
    <AboutStack.Navigator screenOptions={{ headerShown: false }}>
      <AboutStack.Screen name="AboutMain" component={AboutScreen} />
    </AboutStack.Navigator>
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
  { key: 'Inventory', emoji: '🚐', label: 'Products'  },
  { key: 'Deals',     emoji: '🏷️', label: 'Deals'     },
  { key: 'Rentals',   emoji: '🔑', label: 'Rentals'   },
  { key: 'About',     emoji: 'ℹ️',  label: 'About Us' },
  { key: 'Contact',   emoji: '📞', label: 'Contact'   },
];

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
const TopNavBar = ({ activeTab, onTabPress }) => (
  <View style={styles.navBar}>
    <View style={styles.brandStrip}>
      <TouchableOpacity onPress={() => onTabPress('Home')} activeOpacity={0.7}>
        <Image
          source={require('../../assets/MM-Logo-DB.webp')}
          style={styles.brandLogoImg}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.phoneBar}
        onPress={() => Linking.openURL('tel:+12625494900')}
        activeOpacity={0.7}
      >
        <Text style={styles.phoneBarText}>📞 262-549-4900</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.tabRow}>
      {TABS.map((tab) => {
        const focused = activeTab === tab.key;
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

  const switchTab = useCallback((tabKey, params) => {
    if (tabKey === 'Inventory' && params) setInventoryParams(params);
    setActiveTab(tabKey);
  }, []);

  const handleTabPress = useCallback((key) => setActiveTab(key), []);

  const tabComponents = {
    Home:      <HomeTab />,
    Inventory: <InventoryTab pendingParams={inventoryParams} />,
    Deals:     <DealsTab />,
    Rentals:   <RentalsTab />,
    About:     <AboutTab />,
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
        />

        {/* SCREEN AREA — fills all space below the nav bar */}
        <View style={styles.screenContainer}>
          {Object.keys(tabComponents).map((key) => (
            <View
              key={key}
              style={[
                styles.screenSlot,
                activeTab === key ? styles.screenVisible : styles.screenHidden,
                { pointerEvents: activeTab === key ? 'auto' : 'none' },  // ← move here
              ]}
            >
              {tabComponents[key]}
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: 0,
    backgroundColor: Colors.white,
  },

  brandLogo: { fontSize: 22 },
  brandLogoImg: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_WIDTH * 0.08,
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
    paddingVertical: Spacing.xs,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemFocused: {
    borderBottomColor: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  tabIconWrap: { position: 'relative' },
  tabEmoji: { fontSize: 16, opacity: 0.6 },
  tabEmojiFocused: { fontSize: 17, opacity: 1 },

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

  tabLabel: {
    fontSize: 9,
    marginTop: 1,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  tabLabelFocused: { fontWeight: '700', color: Colors.white },

  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background ?? '#F7F9FC',
  },
  screenSlot:    { ...StyleSheet.absoluteFillObject },
  screenVisible: { zIndex: 1, opacity: 1 },
  screenHidden:  { zIndex: 0, opacity: 0 },

  phoneBar: {
    backgroundColor: Colors.white,
    paddingVertical: 3,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
  },

  phoneBarText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});

export default AppNavigator;