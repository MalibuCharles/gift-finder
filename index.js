const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

var serviceAccount = require("./creds.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.get("/", (req, res) => {
  res.send("Gift Finder");
});

app.get("/gifts", (req, res) => {
  db.collection("Products")
    .get()
    .then((snapshot) => {
      const gifts = snapshot.docs.map((doc) => {
        let gift = doc.data();
        gift.id - doc.id;
        return gift;
      });
      res.send(gifts);
    })
    .catch(console.error);
});

app.get("/gift/search", async (req, res) => {
  let age_group = req.query.age_group ? Number(req.query.age_group) : 0;

  console.log(age_group);
  const citiesRef = db.collection("Products");
  const snapshot = await citiesRef
    .where("category_info.age_group", "==", age_group)
    .get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    res.send([]);
    return;
  }

  const products = [];
  snapshot.forEach((doc) => {
    products.push(doc.data());
  });

  // needs to be anywhere between 0 to products.length - 1
  let index = Math.floor(Math.random() * products.length);
  console.log(products);
  console.log(products.length);
  console.log(index);
  const product = {
    product: products[index],
  };

  res.send(product);
});

app.get("/gift/info", (req, res) => {
  res.send("Gift Finder");
});

app.listen(port, () => console.log(`Hello Welcome to Gift Finder ${port}!`));
