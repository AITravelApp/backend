import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { buildSchema } from 'type-graphql';
import { MLResolver } from './resolvers/MLResolver';
import { AppDataSource } from './type-orm.config';



const main = async () => {
  //type-orm
  await AppDataSource.initialize().then(() => {
    console.log(`🚀  Database ready`);
  })
  // await seed();

  const schema = await buildSchema({
    resolvers: [
      MLResolver,
    ],
    validate: false,
  })

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);



  const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ req, res }) => ({ req, res }),

    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }) as ApolloServerPlugin,

      // ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    //@ts-ignore
    app,
  });

  const PORT = 4000;
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });

}

main().catch((error) => {
  console.error(error);
});