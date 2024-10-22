import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useQuery } from "react-query";
import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import { TFollower } from "@/types";
import FollowInfo from "./followingInfo";

const Followers = () => {
  const { token, user } = useAuth();
  const { data: followers, isFetching: loading } = useQuery<TFollower[]>({
    queryKey: ["get-user-followers"],
    async queryFn() {
      return (
        await httpCommon.get(`friends/followers/${user?.id}`, {
          headers: {
            token: `Bearer ${token}`,
          },
        })
      ).data;
    },
  });

  return (
    <View
      style={{
        width: "100%",
        padding: 5,
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : followers?.length === 0 ? (
        <Text
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          You don't have any followers
        </Text>
      ) : (
        followers?.map((follower) => (
          <FollowInfo
            userId={follower.followingUser.id}
            type="followers"
            key={follower.id}
            user={follower.followingUser.name}
            email={follower.followingUser.email}
            id={follower.id}
            status={follower.status}
          />
        ))
      )}
    </View>
  );
};

export default Followers;

const styles = StyleSheet.create({});
