import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen          from '../screens/HomeScreen';
import InventoryScreen     from '../screens/InventoryScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import DealsScreen         from '../screens/DealsScreen';
import DealDetailScreen    from '../screens/DealDetailScreen';
import ContactScreen       from '../screens/ContactScreen';
import RentalsScreen       from '../screens/RentalsScreen';
import AboutScreen         from '../screens/AboutScreen';

import { Colors, Typography, Spacing } from '../constants/theme';
import { TabNavigationContext } from './TabNavigationContext';

// ─── Screen dimensions ────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

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
const HomeTab = () => (
  <NavigationContainer independent={true}>
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  </NavigationContainer>
);

const InventoryTab = ({ pendingParams }) => (
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
  { key: 'Inventory', emoji: '🚐', label: 'Products' },
  { key: 'Deals',     emoji: '🏷️', label: 'Deals'    },
  { key: 'Rentals',   emoji: '🔑', label: 'Rentals'  },
  { key: 'About',     emoji: 'ℹ️',  label: 'About Us' },
  { key: 'Contact',   emoji: '📞', label: 'Contact'  },
];

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
const TopNavBar = ({ activeTab, onTabPress }) => (
  <View style={styles.navBar}>

    {/* ── Header strip: logo / phone / info ── */}
    <View style={styles.brandStrip}>

      {/* Left: Logo */}
      <TouchableOpacity onPress={() => onTabPress('Home')} activeOpacity={0.8} style={styles.brandLeft}>
        <Image
          source={require('../../assets/MM-Logo-DB.webp')}
          style={styles.brandLogoImg}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Center: Phone */}
      <View style={styles.brandCenter}>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+12625494900')} activeOpacity={0.7}>
          <Text style={styles.phoneBarText}>📞 262-549-4900</Text>
        </TouchableOpacity>
        {!IS_MOBILE && (
          <Text style={styles.phoneSubText}>Call today to speak to a product expert!</Text>
        )}
      </View>

      {/* Right: Hours + Address — desktop only */}
      {!IS_MOBILE && (
        <View style={styles.brandRight}>
          <Text style={styles.hoursText}>SHOWROOM HOURS: M–F: 9–5 · SAT: 10–2</Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://maps.google.com/?q=36336+N+Summit+Village+Way+Oconomowoc+WI+53066')}
            activeOpacity={0.7}
          >
            <Text style={styles.addressText}>36336 N. Summit Village Way Oconomowoc, WI 53066</Text>
          </TouchableOpacity>
          <Text style={styles.taglineText}>
            Stair Lifts, Scooters, Lift Chairs & More{'\n'}Family Owned Since 2004!
          </Text>
        </View>
      )}
    </View>

    {/* ── Tab row ── */}
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
            <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>
              {tab.emoji}
            </Text>
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

        <TopNavBar activeTab={activeTab} onTabPress={handleTabPress} />

        <View style={styles.screenContainer}>
          {Object.keys(tabComponents).map((key) => (
            <View
              key={key}
              style={[
                styles.screenSlot,
                activeTab === key ? styles.screenVisible : styles.screenHidden,
                { pointerEvents: activeTab === key ? 'auto' : 'none' },
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

  // ── Outer nav wrapper ──
  navBar: {
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 100,
  },

  // ── Header strip ──
  brandStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  brandLeft: {
    flex: 2,
    justifyContent: 'center',
  },
  brandCenter: {
    flex: IS_MOBILE ? 2 : 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRight: {
    flex: 3,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  brandLogoImg: {
    width:  IS_MOBILE ? SCREEN_WIDTH * 0.5 : SCREEN_WIDTH * 0.28,
    height: IS_MOBILE ? SCREEN_WIDTH * 0.15 : SCREEN_WIDTH * 0.09,
  },

  phoneBarText: {
    fontSize: IS_MOBILE ? Typography.sizes.md : Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.error,
    textAlign: 'center',
  },
  phoneSubText: {
    fontSize: IS_MOBILE ? 8 : Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 1,
  },
  hoursText: {
    fontSize: IS_MOBILE ? 8 : Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.error,
    textAlign: 'right',
  },
  addressText: {
    fontSize: IS_MOBILE ? 8 : Typography.sizes.lg,
    color: Colors.gray600,
    textAlign: 'right',
    lineHeight: IS_MOBILE ? 11 : 18,
    marginTop: 5,
  },
  taglineText: {
    fontSize: IS_MOBILE ? 8 : Typography.sizes.lg,
    color: Colors.gray600,
    textAlign: 'right',
    lineHeight: IS_MOBILE ? 11 : 18,
    marginTop: 7,
    fontStyle: 'italic',
  },

  // ── Tab row ──
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: IS_MOBILE ? Spacing.md : Spacing.lg,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemFocused: {
    borderBottomColor: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabEmoji:        { fontSize: 25, opacity: 0.6 },
  tabEmojiFocused: { fontSize: 26, opacity: 1   },
  tabLabel:        { fontSize: IS_MOBILE ? 12 : 20, marginTop: 1, fontWeight: '400', color: 'rgba(255,255,255,0.55)' },
  tabLabelFocused: { fontWeight: '700', color: Colors.white },

  // ── Screen slots ──
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background ?? '#F7F9FC',
  },
  screenSlot:    { ...StyleSheet.absoluteFillObject },
  screenVisible: { zIndex: 1, opacity: 1 },
  screenHidden:  { zIndex: 0, opacity: 0 },
});

export default AppNavigator;