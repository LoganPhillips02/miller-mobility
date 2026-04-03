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
  Dimensions,
  Animated,
  Platform,
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
import ADRCScreen          from '../screens/ADRCScreen';

import { Colors, Typography, Spacing } from '../constants/theme';
import { WEB_BODY_MAX_WIDTH, WEB_BODY_SIDE_INSET } from '../constants/webLayout';
import { TabNavigationContext } from './TabNavigationContext';

// ─── Screen dimensions ────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

// Height of the white brand strip — used for the collapse animation
const BRAND_STRIP_HEIGHT = IS_MOBILE ? SCREEN_WIDTH * 0.15 + Spacing.xs * 2 : SCREEN_WIDTH * 0.09 + Spacing.xs * 2;
// How many px of scroll before the strip is fully hidden
const COLLAPSE_SCROLL = 60;

// ─── Stack instances ──────────────────────────────────────────────────────────
const HomeStack      = createStackNavigator();
const InventoryStack = createStackNavigator();
const DealsStack     = createStackNavigator();
const RentalsStack   = createStackNavigator();
const AboutStack     = createStackNavigator();
const ContactStack   = createStackNavigator();
const ADRCStack      = createStackNavigator();

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
        options={{ headerShown: false }}
        initialParams={pendingParams ?? {}}
      />
      <InventoryStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
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

const ADRCTab = () => (
  <NavigationContainer independent={true}>
    <ADRCStack.Navigator screenOptions={{ headerShown: false }}>
      <ADRCStack.Screen name="ADRCMain" component={ADRCScreen} />
    </ADRCStack.Navigator>
  </NavigationContainer>
);

// ─── Tab config ───────────────────────────────────────────────────────────────
// ADRC is intentionally omitted from the visible tab bar — it is only accessible
// via the homepage banner. It still lives as a tab slot so switchTab('ADRC') works.
const TABS = [
  { key: 'Inventory', icon: require('../../assets/navbar/mobility-scooter.png'), label: 'Products' },
  { key: 'Deals',     icon: require('../../assets/navbar/deals.png'),            label: 'Deals'    },
  { key: 'Rentals',   icon: require('../../assets/navbar/rentals.png'),          label: 'Rentals'  },
  { key: 'About',     icon: require('../../assets/navbar/about-us.png'),         label: 'About Us' },
  { key: 'Contact',   icon: require('../../assets/navbar/white-phone.png'),      label: 'Contact'  },
];

// ─── Top Navigation Bar ───────────────────────────────────────────────────────
const TopNavBar = ({ activeTab, onTabPress, scrollY }) => {
  const brandStripHeight = IS_MOBILE
    ? BRAND_STRIP_HEIGHT
    : scrollY.interpolate({
        inputRange: [0, COLLAPSE_SCROLL],
        outputRange: [BRAND_STRIP_HEIGHT, 0],
        extrapolate: 'clamp',
      });

  const brandStripOpacity = IS_MOBILE
    ? 1
    : scrollY.interpolate({
        inputRange: [0, COLLAPSE_SCROLL * 0.6],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });

  return (
    <View style={styles.navBar}>

      {/* ── Brand strip ── */}
      <Animated.View
        style={[
          styles.brandStrip,
          { height: brandStripHeight, opacity: brandStripOpacity, overflow: 'hidden' },
        ]}
      >
        {/* Left: Logo */}
        <TouchableOpacity onPress={() => onTabPress('Home')} activeOpacity={0.8} style={styles.brandLeft}>
          <Image
            source={require('../../assets/home/MM-Logo.webp')}
            style={styles.brandLogoImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Center: Phone */}
        <View style={styles.brandCenter}>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+12625494900')} activeOpacity={0.7} style={styles.phoneRow}>
            <Image
              source={require('../../assets/navbar/red-phone.png')}
              style={styles.phoneIcon}
              resizeMode="contain"
            />
            <Text style={styles.phoneBarText}>262-549-4900</Text>
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
      </Animated.View>

      {/* ── Tab row — only shows the 5 main tabs, not ADRC ── */}
      <View style={styles.tabRow}>
        {Platform.OS === 'web' && !IS_MOBILE ? (
          <View style={styles.tabRowDesktopOuter}>
            <View style={styles.tabRowDesktopInner}>
              {TABS.map((tab) => {
                const focused = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.tabItem, focused && styles.tabItemFocused]}
                    onPress={() => onTabPress(tab.key)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.tabInnerDesktop}>
                      <Image
                        source={tab.icon}
                        style={[styles.tabIcon, focused && styles.tabIconFocused]}
                        resizeMode="contain"
                      />
                      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                        {tab.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          TABS.map((tab) => {
            const focused = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, focused && styles.tabItemFocused]}
                onPress={() => onTabPress(tab.key)}
                activeOpacity={0.75}
              >
                {IS_MOBILE ? (
                  <>
                    <Image
                      source={tab.icon}
                      style={[styles.tabIcon, focused && styles.tabIconFocused]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                      {tab.label}
                    </Text>
                  </>
                ) : (
                  <View style={styles.tabInnerDesktop}>
                    <Image
                      source={tab.icon}
                      style={[styles.tabIcon, focused && styles.tabIconFocused]}
                      resizeMode="contain"
                    />
                    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
                      {tab.label}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

    </View>
  );
};

// ─── Root App Navigator ───────────────────────────────────────────────────────
const AppNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [inventoryParams, setInventoryParams] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const switchTab = useCallback((tabKey, params) => {
    if (tabKey === 'Inventory' && params) setInventoryParams(params);
    setActiveTab(tabKey);
    scrollY.setValue(0);
  }, [scrollY]);

  const handleTabPress = useCallback((key) => {
    setActiveTab(key);
    scrollY.setValue(0);
  }, [scrollY]);

  const tabComponents = {
    Home:      <HomeTab />,
    Inventory: <InventoryTab pendingParams={inventoryParams} />,
    Deals:     <DealsTab />,
    Rentals:   <RentalsTab />,
    About:     <AboutTab />,
    Contact:   <ContactTab />,
    ADRC:      <ADRCTab />,
  };

  return (
    <TabNavigationContext.Provider value={{ switchTab, scrollY }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

        <TopNavBar
          activeTab={activeTab}
          onTabPress={handleTabPress}
          scrollY={scrollY}
        />

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

  // ── Brand strip ──
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
    flex: 2,
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

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  phoneIcon: {
    width:  IS_MOBILE ? 18 : 28,
    height: IS_MOBILE ? 18 : 28,
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
  tabRowDesktopOuter: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  tabRowDesktopInner: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: WEB_BODY_MAX_WIDTH,
    paddingHorizontal: WEB_BODY_SIDE_INSET,
    backgroundColor: Colors.primary,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemFocused: {
    borderBottomColor: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  tabIcon: {
    width: IS_MOBILE? 30 : 40,
    height: IS_MOBILE? 30 : 40,
    opacity: 0.7,
    tintColor: Colors.white,
  },
  tabInnerDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tabIconFocused: {
    opacity: 1,
  },

  tabLabel:        { 
    fontSize: IS_MOBILE ? 16 : 30, 
    marginTop: IS_MOBILE ? 6 : 0, 
    fontWeight: '400', 
    color: 'rgba(255, 255, 255, 0.7)' 
  },
  tabLabelFocused: { 
    fontWeight: '700', 
    color: Colors.white 
  },

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