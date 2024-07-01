const { ObjectId } = require("mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { makeToken } = require("../helpers/jwt");
const validator = require("email-validator");
const { GraphQLError } = require("graphql");
// const cache = require("../config/redis");

const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      try {
        //! untuk search by NAME ???
        const { db } = contextValue;

        // const auth = await contextValue.authentication()
        // console.log(auth, `<< ???xx test contex value`);

        const users = await db.collection("Users").find().toArray();
        // console.log(users,`,<<< users`);
        return users;
      } catch (error) {
        console.log(error);
      }
    },
    usersById: async (_, args, contextValue) => {
      try {
        const { db } = contextValue;
        // console.log(args,`args nyah user id`);
        // console.log(contextValue.authentication(), "context value users");
        const { id } = args;

        const user = await db.collection("Users").findOne({
          _id: new ObjectId(id),
        });
        // console.log(user, `<<< user`);

        return user;
      } catch (error) {
        console.log(error);
      }
    },

    search: async (_, args, context) => {
      try {
        const { db } = context;

        const postCache = await cache.get("all:users");

        if (postCache) {
          return JSON.parse(postCache);
        }

        console.log(args.name, 1111111, `<< cari yang ini`);

        const regex = new RegExp(args.name, "i");

        // await db.collection("Users").createIndex({ name: "text", username: "text" })
        // const query = { $text: {$search: `${args.name}`}}

        const query = {
          $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
        };

        const agg = [
          {
            $match: query,
          },
          {
            $project: {
              password: 0,
            },
          },
        ];

        const find = await db.collection("Users").aggregate(agg).toArray();

        if (!find) {
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await cache.set("all:users", JSON.stringify(find));

        return find;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    Register: async (_, args, contextValue) => {
      try {
        // console.log(contextValue,`<<<< contextValue mau regis`);
        const { db } = contextValue;
        const { name, username, email, password } = args.input;
        //   console.log(name, username, email, password,`<< destructir inputtt`);

        let longPassword = password.length;

        if (longPassword < 5) {
          throw new GraphQLError("Password minimal 5 character", {
            extensions: { code: "BAD_REQUEST" },
          });
        }

        const isEmail = validator.validate(email);

        if (!isEmail) {
          throw new GraphQLError("Email is not valid", {
            extensions: { code: "BAD_REQUEST" },
          });
        }

        const findUser = await db.collection("Users").findOne({ username });
        // console.log(findUser, `<<< cari`);

        if (findUser) {
          if (findUser.username) {
            // console.log("dalam if");
            throw new GraphQLError("Username has been used", {
              extensions: { code: "BAD_REQUEST" },
            });
          }

          if (findUser.email) {
            throw new GraphQLError("Email has been used", {
              extensions: { code: "BAD_REQUEST" },
            });
          }
        }
        // console.log(findUser);

        const newUser = await db.collection("Users").insertOne({
          name,
          username,
          email,
          password: hashPassword(password),
        });
        // console.log(newUser,`<<, baaa`);
        // console.log(newUser.insertedId,`<<< insertedId`);

        await cache.del("all:users");

        return {
          _id: newUser.insertedId,
          name,
          email,
          username,
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    Login: async (_, args, contextValue) => {
      try {
        const { username, password } = args.input;
        const { db } = contextValue;

        console.log(username, password, `<<< yoii gak?`);

        const user = await db.collection("Users").findOne({ username });

        if (!user) {
          throw new GraphQLError("Username salah bang", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const checkPassword = comparePassword(password, user.password);

        if (!checkPassword) {
          throw new GraphQLError("Password salah bang", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const access_token = makeToken({
          id: user._id,
          username: user.username,
        });

        return {
          access_token,
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};

module.exports = resolvers;
