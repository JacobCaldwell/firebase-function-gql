const admin = require('firebase-admin');
const functions = require("firebase-functions");
const express = require('express');
const serviceAccount = require('./serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })
admin.initializeApp()

const { ApolloServer, ApolloError, gql } = require('apollo-server-express');

const db = admin.firestore()

const typeDefs = gql`
    type Hotdog {
        isKosher: Boolean
        location: String
        name: String
        sytle: String
        website: String
    }


    type Nutrient {
        amount: Float
        name: String
        units: String
    }

    type Nutrients {
        caffeine: Nutrient
    }

    type Ingredients {
        name: String
        fdcId: Int
        nutrients(name: String): Nutrients
        # portions: {}
    }

    type Query {
        hotdogs: [Hotdog]
        ingredients(name: String): [Ingredients]
    }
`

const resolvers = {
  Query: {
    ingredients: async (_, { name }) => {
      try {
        if (name) {
          return await db.collection('ingredients')
            .where()
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
  },
  // Ingredients: {
  //     name: ( ) => {

  //     }
  // }
}


const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: "/", cors: true });
exports.graphql = functions.https.onRequest(app);