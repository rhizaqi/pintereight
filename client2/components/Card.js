import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function Card({post}) {
  const navigation = useNavigation()
  
  const cekPressABle = async () => {
    navigation.navigate("Detail", {_id:post.item._id})
  };


// console.log(post,`<<<< di card`);
  return (
    <Pressable onPress={cekPressABle}>
      <View style={styles.container}>
        {/* Card */}
        <View style={styles.card}>
          {/* Header */}
          <Image
            style={{ width: "110%", height: "65%", borderRadius: 15 }}
            source={{
              uri: post.item.imgUrl,
            }}
          />
          {/* Content */}
          <View>
            <Text style={{ marginTop: 15, color: "white", fontSize: 10 }}>
              {post.item.content}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
