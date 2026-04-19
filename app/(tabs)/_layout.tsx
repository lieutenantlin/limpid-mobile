import { Tabs } from "expo-router";
import { Droplets, History, PlusSquare, Settings2 } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.surface,
          borderTopColor: Colors.light.border,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Droplets color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="new-scan"
        options={{
          title: "New Scan",
          tabBarIcon: ({ color, size }) => <PlusSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings2 color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
