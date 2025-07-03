const admin = require("firebase-admin");
const androidServiceAccount = require("./firebase-key.json");

const getFirebaseAdmin = () => {
  admin.initializeApp({
    credential: admin.credential.cert(androidServiceAccount),
  });

  return admin;
};

module.exports = getFirebaseAdmin;
