const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const moment = require('moment');
const cors = require('cors');
const api = express();
require('dotenv').config();
const Youtube = require('youtube-api');

// initilze App and Yt App
admin.initializeApp();
const firestore = admin.firestore();
Youtube.authenticate({ type: 'key', key: process.env.GOOGLE_API_KEY });
api.use(cors({ origin: true }));
// Add Js Classes
const User = require('./User');
const Category = require('./Category');
const Channel = require('./Youtube/Channel');
const Video = require('./Youtube/Video');

api.post('/add_category', (req, res) =>
  User.isAdmin(req.body.token)
    .then(() => Category.Create(req.body.CategoryName))
    .then(message => res.json({ status: true, message }))
    .catch(message => res.json({ status: false, message }))
);
api.post('/get_channel_by_id', (req, res) => {
  console.log(req.body.ChannelId);
  Channel.GetById(req.body.ChannelId)
    .then(data => res.json({ status: true, data }))
    .catch(message => res.json({ status: false, message }));
});
api.post('/get_channel_by_user', (req, res) => {
  console.log(req.body);
  Channel.GetByUserName(req.body.ChannelUser)
    .then(data => res.json({ status: true, data }))
    .catch(message => res.json({ status: false, message }));
});
api.post('/get_channel_by_video_id', (req, res) =>
  Video.GetChannelIdById(req.body.VideoId)
    .then(ChannelId => Channel.GetById(ChannelId))
    .then(data => res.json({ status: true, data }))
    .catch(message => res.json({ status: false, message }))
);
// TODO: OOP This QUICK
api.post('/save_channel', (req, res) => {
  firestore
    .collection('Categories')
    .doc(req.body.Channel)
    .collection(req.body.Type)
    .doc(req.body.data.id)
    .set({
      etag: req.body.data.etag,
      snippet: req.body.data.snippet,
      createdAt: moment().valueOf()
    })
    .then(() => {
      res.json({ status: true, message: 'Saved' });
    })
    .catch(message => {
      res.json({ status: false, message });
    });
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('404 Not Found');
  next(error.message);
}

function errorHandler(message, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    status: false,
    message
  });
}
api.use(notFound);
api.use(errorHandler);
exports.api = functions.https.onRequest(api);
