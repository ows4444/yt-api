const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Youtube = require('youtube-api');
Youtube.authenticate({
  type: 'key',
  key: process.env.GOOGLE_API_KEY
});
admin.initializeApp();

const User = require('./User');
const Category = require('./Category');
const Channel = require('./Youtube/Channel');
const Video = require('./Youtube/Video');
const api = express();
api.use(cors({ origin: true }));

api.post('/add_category', (req, res) => {
  User.isAdmin(req.body.token)
    .then(() => Category.Create(req.body.CategoryName))
    .then(() => res.json({ status: true, message: 'Created' }))
    .catch(e => res.json({ status: false, message: e }));
});

api.post('/get_channel_by_id', (req, res) => {
  Channel.GetById(req.body.ChannelId)
    .then(data => res.json({ status: true, data }))
    .catch(message => res.json({ status: false, message }));
});
api.post('/get_channel_by_video_id', (req, res) => {
  Video.GetChannelById(req.body.VideoId)
    .then(ChannelId => Channel.GetById(ChannelId))
    .then(data => res.json({ status: true, data }))
    .catch(message => res.json({ status: false, message }));
});
function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message
  });
}

api.use(notFound);
api.use(errorHandler);

exports.api = functions.https.onRequest(api);
