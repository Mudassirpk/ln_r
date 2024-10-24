import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { createPost } from "./create-post.style";
import { useAuth } from "@/store/context/auth";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { queryClient } from "@/store/context/query_client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import { httpCommon } from "@/lib/utils";

export default function CreatePost() {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState<any>(null);

  const { mutate, status } = useMutation({
    async mutationFn() {
      const formData = new FormData();

      if (imageUri) {
        const file = new File([imageUri.uri], "post-image", {
          type: "image/*",
        });
        formData.append("file", file);
      }

      formData.append("message", message);
      formData.append("userId", user?.id as string);

      return (
        await httpCommon.post("post/create", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        Toast.show({
          type: "success",
          text1: response.message,
        });
        queryClient.invalidateQueries({ queryKey: ["get-infinite-posts"] });
        setImageUri(null);
        setMessage("");
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    },
  });

  return (
    <View
      style={{
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}
    >
      {/* <Text
        style={{
          fontWeight: "600",
          fontSize: 18,
        }}
      >
        create post
      </Text> */}
      <TextInput
        value={message}
        onChangeText={(message) => setMessage(message)}
        placeholder="What's on your mind!"
        placeholderTextColor={"#aaaaaa"}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#F2F2F2",
          marginTop: 10,
          marginBottom: 5,
          paddingVertical: 5,
        }}
      />
      {imageUri ? (
        <Image
          source={{ uri: imageUri.uri }}
          style={{ width: "100%", height: 200, marginTop: 5, borderRadius: 5 }}
        />
      ) : null}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: imageUri ? 5 : 0,
        }}
      >
        <Ionicons
          onPress={() => {
            launchImageLibrary({ mediaType: "photo" }, (res) => {
              if (res.didCancel) {
                Toast.show({
                  type: "info",
                  text1: "Discarded",
                });
              } else if (res.errorMessage) {
                Toast.show({
                  type: "error",
                  text1: res.errorMessage,
                });
              } else if (res.assets && res.assets.length > 0) {
                setImageUri(res.assets[0] ? res.assets[0] : null);
              }
            });
          }}
          name="image"
          size={24}
          style={{ color: "green" }}
        />
        <View>
          <Pressable
            style={{ alignSelf: "flex-end" }}
            disabled={status === "pending"}
            onPress={() => {
              if (message.length > 0) {
                mutate();
              }
            }}
          >
            {status === "pending" ? (
              <ActivityIndicator />
            ) : (
              <Text
                style={{
                  color: "white",
                  ...createPost.button,
                }}
              >
                Create
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
