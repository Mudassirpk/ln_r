import { httpCommon } from "@/lib/utils";
import { useAuth } from "@/store/context/auth";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";

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

export default function SignUpScreen(props: any) {
  const { setUser } = useAuth();
  const _navigation = useNavigation();
  const router = useRouter();

  const [error, setError] = useState<string | null>();
  const [showPassword, setShowPassword] = useState(false);
  const [creds, setCreds] = useState({
    email: "",
    password: "",
    name: "",
    cPassword: "",
  });

  useEffect(() => {
    _navigation.setOptions({ headerShown: false });
  }, [_navigation]);

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await httpCommon.post("auth/signup", {
          name: creds.name,
          email: creds.email,
          password: creds.password,
        })
      ).data;
    },
    onSuccess(response) {
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Signup successfull",
        });
      }
    },
  });

  function signup() {
    for (let value of Object.values(creds)) {
      if (value.length === 0) return setError("All feilds are required");
    }

    if (creds.password !== creds.cPassword) {
      setError("Passwords does not match");
    } else {
      mutate();
    }
  }

  function handleTextChange(type: string, value: string) {
    if (error) {
      setError(null);
    }
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
          Sign Up
        </Text>

        <Text
          style={{
            color: "white",
            marginTop: 5,
            marginBottom: 5,
            fontSize: 18,
          }}
        >
          Name
        </Text>
        <TextInput
          placeholderTextColor={"grey"}
          onChangeText={(name: string) => handleTextChange("name", name)}
          style={styles.input}
          value={creds.name}
          placeholder="name"
        />

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
        <Text
          style={{
            color: "white",
            marginTop: 5,
            marginBottom: 5,
            fontSize: 18,
          }}
        >
          Confirm Password
        </Text>
        <TextInput
          placeholderTextColor={"grey"}
          onChangeText={(password: string) =>
            handleTextChange("cPassword", password)
          }
          secureTextEntry={!showPassword}
          value={creds.cPassword}
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
          <TouchableOpacity
            style={{
              cursor: "pointer",
            }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Text style={{ color: "white" }}>
              {" "}
              {showPassword ? "Hide password" : "show password"}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text
            style={{
              color: "red",
              fontSize: 16,
            }}
          >
            {error}
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
          <TouchableOpacity
            disabled={status === "loading"}
            onPress={() => signup()}
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
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
