import { Slot } from "expo-router";
import AuthProvider from "@/store/provider/auth";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/store/context/query_client";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
      <Toast />
    </QueryClientProvider>
  );
}
