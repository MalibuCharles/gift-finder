const express = require('express');
const app = express();
const port = 3000;
app.use(express.json())

var serviceAccount = require("./creds.json");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.get('/', (req, res) => {
    res.send('Gift Finder');
});

app.post('/gift/search', async (req, res) => {
    let age_group = req.body.age_group
    const citiesRef = db.collection('Products');
    const snapshot = await citiesRef.where('category_info.age_group', '==', age_group).get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      res.send([])
      return;
    }  
    
    const products = []
    snapshot.forEach(doc => {
        products.push(doc.data())
    });

    // needs to be anywhere between 0 to products.length - 1
    let index = Math.floor(Math.random() * products.length)
    console.log(index)
    res.send(products[index]);
});

app.get('/gift/info', (req, res) => {
    res.send('Gift Finder');
});

app.listen(port, () => console.log(`Hello Welcome to Gift Finder ${port}!`))
