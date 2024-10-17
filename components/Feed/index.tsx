import { styles } from "@/styles/global";
import { View, Text } from "react-native";
import { feed } from "./feed.style";
import { useAuth } from "@/store/context/auth";
import { useMutation, useQuery } from "react-query";
import { httpCommon } from "@/lib/utils";
import { TPost } from "@/types";
import * as timeago from "timeago.js";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { queryClient } from "@/store/context/query_client";
import Post from "./post";
import { ScrollView } from "react-native";

export default function Feed() {
  const { user, token } = useAuth();
  const { data: posts, isFetching } = useQuery<TPost[]>({
    queryKey: ["get-posts"],
    async queryFn() {
      return (await httpCommon.get("post")).data;
    },
  });

  return isFetching ? (
    <Text>Loading....</Text>
  ) : (
    <ScrollView
      style={{
        height: "100%",
      }}
    >
      {posts?.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </ScrollView>
  );
}
