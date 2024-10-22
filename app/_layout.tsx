import { Slot } from "expo-router";
import AuthProvider from "@/store/provider/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/store/context/query_client";
import Toast from "react-native-toast-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Friends from "./(app)/(tabs)/friends";
import Details from "./(app)/(tabs)/details/index";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./(app)";
import UserProfileScreen from "./(app)/profile/[id]";
import SignUpScreen from "./(app)/signup";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DetailsFriendsTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Details"
        component={Details}
      />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Friends"
        component={Friends}
      />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="(app)/index"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="signup"
            component={SignUpScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="(app)/profile/[id]"
            component={UserProfileScreen}
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            name="(app)/(tabs)/details/index"
            component={DetailsFriendsTabs}
          />
        </Stack.Navigator>
      </AuthProvider>
      {typeof window !== "undefined" ? <Toast /> : null}
    </QueryClientProvider>
  );
}
