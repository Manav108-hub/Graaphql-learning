import { ApolloServer } from "@apollo/server";
import express from "express";
import { initializeDB } from "./src/database/connect";

async function startServer() {
  try {
    await initializeDB();

    const app = express();

    await server.start();

    const PORT = process.env.DEVELOPMENT_PORT;

    app.listen(PORT, () => {
      console.log(`Server started at port : ${PORT}`);
    });
  } catch (error) {
    console.log("process failed to start", error);
    process.exit(1);
  }
}

startServer();
