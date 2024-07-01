import MainStack from "./navigators/MainStack";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apolloConnection";
import AuthProvider from "./contexts/contextNya";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <MainStack />
      </AuthProvider>
    </ApolloProvider>
  );
}
