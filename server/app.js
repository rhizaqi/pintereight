require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { connect, getDB } = require("./config/mongodb");
const { startStandaloneServer } = require("@apollo/server/standalone");

const userTypeDef = require("./schema/userSchema");
const postTypeDef = require("./schema/postSchema")
const followTypeDef = require("./schema/followSchema")

const userResolver = require("./resolvers/userResolver");
const postResolver = require("./resolvers/postsResolver")
const followResolver = require("./resolvers/followResolver")


const authentication = require("./middlewares/authentication");

const server = new ApolloServer({
  typeDefs: [userTypeDef,postTypeDef, followTypeDef],
  resolvers: [userResolver, postResolver, followResolver],
  introspection: true,
});

// (async () => {
//   try {
//     await connect();

//     const db = await getDB();

//     await startStandaloneServer(server, {
//       listen: { port: process.env.PORT || 3000 },
//       context: ({ req, res }) => {
//         return {
//           db,
//         };
//       },
//     });

//   } catch (error) {
//     console.log("Error: " + error);
//   }
// })();

async function startServer() {
  try {
    await connect();

    const db = await getDB();

    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 3000 },
      context: async ({ req, res }) => {
        return {
          authentication: () => authentication(req),
          db,
        };
      },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
}

startServer();
