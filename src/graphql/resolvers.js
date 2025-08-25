import { User } from "../models/user.js";
import { Todo } from "../models/todo.js";
import { jwtPass } from "../utils/jwt.js";
import { GraphQLError } from "graphql";

export const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return await User.findById(context.user.userId);
    },

    todos: async (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      return await Todo.findByUserId(context.user.userId);
    },

    todo: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
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
  },

  Mutation: {
    register: async (parent, { input }) => {
      console.log("=== Registration attempt ===");
      console.log("Input received:", input);
      console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
      
      const { username, email, password } = input;

      // Validate input
      if (!username || !email || !password) {
        throw new GraphQLError("Username, email, and password are required", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      try {
        // Check if user already exists first
        console.log("Checking if user exists with email:", email);
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          console.log("User already exists");
          throw new GraphQLError("Email already exists", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        console.log("Creating new user...");
        const user = await User.createUser(username, email, password);
        console.log("User created, generating token...");
        
        const token = jwtPass(user.id);
        console.log("Token generated successfully");

        const response = {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at || new Date().toISOString(),
          },
        };
        
        console.log("Registration successful");
        return response;
      } catch (error) {
        console.error("=== Registration Error ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        console.error("Stack trace:", error.stack);

        // If it's already a GraphQLError, re-throw it
        if (error instanceof GraphQLError) {
          throw error;
        }

        // Handle SQLite constraint errors
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE" || 
            error.code === "SQLITE_CONSTRAINT" ||
            error.message.includes("UNIQUE constraint failed")) {
          if (error.message.includes("email")) {
            throw new GraphQLError("Email already exists", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          } else if (error.message.includes("username")) {
            throw new GraphQLError("Username already exists", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          } else {
            throw new GraphQLError("Email or username already exists", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
        }

        // Handle JWT errors
        if (error.message.includes("JWT_SECRET") || error.message.includes("secretOrPrivateKey")) {
          throw new GraphQLError("Server configuration error", {
            extensions: { code: "INTERNAL_ERROR" },
          });
        }

        throw new GraphQLError(`Registration failed: ${error.message}`, {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    login: async (parent, { input }) => {
      console.log("=== Login attempt ===");
      console.log("Input received:", { email: input.email }); // Don't log password
      
      const { email, password } = input;

      try {
        const user = await User.authenticate(email, password);

        if (!user) {
          throw new GraphQLError("Invalid email or password", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        console.log("Generating token for user:", user.id);
        const token = jwtPass(user.id);
        console.log("Login successful");
        
        return { user, token };
      } catch (error) {
        console.error("=== Login Error ===");
        console.error("Error:", error);
        
        // If it's already a GraphQLError, re-throw it
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError(`Login failed: ${error.message}`, {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    createTodo: async (parent, { input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const { title, description } = input;

      try {
        return await Todo.createTodo(title, description, context.user.userId);
      } catch (error) {
        console.error("Create todo error:", error);
        throw new GraphQLError("Failed to create todo", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    updateTodo: async (parent, { id, input }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      try {
        return await Todo.update(id, input, context.user.userId);
      } catch (error) {
        console.error("Update todo error:", error);
        throw new GraphQLError("Update failed", {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },

    deleteTodo: async (parent, { id }, context) => {
      if (!context.user) {
        throw new GraphQLError("Not Authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      try {
        return await Todo.delete(id, context.user.userId);
      } catch (error) {
        console.error("Delete todo error:", error);
        throw new GraphQLError("Delete failed: " + error.message, {
          extensions: { code: "NOT_FOUND" },
        });
      }
    },
  },
};