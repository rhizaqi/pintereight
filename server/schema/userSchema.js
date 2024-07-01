const typeDefs = `#graphql

type User {
    _id: ID!
    name: String
    username: String
    email: String
    password: String

}

type Token {
    access_token: String
}

input RegisterInput {
    name: String
    username: String
    email: String
    password: String
}

input LoginInput {
    username: String
    password: String
}

type Mutation {
    Register(input: RegisterInput): User
    Login(input: LoginInput): Token
}

type Query {
    usersById(id:ID): User
    users: [User]
    search(name:String): [User]
}
`;

module.exports = typeDefs;
