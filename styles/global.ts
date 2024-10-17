import { StyleSheet } from "react-native";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export const styles = StyleSheet.create({
  link: {
    padding: 5,
    backgroundColor: "blue",
    borderRadius: 5,
    color: "white",
    width: "auto",
  },
  logout: {
    color: "red",
  },
  container: {
    width: "98%",
    margin: "auto",
    padding: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
  },
  roundedBorder: {
    borderRadius: 5,
    borderColor: "grey",
    borderWidth: 1,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
