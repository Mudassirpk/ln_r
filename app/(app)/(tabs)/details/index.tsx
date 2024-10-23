import { useAuth } from "@/store/context/auth";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { styles } from "@/styles/global";
import CreatePost from "@/components/Feed/CreatePost";
import Feed from "@/components/Feed";
import IonIcons from "@expo/vector-icons/Ionicons";
import { CommonActions, useNavigation } from "@react-navigation/native";

export default function Details() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!user && isMounted) router.push("/");
  }, [user, isMounted]);

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        maxHeight: Dimensions.get("window").height,
        backgroundColor: "#F2F2F2",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 3,
          paddingHorizontal: 5,
          paddingVertical: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Link
          href={{
            pathname: "/profile/[id]",
            params: {
              id: user?.id as string,
            },
          }}
          style={{
            fontWeight: "600",
          }}
        >
          Hello, {user?.name}, {user?.email}
        </Link>
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
            <View>
              <IonIcons
                onPress={() =>
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: "(app)/notifications",
                      path: "(app)/notifications",
                    })
                  )
                }
                size={20}
                name="notifications"
              />
            </View>
          </View>
        </View>
      </View>
      <CreatePost />
      <Text
        style={{
          marginTop: 5,
          backgroundColor: "white",
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
