import { useAuth } from "@/store/context/auth";
import { Stack } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
  const { loading } = useAuth();
  if (loading) return <Text>Loading.....</Text>;
  return <Stack />;
}
