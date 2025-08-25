import { User } from "../models/user";
import { Todo } from "../models/todo";

import { jwtPass } from "../utils/jwt";
import { GraphQLError } from "graphql";
import { query } from "express";
import { ERROR } from "sqlite3";

export const Resolver = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return await User.findById(context.user.userId);
    },
  },

  // yeh sari todos ko get karne ke liye hai
  todos: async (parents, args, context) => {
    if (!context.user) {
      throw new GraphQLError("Not Authenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
    return await Todo.findByUserId(context.user.userId);
  },

  //yeh ek todo ke liye hai

  todo: async (parents, { id }, context) => {
    if (!context.user) {
      throw new GraphQLError("Not Authenticated", {
        extensions: { code: "NOTAUTHENTICATED" },
      });
    }

    const todo = await Todo.findById(id);
    if (!todo || todo.user_id !== context.user.userId) {
      throw new GraphQLError("Todo not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return todo;
  },

  Mutation: {
    //user registration

    register: async (parents, { input }) => {
      const { username, email, password } = input;

      try {
        const user = await User.createUser(username, email, password);
        const token = jwtPass(user.id);

        return {
          token,
          user: {
            ...user,
            created_at: new Date().toISOString(),
          },
        };
      } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
          throw new GraphQLError("Email or username already exists", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
        throw new GraphQLError("Registration failed", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    login: async (parent, { input }) => {
      const { email, password } = input;

      const user = User.authenticate(email, password);

      if (!user) {
        throw new GraphQLError("Invaild Credenticials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const token = jwtPass(user.id);
      return { user, token };
    },

    // todo create karne ke liye

    createTodo: async (parents, { input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "NOTAUTHENTICATED" },
        });
      }

      const { title, desciption } = input;

      return Todo.createTodo(title, desciption, context.user.userId);
    },

    updateTodo: async (parents, { id, input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "NOTAUTHENTICATED" },
        });
      }

      try {
        return Todo.update(id, input, context.user.userId);
      } catch (error) {
        throw new GraphQLError("update failed", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },

    deleteTodo: async (parents, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "NOTAUTHENTICATED" },
        });
      }

      try {
        return Todo.delete(id, constext.user.userId);
      } catch (error) {
        throw new GraphQLError('delete failed: ' + error.message, {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
  },
};
