import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TFollower, TFollowStatus } from "@/types";
import { useMutation } from "react-query";
import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import Toast from "react-native-toast-message";
import { Link } from "expo-router";

const FollowInfo = ({
  user,
  email,
  status,
  id,
  type,
  userId,
}: {
  user: string;
  email: string;
  status: TFollowStatus;
  id: string;
  type: "followers" | "following";
  userId: string;
}) => {
  const [accepted, setAccepted] = useState(false);

  const { mutate: accept, status: accept_status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post("friends/status/change", {
          id: id,
          status: "ACCEPTED",
        })
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        setAccepted(true);
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    },
  });

  useEffect(() => {
    setAccepted(status === "ACCEPTED");
  }, [status]);

  return (
    <View
      style={{
        width: "100%",
        padding: 5,
        backgroundColor: "#f2f2f7",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 1,
        paddingVertical: 10,
      }}
    >
      <Link
        href={{
          pathname: "/(app)/profile/[id]",
          params: {
            id: userId,
          },
        }}
        style={{
          flex: 1,
          display: "flex",
          gap: 5,
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 18,
          }}
        >
          {user}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: 16,
          }}
        >
          {email}
        </Text>
      </Link>
      {type === "followers" && !accepted ? (
        <Pressable
          onPress={() => accept()}
          disabled={accept_status === "loading"}
          style={{
            padding: 5,
            borderRadius: 5,
            borderColor: "gray",
            borderWidth: 1,
          }}
        >
          {accept_status === "loading" ? (
            <ActivityIndicator />
          ) : (
            <Text>Accept</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
};

export default FollowInfo;

const styles = StyleSheet.create({});
