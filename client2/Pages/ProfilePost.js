import { gql, useQuery } from "@apollo/client";
import { View, Image, Text, TextInput, Button } from "react-native";

export default function ProfilePost({ route }) {
  const { _idUser } = route.params;
  console.log(_idUser);

  const userOne = gql`
    query UserById($usersByIdId: ID) {
      usersById(id: $usersByIdId) {
        email
        name
        username
      }
    }
  `;

  const follower = gql`
    query MyFollower($id: ID) {
      myFollower(_id: $id) {
        _id
        name
        username
        email
      }
    }
  `;

  const following = gql`
    query MyFollowing($id: ID) {
      myFollowing(_id: $id) {
        _id
        name
        username
        email
      }
    }
  `;

  const { data, loading, error } = useQuery(userOne, {
    variables: { usersByIdId: _idUser },
  });
  console.log(data, `<<<< ahhh`);

  const { data2, loading2, error2 } = useQuery(follower, {
    variables: { id: _idUser },
  });
  console.log(data2, `<<<< 2222222222222222`);
  
  const { data3, loading3, error3 } = useQuery(following, {
    variables: { id: _idUser },
  });
  console.log(data3, `<<<< 3333333333333`);
  return (
    <View>
      <Text>INI PROFILE POST</Text>
    </View>
  );
}
