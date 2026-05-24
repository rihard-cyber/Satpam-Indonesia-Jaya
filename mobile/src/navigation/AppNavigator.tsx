import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MateriScreen from '../screens/MateriScreen';
import LokerScreen from '../screens/LokerScreen';
import ForumScreen from '../screens/ForumScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SertifikatScreen from '../screens/SertifikatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Materi: '📚',
    Loker: '💼',
    Forum: '💬',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: size - 4 }}>{icons[name] || '📄'}</Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <TabIcon name={route.name} color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: {
          backgroundColor: COLORS.navy[900],
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 1,
          paddingTop: 4,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.navy[900],
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="Materi" component={MateriScreen} />
      <Tab.Screen name="Loker" component={LokerScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.gold,
          background: COLORS.navy[900],
          card: COLORS.navy[800],
          text: COLORS.white,
          border: 'rgba(255,255,255,0.08)',
          notification: COLORS.accent.red,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.navy[900] },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AIAssistant" component={AIAssistantScreen} options={{ title: 'AI Assistant' }} />
        <Stack.Screen name="Sertifikat" component={SertifikatScreen} options={{ title: 'Sertifikat' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
