import React from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/useStore";
import CustomHeader from "../../components/CustomHeader";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const router = useRouter();

  const guardTabPress = (e: any) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/(auth)/login");
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2f95dc",
        tabBarInactiveTintColor: "gray",
        header: () => <CustomHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      
      {/* תוקן: groups מופיע כעת פעם אחת בלבד */}
      <Tabs.Screen
        name="groups"
        options={{
          title: "My Groups",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => guardTabPress(e),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => guardTabPress(e),
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => guardTabPress(e),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => guardTabPress(e),
        }}
      />
    </Tabs>
  );
}