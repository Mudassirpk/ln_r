import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { createPost } from "./create-post.style";
import { styles } from "@/styles/global";
import { useAuth } from "@/store/context/auth";
import { useState } from "react";
import { useMutation } from "react-query";
import { httpCommon } from "@/lib/utils";
import Toast from "react-native-toast-message";
import { queryClient } from "@/store/context/query_client";

export default function CreatePost() {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post(
          "post/create",
          { message, userId: user?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      ).data;
    },
    onSettled(response) {
      if (response.success) {
        Toast.show({
          type: "success",
          text1: response.message,
        });
        queryClient.invalidateQueries({ queryKey: ["get-posts"] });
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text>create post</Text>
      <TextInput
        value={message}
        onChangeText={(message) => setMessage(message)}
        placeholder="What's on your mind !"
        placeholderTextColor={"#aaaaaa"}
        style={createPost.input}
      ></TextInput>
      <View>
        <View>
          <TouchableOpacity
            disabled={status === "loading"}
            onPress={() => {
              if (message.length > 0) {
                mutate();
              }
            }}
          >
            <Text
              style={{
                color: "white",
                ...createPost.button,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
