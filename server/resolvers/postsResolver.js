const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const cache = require("../config/redis");

const resolvers = {
  Query: {
    posts: async (_, __, context) => {
      //! berdasarkan terbaru
      try {
        const { db } = context;

        console.log(context.authentication(), `<<< all post`);

        const postCache = await cache.get("all:posts");

        if (postCache) {
          return JSON.parse(postCache);
        }

        const allPosts = await db.collection("Posts").find().toArray();
        // console.log(allPosts);

        await cache.set("all:posts", JSON.stringify(allPosts));

        return allPosts;
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    postsById: async (_, args, context) => {
      try {
        const { id } = args;
        const { db } = context;

        // console.log(context.authentication(),`<<< detail by id`);
        // console.log(id, `<<< id nyahh?`);

        const arggs = [
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: {
              path: "$author",
              preserveNullAndEmptyArrays: true,
            },
          },
        ];

        const onePost = await db.collection("Posts").aggregate(arggs).toArray();

        // const onePost = await db.collection("Posts").findOne({
        //   _id: new ObjectId(id),
        // });

        console.log(onePost[0], `<<<< post per id`);

        return onePost[0]; //! createdAt & updatedAt
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },

  Mutation: {
    mePost: async (_, args, context) => {
      try {
        const { db } = context;
        const { content, tags, imgUrl } = args.input;

        const auth = await context.authentication();
        //  console.log(auth);
        // console.log(content, tags, imgUrl , `< dari args banggg`);

        const newPost = await db.collection("Posts").insertOne({
          content,
          tags,
          imgUrl,
          authorId: new ObjectId(auth.id),
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        //   console.log({
        //     _id: newPost.insertedId,
        //     ...newPost
        //   });

        await cache.del("all:posts");

        return { message: "You added new post" };
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    meComment: async (_, args, context) => {
      try {
        const { db } = context;
        const auth = await context.authentication();

        const { username } = auth;
        const { idPost, content } = args;
        // console.log(args, `,<<`);
        // console.log(auth, `<<<<`);

        // const goComment = await db.collection("Posts").insertOne({
        //     content,
        //     username,
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //   });

        const filter = { _id: new ObjectId(idPost) };

        const writeComment = {
          $push: {
            comments: {
              content,
              username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        };

        const goComment = await db
          .collection("Posts")
          .updateOne(filter, writeComment);

        return {
          message: "Comment sent",
        };
      } catch (error) {
        console.log(error);
        return error;
      }
    },

    meLike: async (_, args, context) => {
      try {
        const { db } = context;
        const auth = await context.authentication();

        const { username } = auth;
        const idPost = args.idPost;

        const filter = { _id: new ObjectId(idPost) };
        console.log(11111111);

        const alreadyLiked = await db.collection("Posts").findOne({
          _id: new ObjectId(idPost),
        });

        const name = alreadyLiked.likes.map((el) => el.username);

        const find = name.find((el) => el === username);

        if (find === username) {
          throw new GraphQLError("You already like this posts", {
            extensions: { code: "BAD_ACTION" },
          });
        }
        // console.log(alreadyLiked);

        const iLike = {
          $push: {
            likes: {
              username,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        };

        const goLike = await db.collection("Posts").updateOne(filter, iLike);

        return goLike; //! retun nya null
      } catch (error) {
        console.log(error);
        return error;
      }
    },
  },
};

module.exports = resolvers;
