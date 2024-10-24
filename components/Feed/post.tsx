import { TComment, TPost } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, Image, Pressable } from "react-native";
import { feed } from "./feed.style";
import * as timeago from "timeago.js";
import { extractHashtags, httpCommon } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/store/context/auth";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import Comment from "./comment";
import { Link } from "expo-router";
import Follow from "../userFollowing/follow";

export default function Post({ post }: { post: TPost }) {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState<TComment[]>([]);
  const [showComments, setShowComments] = useState(false);

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
    setComments(post.comments || []);
    const isLiked = post.likes.find((like) => like.from.email === user?.email);
    if (isLiked) {
      setIsLiked(true);
    }
  }, [post]);

  const { textWithoutHashtags, hashtags } = extractHashtags(post.message);

  return (
    <View
      style={{
        backgroundColor: "#f9f9f9",
        marginTop: 2,
        paddingVertical: 10,
        // marginBottom: 5,
      }}
      key={post.id}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: "#e0dede",
          borderBottomWidth: 1,
          paddingHorizontal: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "gray",
              borderRadius: 100,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {post.author.profile_pic ? (
              <Image
                source={{ uri: post.author.profile_pic.url }}
                style={{ width: "100%", height: "100%", borderRadius: 100 }}
              />
            ) : null}
          </View>
          <Link
            href={{
              pathname: "/profile/[id]",
              params: { id: post.author.id },
            }}
            style={feed.user}
          >
            {post.author.name}
          </Link>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text>{timeago.format(post.createdAt)}</Text>
          {post.author.id !== user?.id ? <Follow post={post} /> : null}
        </View>
      </View>
      <View
        style={{
          width: "100%",
        }}
      >
        {post.image ? (
          <Image
            style={{
              width: "100%",
              height: 250,
            }}
            source={{ uri: post.image.url }}
            alt={post.message}
          />
        ) : null}
      </View>
      <Text
        style={{ paddingHorizontal: 10, paddingBottom: 20, paddingTop: 20 }}
      >
        {textWithoutHashtags}
      </Text>
      <View
        style={{
          width: "100%",
          display: "flex",
          gap: 5,
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 5,
          paddingHorizontal: 10,
          flexWrap: "wrap",
        }}
      >
        {hashtags.map((ht) => (
          <Text
            key={ht}
            style={{
              color: "blue",
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: "#f3f2f9",
            }}
          >
            #{ht}
          </Text>
        ))}
      </View>
      <View
        style={{
          borderTopColor: "#e0dede",
          borderTopWidth: 1,
          paddingTop: 10,
          display: "flex",
          gap: 5,
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 5,
          }}
        >
          <Text
            style={{
              color: "black",
            }}
          >
            {comments.length}
          </Text>
          <AntDesign
            onPress={() => setShowComments(!showComments)}
            name="message1"
            size={24}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "flex-end",
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
              name="hearto"
              style={{
                alignSelf: "flex-end",
              }}
              size={24}
            />
          </View>
        </View>
      </View>
      {showComments ? (
        <>
          <Comment setComments={setComments} postId={post.id} />
          <View
            style={{
              borderTopColor: "#f4efef",
              borderTopWidth: 1,
              marginTop: 10,
              padding: 10,
            }}
          >
            {comments.map((comment) => {
              return (
                <View
                  key={comment.id}
                  style={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 5,
                    paddingRight: 5,
                    borderRadius: 5,
                    marginBottom: 5,
                    gap: 5,
                  }}
                >
                  <Link
                    href={{
                      pathname: "/profile/[id]",
                      params: { id: comment.from.id },
                    }}
                    style={{
                      fontWeight: "700",
                      borderLeftWidth: 1,
                      borderLeftColor: "white",
                      paddingLeft: 5,
                    }}
                  >
                    {comment.from.name}
                  </Link>
                  <Text
                    style={{
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    {comment.message}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      ) : null}
    </View>
  );
}
