import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { createPost } from "./create-post.style";
import { styles } from "@/styles/global";
import { useAuth } from "@/store/context/auth";
import { useState } from "react";
import { useMutation } from "react-query";
import { httpCommon } from "@/lib/utils";
import Toast from "react-native-toast-message";
import { queryClient } from "@/store/context/query_client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";

export default function CreatePost() {
  const { user, token } = useAuth();
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState<string | null | undefined>(null);

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
    <View style={styles.container}>
      <Text>create post</Text>
      <TextInput
        value={message}
        onChangeText={(message) => setMessage(message)}
        placeholder="What's on your mind!"
        placeholderTextColor={"#aaaaaa"}
        style={createPost.input}
      />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 200, marginTop: 5, borderRadius: 5 }}
        />
      )}
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
                setImageUri(res.assets[0] ? res.assets[0].uri : null);
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
            disabled={status === "loading"}
            onPress={() => {
              if (message.length > 0) {
                mutate();
              }
            }}
          >
            {status === "loading" ? (
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
