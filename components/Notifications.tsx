import { TNotification } from "@/types";
import { View, Text } from "react-native";
import Notification from "./Notification";
export default function Notifications({
  notifications,
}: {
  notifications: TNotification[];
}) {
  return (
    <View
      style={{
        top: 30,
        right: 0,
        padding: 5,
        backgroundColor: "indigo",
        position: "absolute",
        maxHeight: 300,
        width: 250,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        zIndex: 1000,
        opacity: 1,
      }}
    >
      {notifications.length === 0 ? (
        <Text
          style={{
            color: "white",
          }}
        >
          You are caught up for now
        </Text>
      ) : (
        notifications.map((notification) => {
          return (
            <Notification key={notification.id} notification={notification} />
          );
        })
      )}
    </View>
  );
}
