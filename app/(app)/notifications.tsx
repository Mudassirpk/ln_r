import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import React from "react";
import { useAuth } from "@/store/context/auth";
import { useQuery } from "@tanstack/react-query";
import { httpCommon } from "@/lib/utils";
import { TNotification } from "@/types";
import { Link } from "expo-router";
import * as timeago from "timeago.js";

const NotificationsScreen = () => {
  const { token } = useAuth();

  const { data: notifications, isFetching: loading } = useQuery<
    TNotification[]
  >({
    queryKey: ["get-user-notifications"],
    async queryFn() {
      return (
        await httpCommon.get("notification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
    },
  });

  const todays_notifications = notifications?.filter((n) => {
    return (
      timeago.format(new Date(n.createdAt).toDateString()) ===
      timeago.format(new Date().toDateString())
    );
  });

  const older = notifications?.filter((n) => {
    return (
      timeago.format(new Date(n.createdAt).toDateString()) !==
      timeago.format(new Date().toDateString())
    );
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Text
          style={{
            borderBottomWidth: 2,
            borderBottomColor: "#f9f9f9",
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          Today
        </Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          todays_notifications?.map((notification) => {
            return (
              <View
                key={notification.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: "white",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    {timeago.format(
                      new Date(notification.createdAt).toDateString()
                    )}
                  </Text>
                  <Text>{notification.activity}</Text>
                </View>
                <Link
                  style={{
                    color: "blue",
                  }}
                  href={{
                    pathname: "/profile/[id]",
                    params: {
                      id: notification.actor.id,
                    },
                  }}
                >
                  {notification.actor.name}
                </Link>
              </View>
            );
          })
        )}
        <Text
          style={{
            borderBottomWidth: 2,
            borderBottomColor: "#f9f9f9",
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          Older
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          older?.map((notification) => {
            return (
              <View
                key={notification.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: "white",
                }}
              >
                <Text>{notification.activity}</Text>
                <Link
                  style={{
                    color: "blue",
                  }}
                  href={{
                    pathname: "/profile/[id]",
                    params: {
                      id: notification.actor.id,
                    },
                  }}
                >
                  {notification.actor.name}
                </Link>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

export default NotificationsScreen;
