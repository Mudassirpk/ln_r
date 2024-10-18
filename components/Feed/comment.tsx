import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import { TComment } from "@/types";
import React, { SetStateAction, useState } from "react";
import { TextInput, Pressable, View, Text } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";

export default function Comment({
  setComments,
  postId,
}: {
  setComments: React.Dispatch<SetStateAction<TComment[]>>;
  postId: string;
}) {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post(
          "comment",
          {
            from: user?.id,
            post: postId,
            message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        Toast.show({
          type: "success",
          text1: response.message,
        });
        setComments((prev) => [...prev, response.comment]);
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    },
  });

  return (
    <View>
      <TextInput
        style={{
          marginTop: 10,
          marginBottom: 5,
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 5,
          padding: 10,
        }}
        value={message}
        onChangeText={(message: string) => setMessage(message)}
        placeholder="give your feedback...."
        placeholderTextColor={"#acb6c4"}
      />
      <View>
        <Pressable
          disabled={status === "loading"}
          onPress={() => {
            if (message.length > 0) {
              mutate();
              setMessage("");
            }
          }}
          style={{
            alignSelf: "flex-end",
            padding: 5,
            borderRadius: 5,
            backgroundColor: "indigo",
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Comment
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
