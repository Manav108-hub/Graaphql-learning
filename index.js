import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import express from "express";
import cors from "cors";
// import  {json}  from "body-parser";
import { initializeDb } from "./src/database/connect.js";
import { typeDefs } from "./src/graphql/typeDefs.js";
import { resolvers } from "./src/graphql/resolvers.js";
import { getAuthContext } from "./src/middleware/auth.js";
import dotenv from 'dotenv';
dotenv.config();

async function startServer() {
  try {
    await initializeDb();

    const app = express();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
    });

    await server.start();

    app.use(
      "/graphql",
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: getAuthContext,
      })
    );

    const PORT = process.env.DEVELOPMENT_PORT || 4000;

    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.log("process failed to start", error);
    process.exit(1);
  }
}

startServer();