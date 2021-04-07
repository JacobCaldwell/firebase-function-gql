import admin from 'firebase-admin';
const functions = require("firebase-functions");
const express = require('express');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount)
  projectId: 'fir-graphql-test-79d16',
  credential: admin.credential.applicationDefault()
})

const { ApolloServer, ApolloError, gql } = require('apollo-server-express');

const db = admin.firestore()

const typeDefs = gql`

    type Nutrient {
        amount: Float
        name: String
        units: String
    }

    type Ingredient {
        name: String
        fdcid: Int
        # nutrients(name: String): [Nutrient]
    }

    type Query {
        ingredients(name: [String]): [Ingredient]
    }
`

const resolvers = {
  Query: {
    ingredients: async (_, { name }) => {
      try {
        if (name) {
          return await db.collection('ingredients')
            .where("name", "in", name)
            .get()
            .then(ingredents => ingredents.docs.map(docs => docs.data()))
        } else {
          return await db.collection('ingredients')
            .get()
            .then(ingredents => ingredents.docs.map(docs => docs.data()))
        }
      }
      catch {
        return new ApolloError
      }
    }
  }
}


const app = express();
app.use(cors())
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });
exports.graphql = functions.https.onRequest(app);