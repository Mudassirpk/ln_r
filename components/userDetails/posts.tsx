import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TPost } from "@/types";
import Post from "../Feed/post";
import { useQuery } from "react-query";
import { httpCommon } from "@/lib/utils";

const Posts = ({ userId }: { userId: string }) => {
  const { data: posts, isFetching: loading } = useQuery<TPost[]>({
    queryKey: ["posts-by-user"],
    async queryFn() {
      return (await httpCommon.get("post/" + userId)).data;
    },
  });
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        gap: 5,
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        posts?.map((post) => {
          return <Post key={post.id} post={post} />;
        })
      )}
    </View>
  );
};

export default Posts;

const styles = StyleSheet.create({});
