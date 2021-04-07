const admin = require("../database/database");
const { ApolloError } = require("apollo-server-express");

const db = admin.firestore()

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
      catch (error) {
        return new ApolloError('Error')
      }
    }
  }
}

module.exports = resolvers;
