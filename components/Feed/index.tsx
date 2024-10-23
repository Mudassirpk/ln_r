import { ActivityIndicator } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { httpCommon } from "@/lib/utils";
import { TPost } from "@/types";
import Post from "./post";
import { ScrollView } from "react-native";
import { useRef } from "react";
import { useAuth } from "@/store/context/auth";

export default function Feed() {
  const scrollRef = useRef(null);
  const { token } = useAuth();

  const {
    data,
    isFetching: loading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["get-infinite-posts"],
    async queryFn({ pageParam }) {
      return (
        await httpCommon.get(`post?cursor=${pageParam || 0}&limit=${10}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam + 1;
    },
    initialPageParam: 0,
    enabled: token !== null,
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

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={100}
      ref={scrollRef}
      style={{
        height: "100%",
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      {data?.pages
        .map((page) => page.posts)
        .flat()
        .map((post: TPost) => {
          return <Post key={post.id} post={post} />;
        })}
      {isFetchingNextPage || loading ? <ActivityIndicator /> : null}
    </ScrollView>
  );
}
