import { styles } from "@/styles/global";
import { TComment, TPost } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text, Image } from "react-native";
import { feed } from "./feed.style";
import * as timeago from "timeago.js";
import { httpCommon } from "@/lib/utils";
import { useMutation } from "react-query";
import { useAuth } from "@/store/context/auth";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import Comment from "./comment";
import { Link } from "expo-router";

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
        <Link
          href={{
            pathname: "/profile/[id]",
            params: { id: post.author.id },
          }}
          style={feed.user}
        >
          {post.author.name}
        </Link>
        <Text>{timeago.format(post.createdAt)}</Text>
      </View>
      <Text style={{ ...feed.post, paddingBottom: 20, paddingTop: 20 }}>
        {post.message}
      </Text>
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
              borderRadius: 5,
            }}
            source={{ uri: post.image.url }}
            alt={post.message}
          />
        ) : null}
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
            {" "}
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
      {showComments && (
        <>
          <Comment setComments={setComments} postId={post.id} />
          <View style={{ ...styles.roundedBorder, marginTop: 10, padding: 10 }}>
            {comments.map((comment) => {
              return (
                <View
                  key={comment.id}
                  style={{
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#e5e7ea",
                    paddingLeft: 5,
                    paddingRight: 5,
                    borderRadius: 5,
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    {comment.message}
                  </Text>
                  <Link
                    href={{
                      pathname: "/profile/[id]",
                      params: { id: comment.from.id },
                    }}
                    style={{
                      borderLeftWidth: 1,
                      borderLeftColor: "white",
                      paddingLeft: 5,
                      backgroundColor: "indigo",
                    }}
                  >
                    {comment.from.name}
                  </Link>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}
