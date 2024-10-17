import { useState } from "react";
import { Button, View, Text } from "react-native";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onPress={() => setCount((prev) => prev + 1)} title="+" />
      <Text>{count}</Text>
      <Button onPress={() => setCount((prev) => prev - 1)} title="-" />
    </View>
  );
}
