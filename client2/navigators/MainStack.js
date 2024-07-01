import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../Pages/Login.js";
import Register from "../Pages/Register";
import MainPage from "../Pages/MainPage";
import Detail from "../Pages/Detail";
import { useContext } from "react";
import { AuthContext } from "../contexts/contextNya";
import Profile from "../Pages/Profile";
import AddPost from "../Pages/AddPost";
import ProfilePost from "../Pages/ProfilePost.js";

export default function MainStack() {
  const Stack = createNativeStackNavigator();

  const auth = useContext(AuthContext);
  //use context disini

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!auth.isSignIn ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainPage" component={MainPage} />
            <Stack.Screen name="Detail" component={Detail} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="AddPost" component={AddPost} />
            <Stack.Screen name="ProfilePost" component={ProfilePost} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
