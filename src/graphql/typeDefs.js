import { gql } from "@apollo/server";

export const typeDefs = gql`
    type User {
        id : ID!
        username : String!
        email : String!
        created_at : String! 
    }

    type Todo {
        id : ID!
        title : String!
        decription : String
        completed : Boolean!
        user_id : Int!
        creted_at : String!
        updated_at!
    }

    type Authpayload{
        token : String!
        user : User!
    }

    type RegisterInput{
        Username : String!
        email : String!
        password : String!
    }

    type LoginInput {
        email : String!
        password : String!
    }

    type CreateTodoInput {
        title : String!
        decription : String
    }

    type UpdateTodoInput {
        title : String
        decription : String
        completed : Boolean
    }

    type Query {
        me : User 

        todos : [Todo!]!
        todo(id: ID!): Todo
    }

    type Mutation {
        register(input : RegisterInput!): AuthPayLoad!
        login(input : LoginInput!): AuthPyLoad!

        createTodo(input: CreateTodoInput!) : Todo!
        updateTodo(id: ID!, input: UpdateTodoInput!): Todo!
        deleteTodo(id: ID!): Boolean!
    }
`;
