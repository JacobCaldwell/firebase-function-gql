const { gql } = require("apollo-server-express");

const typeDefs = gql`

    type Ingredient {
        name: String
        fdcid: Int
    }

    type Query {
        ingredients(name: [String]): [Ingredient]
    }
`;

module.exports = typeDefs;
