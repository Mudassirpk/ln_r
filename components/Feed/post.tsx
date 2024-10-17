import { styles } from "@/styles/global";
import { TPost } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import { feed } from "./feed.style";
import * as timeago from "timeago.js";
import { httpCommon } from "@/lib/utils";
import { useMutation } from "react-query";
import { useAuth } from "@/store/context/auth";
import { queryClient } from "@/store/context/query_client";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function Post({ post }: { post: TPost }) {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const { user, token } = useAuth();
  const { mutate: like, status: likeStatus } = useMutation({
    async mutationFn({ post }: { post: string }) {
      return (
        await httpCommon.post(
          "post/like",
          { from: user?.id, post },
          {
            headers: {
              Authorization: token,
            },
          }
        )
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        setLikes((prev) => prev + 1);
        Toast.show({
          type: "success",
          text1: response.message,
        });
        setIsLiked(true);
      }
    },
  });

  useEffect(() => {
    setLikes(post.likes.length);
    const isLiked = post.likes.find((like) => like.from.email === user?.email);
    if (isLiked) {
      setIsLiked(true);
    }
  }, [post]);
  return (
    <View
      style={{ ...styles.container, marginTop: 5, marginBottom: 5 }}
      key={post.id}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 5,
          borderBottomColor: "#e0dede",
          borderBottomWidth: 1,
        }}
      >
        <Text style={feed.user}>{post.author.name}</Text>
        <Text>{timeago.format(post.createdAt)}</Text>
      </View>
      <Text style={{ ...feed.post, paddingBottom: 5 }}>{post.message}</Text>
      <View
        style={{
          borderTopColor: "#e0dede",
          borderTopWidth: 1,
          paddingTop: 5,
          display: "flex",
          gap: 5,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Text>{likes}</Text>
        <View>
          <AntDesign
            onPress={() => {
              if (!isLiked) {
                like({ post: post.id });
              }
            }}
            color={isLiked ? "blue" : "grey"}
            name="like2"
            style={{
              alignSelf: "flex-end",
            }}
            size={24}
          />
        </View>
      </View>
    </View>
  );
}
