const admin = require("firebase-admin");

const serviceAccount = require("./smart-shopfloor-monitoring-firebase-adminsdk-fbsvc-7be9347aea.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;