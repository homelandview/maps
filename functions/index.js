const functions = require("firebase-functions/v2");
const firebase = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const engines = require("consolidate");
const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

function getFacts() {
    const ref = firebaseApp.firestore().collection('facts');
    return ref.once('value').then(snapshot => { snapshot.val(); });        
}
// Create an Express application
const app = express();
app.engine("hbs", engines.handlebars);
app.set("view", "./views");
app.set("views engine", "hbs");
// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// Define a simple route
// app.get("/timestamp", (req, res) => {
//   res.send("Hello from Firebase Functions with Express!");
// });
app.get("/timestamp-catch", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
  getFacts().then(facts =>{
    res.render('index',{ facts});
  });
 // res.send("Hello from Firebase Functions with Express!");
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });
