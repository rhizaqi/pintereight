import {
  View,
  Image,
  TextInput,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import inputStyle from "../styles/styleInput";
import { gql, useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/contextNya";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import client from "../configs/apolloConnection";

export default function Login() {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const loginMutation = gql`
    mutation Mutation($input: LoginInput) {
      Login(input: $input) {
        access_token
      }
    }
  `;

  const [loginHandler, { data, loading, error }] = useMutation(loginMutation, {
    onCompleted: async (data) => {
      // console.log(data, `login handler`, 1111111111);
      // console.log(data.Login.access_token,`<<<< token untuk di store`);
      await SecureStore.setItemAsync("access_token", data.Login.access_token);

      // console.log( await SecureStore.getItemAsync("access_token"),`<<< apa sudah di store`);
      auth.setSignIn(true);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  if (loading) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  const navigateRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, backgroundColor: "gray", flex: 1 }}>
        <View style={{ flex: 2 }}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1713528199169-9488eb2d2b79?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={{ width: "100%", height: "130%", borderRadius: 20 }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/pinderes.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              borderWidth: 5,
              borderColor: "gray",
            }}
          />
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <TextInput
            style={inputStyle.input}
            placeholder="Username"
            onChangeText={(username) => setUser({ ...user, username })}
          />
          <TextInput
            style={inputStyle.input}
            placeholder="Password"
            onChangeText={(password) => setUser({ ...user, password })}
          />

          <Text style={{ marginTop: 5, marginBottom: 5 }}>
            You have not accound? Register
            <Text
              onPress={navigateRegister}
              style={{ color: "blue", fontSize: 16 }}
            >
              {" "}
              here{" "}
            </Text>
          </Text>

          <Button
            title="Login"
            onPress={() => {
              console.log(user, "useerrrr");
              loginHandler({
                variables: {
                  input: {
                    ...user,
                  },
                },
              });
            }}
            color="red"
          />
        </View>
      </View>
    </View>
  );
}
