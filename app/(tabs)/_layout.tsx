import { Tabs } from "expo-router";
import {
  Calendar,
  FileText,
  Home,
  ShieldCheck,
  Vote,
} from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#8B1538",
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopColor: "#E5E7EB",
        borderTopWidth: 1,
        height: 60 + insets.bottom, 
        paddingBottom: insets.bottom, 
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: "600",
      },
    }}
  >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voting"
        options={{
          title: "Mi Voto",
          tabBarIcon: ({ color }) => <Vote size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendario",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="myrole"
        options={{
          title: "Mi Rol",
          tabBarIcon: ({ color }) => <ShieldCheck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="parties"
        options={{
          title: "Partidos",
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
