import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import Following from "@/components/userFollowing/following";
import Followers from "@/components/userFollowing/followers";

const Friends = () => {
  const [current, setCurrent] = useState<"followers" | "following">(
    "followers"
  );
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <FlatList
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: "grey",
        }}
        data={["followers", "following"]}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => setCurrent(item as any)}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: 30,
                padding: 5,
                backgroundColor: current === item ? "indigo" : "white",
              }}
            >
              <Text
                style={{
                  color: current === item ? "white" : "black",
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
        numColumns={2}
      />
      {current === "following" ? <Following /> : <Followers />}
    </View>
  );
};

export default Friends;
