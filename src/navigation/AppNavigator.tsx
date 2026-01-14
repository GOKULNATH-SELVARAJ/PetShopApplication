import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PetUploadScreen from '../screens/PetUploadScreen';
import PetListingScreen from '../screens/PetListingScreen';
import CartScreen from '../screens/CartScreen';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useCartStore } from '../store/cartStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabBarIcon = ({
  emoji,
  focused,
}: {
  emoji: string;
  focused: boolean;
}) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>{emoji}</Text>
  </View>
);

const TabBarBadge = ({ count }: { count: number }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
  </View>
);

const HomeTabs = () => {
  const cartCount = useCartStore(state => state.getCartCount());

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        headerTintColor: '#212529',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 88,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: '#6c757d',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="PetListing"
        component={PetListingScreen}
        options={{
          title: 'Pet Shop',
          tabBarLabel: 'Shop',
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
            top: 16,
            // bottom:5,
          },

          tabBarIcon: ({ focused }) => (
            <TabBarIcon emoji="🐾" focused={focused} />
          ),
          tabBarIconStyle: {
            bottom: 5,
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel:'Cart',
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
            top: 16,
            // bottom:5,
          },
          tabBarIcon: ({ focused }) => (
            <View>
              <TabBarIcon emoji="🛒" focused={focused} />
              {cartCount > 0 && <TabBarBadge count={cartCount} />}
            </View>
          ),
          tabBarIconStyle: {
            bottom: 5,
          },
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          // elevation: 0,
          // shadowOpacity: 0,
          // borderBottomWidth: 1,
          // borderBottomColor: '#f0f0f0',
        },
        headerTintColor: '#212529',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 28,
        },
        // headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PetUpload"
        component={PetUploadScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: '#e8f5e9',
  },
  icon: {
    fontSize: 24,
  },
  iconFocused: {
    fontSize: 22,
    transform: [{ scale: 1.1 }],
  },
  badge: {
    position: 'absolute',
    // top: -4,
    right: -8,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
    top: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
