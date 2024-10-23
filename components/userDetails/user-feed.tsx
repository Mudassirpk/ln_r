import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import Posts from "./posts";
import { SafeAreaView } from "react-native-safe-area-context";
import Followers from "./followers";
import Following from "./following";

const UserFeed = ({ userId }: { userId: string }) => {
  const options = ["posts", "followers", "following"];
  const [current, setCurrent] = useState<"posts" | "followers" | "following">(
    "posts"
  );

  return (
    <View
      style={{
        padding: 5,
        marginVertical: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderTopColor: "gray",
          borderTopWidth: 2,
        }}
      >
        {options.map((option) => {
          return (
            <Pressable
              onPress={() => setCurrent(option as any)}
              style={{
                flex: 1,
                padding: 5,
                backgroundColor: current === option ? "#e3e5ef" : "transparent",
              }}
              key={option}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView
        style={{
          height: Dimensions.get("window").height,
        }}
      >
        {current === "posts" ? <Posts userId={userId} /> : null}
        {current === "followers" ? <Followers userId={userId} /> : null}
        {current === "following" ? <Following userId={userId} /> : null}
      </ScrollView>
    </View>
  );
};

export default UserFeed;
