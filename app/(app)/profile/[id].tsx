import UserFeed from "@/components/userDetails/user-feed";
import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import { TUser } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

export default function UserProfileScreen() {
  const { token } = useAuth();
  const params = useGlobalSearchParams();
  const navigation = useNavigation();

  const { data: user, isFetching: loading_user } = useQuery<TUser>({
    queryKey: ["get-user-details", params.id],
    async queryFn() {
      return (
        await httpCommon.get(`/auth/user/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  return (
    <View>
      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          flexDirection: "row",
          borderBottomColor: "grey",
          borderBottomWidth: 1,
        }}
      >
        <Link href={"/details"}>
          <Ionicons size={24} name="arrow-back" />
        </Link>
        <Text
          style={{
            padding: 10,
            fontSize: 25,
          }}
        >
          User Details
        </Text>
      </View>
      {loading_user ? (
        <ActivityIndicator />
      ) : (
        <View
          style={{
            padding: 10,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {user?.name}
          </Text>
          <Text
            style={{
              color: "#39373f",
            }}
          >
            {user?.email}
          </Text>
          <View
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "#39373f",
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
                backgroundColor: "#eae8ef",
                borderRadius: 5,
                fontWeight: "600",
              }}
            >
              {user?.posts} Posts
            </Text>
            <Text
              style={{
                color: "#39373f",
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignSelf: "flex-start",
                backgroundColor: "#eae8ef",
                borderRadius: 5,
                fontWeight: "600",
              }}
            >
              Joined {new Date(user?.createdAt as string).toDateString()}
            </Text>
          </View>
        </View>
      )}
      <UserFeed userId={params.id as string} />
    </View>
  );
}
