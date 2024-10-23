import UserFeed from "@/components/userDetails/user-feed";
import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import { TUser } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";

export default function UserProfileScreen() {
  const { token } = useAuth();
  const params = useGlobalSearchParams();
  const [image, setImage] = useState<any | null>(null);

  const { data: user, isFetching: loading_user } = useQuery<TUser>({
    queryKey: ["get-user-details", params.id],
    async queryFn() {
      return (
        await httpCommon.get(`/auth/user/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
  });

  const { mutate: upload_profile_pic, status: profile_pic_status } =
    useMutation({
      async mutationFn() {
        const formData = new FormData();
        const file = new File([image.uri], "image", {
          type: "image/*",
        });
        formData.append("image", file);
        return await httpCommon.post("auth/profile-pic", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      },
    });

  function chooseImage() {
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
        setImage(res.assets[0] ? res.assets[0] : null);
      }
    });
  }

  useEffect(() => {
    if (image !== user?.profile_pic?.url) {
      upload_profile_pic();
    }
  }, [image]);

  useEffect(() => {
    if (user && user.profile_pic) {
      setImage(user.profile_pic.url);
    }
  }, [user]);

  return (
    <View>
      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 5,
          flexDirection: "row",
          borderBottomColor: "grey",
          borderBottomWidth: 1,
          paddingRight: 20,
        }}
      >
        <Link href={"/details"}>
          <Ionicons size={24} name="arrow-back" />
        </Link>
        <Text
          style={{
            padding: 10,
            fontSize: 25,
          }}
        >
          User Details
        </Text>
      </View>
      {loading_user ? (
        <ActivityIndicator />
      ) : (
        <View
          style={{
            padding: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 86,
              height: 86,
              backgroundColor: "gray",
              borderRadius: 100,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {profile_pic_status === "pending" ? (
              <ActivityIndicator />
            ) : (
              image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%", borderRadius: 100 }}
                />
              )
            )}
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                bottom: 0,
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  height: "50%",
                  backgroundColor: "rgba(211, 211, 211, 0.5)",
                }}
              >
                <AntDesign
                  name="edit"
                  size={22}
                  onPress={chooseImage}
                  style={{
                    marginHorizontal: "auto",
                    marginTop: 5,
                    color: "white",
                  }}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {user?.posts}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Post
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {user?.followers.length}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Followers
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {user?.following.length}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Following
            </Text>
          </View>
        </View>
      )}
      <UserFeed userId={params.id as string} />
    </View>
  );
}
