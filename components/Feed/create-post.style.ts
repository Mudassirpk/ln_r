import { styles } from "@/styles/global";
import { StyleSheet } from "react-native";

export const createPost = StyleSheet.create({
  input: {
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginTop: 10,
  },
  button: {
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: "indigo",
    padding: 5,
    alignSelf: "flex-end",
  },
});
