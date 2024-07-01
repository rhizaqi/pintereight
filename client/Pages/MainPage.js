import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from "react-native";
import Card from "../Components/Card";
import inputStyle from "../styles/styleInput";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/contextNya";
import { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useQuery, gql } from "@apollo/client";

export default function MainPage() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation();

  const logoutHandler = async () => {
    console.log(SecureStore.getItem("access_token"), `mau delete`);
    await SecureStore.deleteItemAsync("access_token");
    auth.setSignIn(false); // kok gak bisa set???
  };

  const goAdd = async ()=> {
    navigation.navigate("AddPost")
  }

  const queryPost = gql`
    query Posts {
      posts {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          cretatedAt
          updatedAt
        }
        likes {
          username
          cretatedAt
          updatedAt
        }
        cretatedAt
        updatedAt
      }
    }
  `;

  const {data, loading, error} = useQuery(
    queryPost
  )

  if(loading){
    return  <ActivityIndicator size="small" color="#0000ff" />
  }

  if(error) return <Text> Error: {error.message} </Text>

  const profileHandler = async()=> {
    navigation.navigate("Profile")
  }

  // useEffect(() => {
  //   console.log(SecureStore.getItem("access_token"), `di hompage`);
  //   console.log(data,`<< di main page`);
  // });

  return (
    <View style={{ flex: 1, padding: 8, backgroundColor: "gray" }}>
      <View //? bagian atas <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        style={{
          flex: 1,
          backgroundColor: "gray",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          rowGap: 4,
          marginTop: 20,
        }}
      >
        <Image
          source={require("../assets/pinderes.png")}
          style={{ width: 40, height: 40 }}
        />

        <TouchableHighlight
          style={{
            backgroundColor: "white",
            width: 75,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
        >
          <Text>Home</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={{
            backgroundColor: "white",
            width: 75,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
          onPress={profileHandler}
        >
          <Text>Profile</Text>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={logoutHandler}
          style={{
            backgroundColor: "white",
            width: 75,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
        >
          <Text>Logout</Text>
        </TouchableHighlight>
      </View>

      <View //? ini bagian tengah <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        style={{ flex: 10, backgroundColor: "gray", padding: 5 }}
      >
        <FlatList
          data={data.posts}
          renderItem={(item) => <Card post={item} />}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />

        {/* <Text> Mmmmmmm iiiiiii dddddddd </Text> */}
      </View>

      <View //? Bagian bawah <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        style={{
          flex: 1,
          backgroundColor: "gray",
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          justifyContent: "center",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TouchableHighlight
          style={{
            backgroundColor: "white",
            width: 65,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
          onPress={goAdd}
        >
          <Text>Add</Text>
        </TouchableHighlight>

        <TextInput style={inputStyle.input} placeholder="Search" />
        <TouchableHighlight
          style={{
            backgroundColor: "white",
            width: 45,
            height: 45,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
        >
          <TextInput> Go </TextInput>
        </TouchableHighlight>
      </View>
    </View>
  );
}

export const queryPost = gql`
    query Posts {
      posts {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          cretatedAt
          updatedAt
        }
        likes {
          username
          cretatedAt
          updatedAt
        }
        cretatedAt
        updatedAt
      }
    }
  `;