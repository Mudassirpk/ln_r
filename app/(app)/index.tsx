import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";

const styles = {
  input: {
    color: "white",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: "white",
  },
};

export default function LoginScreen(props: any) {
  const { persist } = useAuth();
  const _navigation = useNavigation();
  const router = useRouter();

  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [creds, setCreds] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    _navigation.setOptions({ headerShown: false });
  }, [_navigation]);

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post("auth/login", creds, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        })
      ).data;
    },
    onSettled(response) {
      if (response.success) {
        Toast.show({
          type: "success",
          text1: response.message,
        });
        persist(response.user, response.token);
        router.push("/details");
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    },
  });

  function login() {
    if (creds.email.length > 0 && creds.password.length > 0) {
      mutate();
    }
  }

  function handleTextChange(type: string, value: string) {
    setCreds({ ...creds, [type]: value });
  }

  return (
    <View
      style={{
        backgroundColor: "#1b1b21",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "#eae54d",
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        Welcome to RN-L
      </Text>

      <View
        style={{
          padding: 30,
          borderWidth: 1,
          borderColor: "#eae54d",
          borderRadius: 5,
          width: "90%",
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
            color: "#eae54d",
          }}
        >
          Login
        </Text>

        <Text
          style={{
            color: "white",
            marginTop: 5,
            marginBottom: 5,
            fontSize: 18,
          }}
        >
          Email
        </Text>
        <TextInput
          placeholderTextColor={"grey"}
          onChangeText={(email: string) => handleTextChange("email", email)}
          style={styles.input}
          value={creds.email}
          placeholder="example@domain.com"
        />

        <Text
          style={{
            color: "white",
            marginTop: 5,
            marginBottom: 5,
            fontSize: 18,
          }}
        >
          Password
        </Text>
        <TextInput
          placeholderTextColor={"grey"}
          onChangeText={(password: string) =>
            handleTextChange("password", password)
          }
          secureTextEntry={!showPassword}
          value={creds.password}
          style={styles.input}
          placeholder="********"
        />
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingTop: 10,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            style={{
              cursor: "pointer",
            }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Text style={{ color: "white" }}>
              {" "}
              {showPassword ? "Hide password" : "show password"}
            </Text>
          </Pressable>
        </View>

        {error && (
          <Text
            style={{
              color: "red",
              fontSize: 16,
            }}
          >
            Invalid email or password
          </Text>
        )}

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            paddingTop: 10,
            justifyContent: "center",
          }}
        >
          <Pressable
            disabled={status === "pending"}
            onPress={() => login()}
            style={{
              backgroundColor: "#eae54d",
              width: "100%",
              padding: 6,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
        <Link
          style={{
            color: "white",
            marginTop: 5,
          }}
          href={"/signup"}
        >
          Don't have an account? Sign Up
        </Link>
      </View>
    </View>
  );
}
