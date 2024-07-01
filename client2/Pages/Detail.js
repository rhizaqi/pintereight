import { gql, useMutation, useQuery } from "@apollo/client";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import inputStyle from "../styles/styleInput";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Detail({ route }) {
  const [comment, setComment] = useState("");
  const { _id } = route.params;
  const navigation = useNavigation();

  const postDetail = gql`
    query detailPost($postsByIdId: ID) {
      postsById(id: $postsByIdId) {
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
        author {
          name
          username
          _id
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(postDetail, {
    variables: { postsByIdId: _id },
  });

  const mePost = gql`
    mutation Mutation($idPost: ID!, $content: String) {
      meComment(idPost: $idPost, content: $content) {
        message
      }
    }
  `;

  const [commentHandler, { data2, loading2, error2 }] = useMutation(mePost, {
    onCompleted: async () => {
      // return message gak sihh?
      console.log("udah comment bang");
      setComment("");
    },
    refetchQueries: [
      postDetail,
      {
        variables: { postsByIdId: _id },
      },
    ],
  });

  if (loading) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  if (error) return <Text> Error: {error.message} </Text>;

  // console.log(data, `<<<< data detail`);
  // console.log(data.postsById.comments, `<<<, yang coomment`);

  // console.log(post, `Detail post nyah`);

  const profileHandler = () => {
    navigation.navigate("ProfilePost", {_idUser: data.postsById.author._id});
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={profileHandler}>
        
        {/* Card */}
        <View style={styles.card}>
          {/* Header */}
          <Image
            style={{ width: "110%", height: "65%", borderRadius: 15 }}
            source={{
              uri: data.postsById.imgUrl,
            }}
          />
          {/* Content */}
          <View>
            <Text> {data.postsById.author.username} say's : </Text>
            <Text style={{ marginTop: 15, color: "white", fontSize: 10 }}>
              {data.postsById.content}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={{ fontSize: 16 }}> Likes </Text>
            {data.postsById.likes && data.postsById.likes.length > 0 ? (
              data.postsById.likes.map((el, i) => (
                <Text key={i}> - {el.username} </Text>
              ))
            ) : (
              <Text>0 likes</Text> // bingung denngg
            )}

            <Text style={{ fontSize: 16 }}> Comment </Text>
            {data.postsById.comments && data.postsById.comments.length > 0 ? (
              data.postsById.comments.map((el, i) => (
                <Text key={i}>
                  {" "}
                  - {el.username} says {el.content}{" "}
                </Text>
              ))
            ) : (
              <Text>0 comments</Text> // sama bingung denngg
            )}
          </View>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <TextInput
            style={inputStyle.input}
            placeholder="Comment"
            onChangeText={setComment}
          />

          <Button
            title="Comment"
            onPress={() =>
              commentHandler({
                variables: {
                  idPost: data.postsById._id,
                  content: comment,
                },
              })
            }
          />
        </View>
      </Pressable>
    </View>
  );
}
// data.postsById.likes
// data.postsById.comments
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  card: {
    backgroundColor: "gray",
    borderRadius: 15,
    padding: 16,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
