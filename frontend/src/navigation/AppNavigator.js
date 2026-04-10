import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen         from '../screens/HomeScreen';
import ProductsScreen     from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import DealsScreen        from '../screens/DealsScreen';
import ContactScreen      from '../screens/ContactScreen';
import { COLORS, FONTS } from '../constants/theme';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const STACK_OPTS = {
  headerStyle:           { backgroundColor: COLORS.primary },
  headerTintColor:       COLORS.white,
  headerTitleStyle:      { fontFamily: FONTS.bold, fontSize: 17 },
  headerBackButtonDisplayMode: 'minimal',
};

// Each tab gets its own stack so headers and back-navigation work correctly

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTS}>
      <Stack.Screen name="Home"          component={HomeScreen}          options={{ title: 'Miller Mobility' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={({ route }) => ({ title: route.params?.productName ?? 'Product' })} />
      <Stack.Screen name="Products"      component={ProductsScreen}      options={({ route }) => ({ title: route.params?.categoryName ?? 'Products' })} />
      <Stack.Screen name="Deals"         component={DealsScreen}         options={{ title: 'Deals & Promotions' }} />
      <Stack.Screen name="Contact"       component={ContactScreen}       options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
  );
}

function ProductsStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTS}>
      <Stack.Screen name="Products"      component={ProductsScreen}      options={({ route }) => ({ title: route.params?.categoryName ?? 'Our Products' })} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={({ route }) => ({ title: route.params?.productName ?? 'Product' })} />
      <Stack.Screen name="Contact"       component={ContactScreen}       options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
  );
}

function DealsStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTS}>
      <Stack.Screen name="Deals"   component={DealsScreen}   options={{ title: 'Deals & Promotions' }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Our Products' }} />
      <Stack.Screen name="Contact" component={ContactScreen}  options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
  );
}

function ContactStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTS}>
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
    </Stack.Navigator>
  );
}

const TAB_ICON = {
  Home:     '🏠',
  Products: '🛒',
  Deals:    '🏷️',
  Contact:  '📞',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor:   COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: { borderTopWidth: 1, borderTopColor: COLORS.border },
          tabBarLabelStyle: { fontFamily: FONTS.medium, fontSize: 11 },
          tabBarIcon: () => (
            <Text style={{ fontSize: 20 }}>{TAB_ICON[route.name] ?? '•'}</Text>
          ),
        })}
      >
        <Tab.Screen name="Home"     component={HomeStack}     />
        <Tab.Screen name="Products" component={ProductsStack} />
        <Tab.Screen name="Deals"    component={DealsStack}    />
        <Tab.Screen name="Contact"  component={ContactStack}  />
      </Tab.Navigator>
    </NavigationContainer>
  );
}