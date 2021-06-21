const express = require('express')
const sessionsRouter = express.Router()

const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectID } = require('mongodb');
const speakerService = require('../services/speakerService')

require('dotenv').config()
sessionsRouter.use((req, res, next) => {
  if(req.user){
    next()
  } else {
    res.redirect('/auth/signIn')
  }
})

const mongourl = process.env['MONGO_URI']

//const sessions = require('../data/sessions.json')

sessionsRouter.route('/')
	.get((req, res) => {
        const dbName = 'Virtual-Friend';
      
        (async function mongo() {
          let client;
          try {
            client = await MongoClient.connect(mongourl);
            debug('Connected to the mongo DB');
      
            const db = client.db(dbName);
      
            const sessions = await db.collection('sessions').find().toArray();
            res.render('sessions', {sessions});
          } catch (error) {
            debug(error.stack);
          }
          client.close();
        })();
})

sessionsRouter.route('/:id')
	.get((req, res) => {
    const id = req.params.id
    const dbName = 'Virtual-Friend';
  
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(mongourl);
        debug('Connected to the mongo DB');
  
        const db = client.db(dbName);
  
        const session = await db.collection('sessions').findOne({_id : new ObjectID (id)});

        const speaker = await speakerService.getSpeakerById(session.speakers[0].id)

        session.speaker = speaker.data
        res.render('session', {
          session,});
      } catch (error) {
        debug(error.stack);
      }
      client.close();
    })();
})

module.exports = sessionsRouter