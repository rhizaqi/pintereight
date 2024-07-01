import { View, Image, Text, TextInput, Button } from "react-native";
import * as SecureStore from "expo-secure-store"
export default function Profile() {

  console.log(SecureStore.getItem("access_token"));
  return (
    <View>
      <Text>INI PROFILE</Text>
    </View>
  );
}
