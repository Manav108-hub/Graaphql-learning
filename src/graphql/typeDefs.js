import gql from "graphql-tag";

export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        created_at: String!
    }

    type Todo {
        id: ID!
        title: String!
        description: String
        completed: Boolean!
        user_id: Int!
        created_at: String!
        updated_at: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input CreateTodoInput {
        title: String!
        description: String
    }

    input UpdateTodoInput {
        title: String
        description: String
        completed: Boolean
    }

    type Query {
        me: User
        todos: [Todo!]!
        todo(id: ID!): Todo
    }

    type Mutation {
        register(input: RegisterInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!

        createTodo(input: CreateTodoInput!): Todo!
        updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
        deleteTodo(id: ID!): Boolean!
    }
`;
