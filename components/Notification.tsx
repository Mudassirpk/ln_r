import { httpCommon } from "@/lib/utils";
import { TNotification } from "@/types";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
export default function Notification({
  notification: _notification,
}: {
  notification: TNotification;
}) {
  const [notification, setNotification] = useState(_notification);

  const { data, isFetched } = useQuery({
    queryKey: ["update-notification-seen"],
    async queryFn() {
      return await httpCommon.get("notification/seen/" + notification.id);
    },
    enabled: notification.seen !== true,
  });

  useEffect(() => {
    if (data && isFetched) setNotification({ ...notification, seen: true });
  }, [data, isFetched]);

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
