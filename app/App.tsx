import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './src/theme';
import { ActivityIndicator, Platform, View } from 'react-native';
import { StoreProvider, useStore } from './src/store';
import { LoginScreen, OtpScreen } from './src/authScreens';
import { DetailScreen, ExploreScreen, HomeScreen, ProfileScreen, SavedScreen } from './src/screens';
import { CategoryScreen } from './src/CategoryScreen';
import { LocationScreen } from './src/LocationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons: Record<string, [string, string]> = {
  Home: ['home', 'home-outline'],
  Explore: ['compass', 'compass-outline'],
  Helpers: ['people', 'people-outline'],
  Saved: ['heart', 'heart-outline'],
  Profile: ['person', 'person-outline'],
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800', marginBottom: 6 },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 14,
          height: 68,
          paddingTop: 8,
          borderRadius: 26,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowColor: '#14202B',
          shadowOpacity: 0.15,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={(icons[route.name][focused ? 0 : 1]) as any} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Helpers" component={CategoryScreen} initialParams={{ category: 'helper', tab: true }} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready, user, guest } = useStore();
  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }
  const signedIn = !!user || guest;
  return (
    <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary } }}>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {signedIn ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="Location" component={LocationScreen} options={{ presentation: 'modal' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        {/* On desktop web, show the app in a centred phone-width column */}
        <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#E8E2D8' : colors.bg, alignItems: 'center' }}>
          <View style={{ flex: 1, width: '100%', maxWidth: 440, backgroundColor: colors.bg, overflow: 'hidden' }}>
            <Root />
          </View>
        </View>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
