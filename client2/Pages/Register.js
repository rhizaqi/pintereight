// import client from "../config/apolloConnection";

import { View, Image, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import inputStyle from "../styles/styleInput";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import client from "../configs/apolloConnection";

export default function Register() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = gql`
    mutation Register($input: RegisterInput) {
      Register(input: $input) {
        _id
        username
        email
      }
    }
  `;

  const [registerHandler, { data, loading, error }] = useMutation(
    registerMutation,
    {
      onCompleted: async (data) => {
        navigation.navigate("Login");
      },
      onError: async (error) => {
        alert(error.message);
      },
    }
  );

  if(loading){
    return  <ActivityIndicator size="small" color="#0000ff" />
  }

  // const cekInput = (data) => {
  //   console.log(data);
  // };
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
            onChangeText={setUsername}
          />
          <TextInput
            style={inputStyle.input}
            placeholder="Name"
            onChangeText={setName}
          />
          <TextInput
            style={inputStyle.input}
            placeholder="Email"
            onChangeText={setEmail}
          />
          <TextInput
            style={inputStyle.input}
            placeholder="Password"
            onChangeText={setPassword}
          />
          <Button
            title="Register"
            onPress={() => {
              console.log(
                { username, name, password, email },
                `dibawah`,
                11111
              ),
                // cekInput(user),
                registerHandler({
                  variables: {
                    input: {
                      username,
                      name,
                      email,
                      password,
                    },
                  },
                });
            }}
          />
        </View>
      </View>
    </View>
  );
}
