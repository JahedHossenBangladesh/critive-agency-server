const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const  admin = require('firebase-admin');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const uri = `mongodb+srv://creativeGuru:j2emJa1v48SQWm48@cluster0.n968s.mongodb.net/creativeAgency?retryWrites=true&w=majority`;


// ${process.env.DB_USERNAME}


const app = express()
const port = 5000

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

//this is from firebase admin


const serviceAccount = require("./creative-agency-7bba6-firebase-adminsdk-mqjqv-8913bb92cf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://creative-agency-7bba6.firebaseio.com"
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("order");
  const commentCollection = client.db("creativeAgency").collection("comment");
  
  app.post('/addOrder',(req,res) => {
    const order = req.body;
    // console.log(order);
    orderCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount)
    })
  })

  app.get('/selectedOrder', (req,res)=> {
    orderCollection.find({email: req.query.email})
   
    .toArray((err, documents)=> {
      console.log(documents)
        res.send(documents)
    })
})


app.get('/allOrder', (req,res)=> {
  orderCollection.find({})
 
  .toArray((err, documents)=> {
    console.log(documents)
      res.send(documents)
  })
})


app.post('/comment',(req,res) => {
  const comment = req.body;
  // console.log(comment);
  commentCollection.insertOne(comment)
  .then(result =>{
    res.send(result.insertedCount)
  })
})


app.get('/getcomment', (req,res)=> {
  commentCollection.find({})
 
  .toArray((err, documents)=> {
    // console.log(documents)
      res.send(documents)
  })
})

app.post('/addAService',(req,res) =>{
  const file = req.files.file;
  const name = req.body.name;
  const service = req.body.service;
  console.log(name,service,file);
})
//   app.get('/selectedOrder', (req, res) => {
//     const bearer = req.headers.authorization;
//     if (bearer && bearer.startsWith('Bearer ')) {
//       const idToken = bearer.split(' ')[1];
  
//       admin.auth().verifyIdToken(idToken)
//         .then(function (decodedToken) {
//           const tokenEmail = decodedToken.email;
//           const queryEmail = req.query.email;
//          console.log(tokenEmail,queryEmail);
//         if(tokenEmail == queryEmail) {
//           eventCollection.find({email:queryEmail})
//           .toArray((err,documents) => {
//             res.status(200).send(documents)
//           })
//             }
//             else {
//               res.status(401).send('unauthorized access');
//            }
       
//           // ...
//         }).catch(function (error) {
//           res.status(401).send('unauthorized access');
//         });

//     }
//     else {
//        res.status(401).send('unauthorized access');
//     }
// })



});







app.listen(process.env.PORT || port )