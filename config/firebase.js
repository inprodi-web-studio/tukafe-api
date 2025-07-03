const admin = require("firebase-admin");

if (!process.env.FIREBASE_KEY) {
  throw new Error("FIREBASE_KEY no está definida en las variables de entorno.");
}

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY, "base64").toString("utf8")
);

const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin;
};

module.exports = getFirebaseAdmin;
