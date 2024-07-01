const { getDB } = require("../config/mongodb");
const { verifyToken } = require("../helpers/jwt");
const { GraphQLError } = require("graphql");

async function authentication(req) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new GraphQLError("Please provide token", {
        extensions: {code: "INVALID_TOKEN"}
      });
    }

    let token = authorization.split(" ")[1];

    const payload = verifyToken(token);

    console.log(payload,`<<< yanglogin`);

    const db = await getDB()
    const findUser = await db.collection("Users").findOne({
      username: payload.username
    })

    if(!findUser){
      throw new GraphQLError("Invalid token", {
        extensions: {code: "INVALID_TOKEN"}
      })
    }

    return {
      id: payload.id,
      username: payload.username,
    };
  } catch (error) {
    return error
  }
}

module.exports = authentication;
