const typeDefs = `#graphql

type User {
    _id: ID
    name: String
    username: String
}

type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    cretatedAt: String
    updatedAt: String
}

type FollowerOrFollowing {
    _id: ID
    name: String
    username: String
    email: String

}

type Mutation {
    follows(wannaFollow: ID): Follow
}

type Query {
    allFollows: [FollowedUser]
    # allFollows(userId:ID) : FollowedUser
    myFollower(_id:ID):[FollowerOrFollowing]
    myFollowing(_id:ID):[FollowerOrFollowing]
}

type ResponseFollow {
    message: String
}

type FollowedUser {
    _id: ID
    name: String
    username: String
    email: String
    followers: [User]
}


`;

module.exports = typeDefs;
