import { httpCommon } from "@/lib/utils";
import { TNotification } from "@/types";
import { useState } from "react";
import { Text } from "react-native";
import { useQuery } from "react-query";
export default function Notification({
  notification: _notification,
}: {
  notification: TNotification;
}) {
  const [notification, setNotification] = useState(_notification);

  useQuery({
    queryKey: ["update-notification-seen"],
    async queryFn() {
      return await httpCommon.get("notification/seen/" + notification.id);
    },
    enabled: notification.seen !== true,
    onSuccess() {
      setNotification({ ...notification, seen: true });
    },
  });

  return (
    <Text
      style={{
        backgroundColor: "indigo",
        color: "white",
      }}
    >
      {notification?.activity}
    </Text>
  );
}
