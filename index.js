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
const api = express();
api.use(cors({ origin: true }));

api.post('/add_category', async (req, res) => {
  User.isAdmin(req.body.token)
    .then(async () => {
      Category.Create(req.body.CategoryName)
        .then(() => {
          res.json({ status: true, message: 'Created' });
        })
        .catch(e => {
          console.log(e);
          res.json({ status: false, message: e });
        });
    })
    .catch(e => {
      console.log(e);
      res.json({ status: false, message: e });
    });
});

api.post('/get_channel_by_id', (req, res) => {
  Channel.GetById('UCMoIpmr5X5PvcjP2kuuiXSw')
    .then(d => {
      res.json(d);
    })
    .catch(e => {
      console.log(e);
      console.log('e');
    });
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
