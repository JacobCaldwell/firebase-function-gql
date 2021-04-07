const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "fir-graphql-test-79d16",
});

module.exports = admin;
