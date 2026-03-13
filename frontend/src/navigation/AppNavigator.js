import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import DealsScreen from '../screens/DealsScreen';
import ContactScreen from '../screens/ContactScreen';

import { Colors, Typography, Spacing } from '../constants/theme';

const Tab = createBottomTabNavigator();
const InventoryStack = createStackNavigator();
const DealsStack = createStackNavigator();

// ─── Tab Bar Icon ─────────────────────────────────────────────────────────────
const TabIcon = ({ emoji, label, focused }) => (
  <View style={{ alignItems: 'center', paddingTop: 4 }}>
    <Text style={{ fontSize: focused ? 22 : 20 }}>{emoji}</Text>
    <Text
      style={{
        fontSize: 10,
        marginTop: 2,
        fontWeight: focused ? '700' : '400',
        color: focused ? Colors.primary : Colors.gray400,
      }}
    >
      {label}
    </Text>
  </View>
);

// ─── Stack header options ─────────────────────────────────────────────────────
const stackScreenOptions = {
  headerStyle: { backgroundColor: Colors.primary },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.md,
  },
  headerBackTitleVisible: false,
};

// ─── Inventory Stack ──────────────────────────────────────────────────────────
const InventoryNavigator = () => (
  <InventoryStack.Navigator screenOptions={stackScreenOptions}>
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
);

// ─── Deals Stack ──────────────────────────────────────────────────────────────
const DealsNavigator = () => (
  <DealsStack.Navigator screenOptions={stackScreenOptions}>
    <DealsStack.Screen
      name="DealsList"
      component={DealsScreen}
      options={{ title: 'Deals & Offers', headerShown: false }}
    />
  </DealsStack.Navigator>
);

// ─── Root Tab Navigator ───────────────────────────────────────────────────────
const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: Spacing.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🚐" label="Inventory" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏷️" label="Deals" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📞" label="Contact" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;