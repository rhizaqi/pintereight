const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");

const resolvers = {
  Query: {
    allFollows: async (_, __, context) => {
      try {
        // mau liat semua follow

        const { db } = context;
        const { id } = await context.authentication();
        console.log(id, `<<< yang login cari follower`);

        const allFollowww = await db
          .collection("Follow")
          .find({ followingId: id })
          .toArray();

        console.log(allFollowww);
        return allFollowww;
      } catch (error) {
        console.log(error);
        return error
      }
    },

    myFollower: async (_, __, context) => {
      try {
        const { db } = context;
        const { id } = await context.authentication();

        const aggr = [
          {
            $match: {
              followerId: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "followerId",
              foreignField: "_id",
              as: "follower",
            },
          },
          {
            $unwind: {
              path: "$follower",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              follower: {
                password: 0,
              },
            },
          },
        ];

        const follower = await db.collection("Follow").aggregate(aggr).toArray()

        console.log(follower,`<<<<`);

        return follower
      } catch (error) {
        console.log(error);
        return error
      }
    },

    myFollowing: async (_, args, context) => {
      try {
        const { db } = context;
        const { id } = await context.authentication();

        const aggr = [
          {
            $match: {
              followingId: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "followingId",
              foreignField: "_id",
              as: "following",
            },
          },
          {
            $unwind: {
              path: "$following",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              follower: {
                password: 0,
              },
            },
          },
        ];

        const following = await db.collection("Follow").aggregate(aggr).toArray()

        console.log(following,`<<<<`);
        return following

      } catch (error) {
        console.log(error);
        return error
      }
    },
  },

  Mutation: {
    follows: async (_, args, context) => {
      try {
        const { db } = context;
        const auth = await context.authentication();
        const { id } = auth;

        console.log(id, args.wannaFollow);

        if (id === args.wannaFollow) {
          throw new GraphQLError("Kok follow diri sendiri", {
            extensions: { code: "BAD_ACTION" },
          });
        }

        const isFollow = await db.collection("Follow").findOne({
          followerId: new ObjectId(id),
          followingId: new ObjectId(args.wannaFollow),
        });
        // console.log(isFollow);

        if (isFollow) {
          throw new GraphQLError("Kan udah di follow bang", {
            extensions: { code: "BAD_ACTION" },
          });
        }

        const follow = await db.collection("Follow").insertOne({
          followerId: new ObjectId(id),
          followingId: new ObjectId(args.wannaFollow),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return follow;
      } catch (error) {
        console.log(error);
        return error
      }
    },
  },
};

module.exports = resolvers;
