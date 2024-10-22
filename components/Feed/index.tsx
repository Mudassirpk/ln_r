import { Text, Dimensions, ActivityIndicator } from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { httpCommon } from "@/lib/utils";
import { TPost } from "@/types";
import Post from "./post";
import { ScrollView, SafeAreaView } from "react-native";
import { useRef, useState } from "react";

export default function Feed() {
  const [cursor, setCursor] = useState(0);
  const [limit, setLimit] = useState(10);

  const scrollRef = useRef(null);

  const { data: posts, isFetching } = useQuery<TPost[]>({
    queryKey: ["get-posts"],
    async queryFn() {
      return (await httpCommon.get("post")).data;
    },
  });

  const {
    data,
    isFetching: loading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["get-infinite-posts"],
    async queryFn({ pageParam }) {
      return (await httpCommon.get(`post?cursor=${pageParam || 0}&limit=${5}`))
        .data;
    },
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    initialPageParam: 0,
  });

  const handleScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollPosition = event.nativeEvent.contentOffset.y;

    // Check if scrolled to the bottom
    if (scrollPosition + scrollHeight >= contentHeight) {
      if (!loading && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  return isFetching ? (
    <Text>Loading....</Text>
  ) : (
    <SafeAreaView>
      <ScrollView
        onScroll={handleScroll}
        ref={scrollRef}
        style={{
          height: Dimensions.get("window").height + (31 + 116 + 44),
        }}
      >
        {data?.pages
          .map((page) => page.posts)
          .flat()
          .map((post: TPost) => {
            return <Post key={post.id} post={post} />;
          })}
        {isFetchingNextPage ? <ActivityIndicator /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
