import { Text, Dimensions } from "react-native";
import { useQuery } from "react-query";
import { httpCommon } from "@/lib/utils";
import { TPost } from "@/types";
import Post from "./post";
import { ScrollView, SafeAreaView } from "react-native";

export default function Feed() {
  const { data: posts, isFetching } = useQuery<TPost[]>({
    queryKey: ["get-posts"],
    async queryFn() {
      return (await httpCommon.get("post")).data;
    },
  });

  return isFetching ? (
    <Text>Loading....</Text>
  ) : (
    <SafeAreaView>
      <ScrollView
        style={{
          height: Dimensions.get("window").height - (31 + 116 + 44),
        }}
      >
        {posts?.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
