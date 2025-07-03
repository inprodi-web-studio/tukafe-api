const getFirebaseAdmin = require("../../../../config/firebase");
const { validateWork } = require("../content-types/work/work.validation");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::work.work", ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body;

    await validateWork(data);

    let promises = [];

    for (const item of data) {
      for (let i = 0; i < (item.count || 1); i++) {
        const time = item.time || "asap";
        let date;

        if (time === "asap") {
          date = new Date();
        } else if (time === "15") {
          date = new Date();
          date.setMinutes(date.getMinutes() + 15);
        } else if (time === "30") {
          date = new Date();
          date.setMinutes(date.getMinutes() + 30);
        }

        promises.push(
          strapi.entityService.create("api::work.work", {
            data: {
              ...item,
              prepareIn: date,
              isOnline: item.isOnline || false,
              isDone: false,
            },
          })
        );
      }
    }

    const result = await Promise.all(promises);

    return result;
  },

  async update(ctx) {
    const { id } = ctx.params;
    const data = ctx.request.body;

    const work = await strapi.documents("api::work.work").update({
      documentId: id,
      data,
    });

    if (work.customer_id) {
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            posterId: work.customer_id,
          },
        });

      if (!user) {
        return { ok: true };
      }

      const firebaseAdmin = getFirebaseAdmin();
      const firestore = firebaseAdmin.firestore();
      const usersCollection = firestore.collection("users");

      const userSnapshot = await usersCollection
        .where("email", "==", user.email)
        .get();

      if (!userSnapshot?.docs?.[0]) {
        return { ok: true };
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      if (!userData) {
        return { ok: true };
      }

      const userId = userData.uid;

      const tokensSnapshot = await firebaseAdmin
        .firestore()
        .doc(`users/${userId}`)
        .collection("fcm_tokens")
        .get();

      if (!tokensSnapshot?.docs) {
        return { ok: true };
      }

      const tokens = tokensSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      const registrationTokens = tokens.map((token) => token.fcm_token);

      const message = {
        tokens: registrationTokens,
        notification: {
          title: "¡Tu bebida esta lista!",
          body: "Nuestro barista ha terminado de preparar tu bebida. Puedes recogerla en barra.",
        },
        android: {
          priority: "high",
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
            },
          },
        },
      };

      const response = await firebaseAdmin
        .messaging()
        .sendEachForMulticast(message);

      console.log(response);

      return { ok: true };
    }

    return { ok: true };
  },
}));
