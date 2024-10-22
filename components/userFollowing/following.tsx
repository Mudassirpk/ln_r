import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@/store/context/auth";
import { useQuery } from "react-query";
import { httpCommon } from "@/lib/utils";
import { TFollower } from "@/types";
import FollowInfo from "./followingInfo";

const Following = () => {
  const { token, user } = useAuth();

  const { data: followings, isFetching: laoding } = useQuery<TFollower[]>({
    queryKey: ["get-user-following"],
    async queryFn() {
      return (
        await httpCommon.get("friends/followings/" + user?.id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
  });

  return (
    <View
      style={{
        width: "100%",
        padding: 10,
      }}
    >
      {laoding ? (
        <ActivityIndicator />
      ) : (
        followings?.map((following) => (
          <FollowInfo
            userId={following.followedUser.id}
            user={following.followedUser.name}
            email={following.followedUser.email}
            id={following.id}
            key={following.id}
            status={following.status}
            type="following"
          />
        ))
      )}
    </View>
  );
};

export default Following;

const styles = StyleSheet.create({});
