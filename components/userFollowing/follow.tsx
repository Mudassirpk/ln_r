import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TPost } from "@/types";
import { useAuth } from "@/store/context/auth";
import { useMutation } from "@tanstack/react-query";
import { httpCommon } from "@/lib/utils";
import Toast from "react-native-toast-message";

const Follow = ({ post }: { post: TPost }) => {
  const [following, setFollowing] = useState(false);

  const { user } = useAuth();
  function isFollowing() {
    const following = post.author.followers?.find(
      (follower) => follower.followingUserId === user?.id
    );
    return following ? true : false;
  }

  const { mutate: follow, status: follow_status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post("friends/create", {
          followingUserId: user?.id,
          followedUserId: post.author.id,
        })
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        Toast.show({
          type: "success",
          text1: response.message,
        });
        setFollowing(true);
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    },
  });

  useEffect(() => {
    setFollowing(isFollowing());
  }, [post]);

  return (
    <Pressable
      onPress={() => follow()}
      disabled={follow_status === "pending" || following}
      style={{
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
      }}
    >
      {follow_status === "pending" ? (
        <ActivityIndicator />
      ) : (
        <Text>{following ? "Following" : "Follow"}</Text>
      )}
    </Pressable>
  );
};

export default Follow;

const styles = StyleSheet.create({});
