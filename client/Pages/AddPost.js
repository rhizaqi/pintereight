import { View, Image, TextInput, Button, Text } from "react-native";
import inputStyle from "../styles/styleInput";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { queryPost } from "./MainPage";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const mePost = gql`
    mutation Mutation($input: AddPost) {
      mePost(input: $input) {
        message
      }
    }
  `;

  const [addPost, { data, loading, error }] = useMutation(mePost, {
    onCompleted: async () => {
      console.log("success add new post");
      // return response message gakk harus nya?
    },
    refetchQueries: [queryPost], // coba query dari page lain
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, backgroundColor: "gray", flex: 1 }}>
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
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "space-around",
            gap: -100, // wkwkwkwk kacau bisa minussssssss XDDD
            paddingTop: 15,
          }}
        >
          <TextInput
            style={inputStyle.input}
            placeholder="Content"
            onChangeText={setContent}
          />
          <TextInput
            style={inputStyle.input}
            placeholder="Tags"
            onChangeText={setTags}
          />
          <TextInput
            style={inputStyle.input}
            placeholder="Image Url"
            onChangeText={setImgUrl}
          />
          <Button
            title="Add Post"
            onPress={() => {
              addPost({
                variables: {
                  input: {
                    content,
                    tags,
                    imgUrl,
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
