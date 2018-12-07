'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
import { MongoClient } from 'mongodb';
import { ObjectID } from 'mongodb';

const collection = 'Test';
const server = express();

server.use(bodyParser.json());

//Gets the entire Collection of documents
server.get('/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  MongoClient.connect(MONGO_URL, (err, db) => {
    //const { name } = req.params ;
  
    //res.status(200).send("name");
    if (err) return next(err);
    db.db('Test').collection(collection).find( {}).toArray( (err2, result) => {
      db.close();
      if (err2) return next(err2);
      
      res.status(200).send(result);
    });
  });
});

//Gets documents with a passed JSON file
server.get('/search/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  MongoClient.connect(MONGO_URL, (err, db) => {
    const model = req.body;
  
    //res.status(200).send(name);
    if (err) return next(err);
    db.db('Test').collection(collection).findOne(model, (err2, result) => {
      db.close();
      if (err2) return next(err2);
      res.status(200).send(result);
    });
  });
});

//Gets documents with name
server.get('/search/:name', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  MongoClient.connect(MONGO_URL, (err, db) => {
    const { name } = req.params;
  
    //res.status(200).send(name);
    if (err) return next(err);
    db.db('Test').collection(collection).findOne({ name: name }, (err2, result) => {
      db.close();
      if (err2) return next(err2);
      res.status(200).send(result);
    });
  });
});

//To test the information sent to the database
server.post('/submit/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  // Do data sanitation here.
  const model = req.body;
  console.log(req.body);
  //res.status(200).send(model);
  MongoClient.connect(MONGO_URL, (err, db) => {
     if (err) return next(err);
     db.db('Test').collection(collection).insertOne(model, (err2, result) => {
       db.close();
       if (err2) return next(err2);
       res.status(201).send(result);
     });
   });
});

server.post('/:name/:Job', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  // Do data sanitation here.
  const model = req.params;
  //res.status(200).send(model);
  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) return next(err);
    db.db('Test').collection(collection).insertOne(model, (err2, result) => {
      db.close();
      if (err2) return next(err2);
      res.status(201).send(result);
    });
  });
});

module.exports = Webtask.fromExpress(server);
