import { View } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Opps! this screen doesn't exists" }} />
      <View>
        <Link href={"/"}>Home</Link>
      </View>
    </>
  );
}
