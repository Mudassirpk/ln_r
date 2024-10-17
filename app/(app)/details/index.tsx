import { useAuth } from "@/store/context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { home } from "./styles";
import { styles } from "@/styles/global";
import CreatePost from "@/components/Feed/CreatePost";
import Feed from "@/components/Feed";

export default function Details() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <View style={home.head}>
        <Text>
          Hello, {user?.name}, {user?.email}
        </Text>
        <View>
          <TouchableOpacity onPress={() => logout()}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CreatePost />
      <Text
        style={{
          ...styles.heading,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 5,
        }}
      >
        Posts
      </Text>
      <Feed />
    </View>
  );
}
