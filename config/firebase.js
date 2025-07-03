const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const androidServiceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "firebase-key.json"), "utf8")
);

const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(androidServiceAccount),
    });
  }

  return admin;
};

module.exports = getFirebaseAdmin;
