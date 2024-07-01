const typeDefs = `#graphql

type User {
    _id: ID
    name: String
    username: String
}

type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comments]
    likes: [Likes]
    cretatedAt: String
    updatedAt: String
    author: User
}

type Comments {
    content: String!
    username: String!
    cretatedAt: String
    updatedAt: String
}

type Likes {
    username: String
    cretatedAt: String
    updatedAt: String
}

input AddPost {
    content: String!
    tags: [String]
    imgUrl: String
    # authorId: ID
    # comments: [AddComments]
    # likes: [AddLike]
}

input AddComments {
    content: String!
    username: String!
    cretatedAt: String
    updatedAt: String
}

input AddLike {
    username: String
    cretatedAt: String
    updatedAt: String
}

type Message {
    message: String
}

type Query {
    postsById(id:ID): Post
    posts: [Post]
}
type Mutation {
    mePost(input: AddPost): Message  # kasih response message
    meComment(idPost: ID!, content: String): Message
    meLike(idPost: ID!): Message
}

`;

module.exports = typeDefs;
