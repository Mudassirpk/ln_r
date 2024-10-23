import { useAuth } from "@/store/context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Button, Pressable, Dimensions } from "react-native";
import { home } from "./styles";
import { styles } from "@/styles/global";
import CreatePost from "@/components/Feed/CreatePost";
import Feed from "@/components/Feed";
import IonIcons from "@expo/vector-icons/Ionicons";
import Notifications from "@/components/Notifications";

export default function Details() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!user && isMounted) router.push("/");
  }, [user, isMounted]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <View
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        maxHeight: Dimensions.get("window").height,
      }}
    >
      <View style={home.head}>
        <Text>
          Hello, {user?.name}, {user?.email}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View>
            <Pressable onPress={() => logout()}>
              <Text style={styles.logout}>Logout</Text>
            </Pressable>
          </View>
          <View
            style={{
              position: "relative",
            }}
          >
            {user?.notifications?.length &&
            user.notifications?.filter((n) => n.seen !== true).length > 0 ? (
              <View
                style={{
                  position: "absolute",
                  padding: 4,
                  borderRadius: 100,
                  backgroundColor: "red",
                }}
              ></View>
            ) : null}
            <IonIcons
              onPress={() => setShowNotifications(!showNotifications)}
              size={20}
              name="notifications"
            />
          </View>
          {showNotifications && (
            <Notifications notifications={user?.notifications || []} />
          )}
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
