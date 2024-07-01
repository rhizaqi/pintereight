import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isSignIn, setSignIn] = useState(false);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) setSignIn(true);
  };
  
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isSignIn,
        setSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
