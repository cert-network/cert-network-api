const admin = require('firebase-admin');

const serviceAccount = require('/path/to/your/service/account');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cert-network.firebaseio.com'
});

// Get a reference to the database service
const firebaseConnection = admin.database();
module.exports = firebaseConnection;
