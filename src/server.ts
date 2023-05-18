import fastify from "fastify";
import cors from '@fastify/cors'
// import jwt from '@fastify/jwt'

import { memoriesRoutes } from "./routes/memories";

const app = fastify();

app.register(cors, {
  origin: true,
})

// app.register(jwt, {
//   secret: 'spacetime',
// })

app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("HTTP server running on http://localhost:3333 ✔");
  });
