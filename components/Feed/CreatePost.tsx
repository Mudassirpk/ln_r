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

      const file = new File([imageUri.uri], "post-image", { type: "image/*" });
      formData.append("file", file);

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
        queryClient.invalidateQueries({ queryKey: ["get-posts"] });
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
          source={{ uri: imageUri.uri }}
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
                console.log("select res: ", res);
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
