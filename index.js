const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Youtube = require('youtube-api');

admin.initializeApp();
const api = express();
api.use(cors({ origin: true }));

Youtube.authenticate({
  type: 'key',
  key: process.env.GOOGLE_API_KEY
});

api.get('/', (req, res) => {
  getList()
    .then(data => {
      res.json({ status: true, data });
    })
    .catch(e => {
      console.log(e);
      res.json({ status: false, e });
    });
});

async function getList() {
  return new Promise((resolve, reject) => {
    Youtube.search.list(
      {
        part: 'snippet',
        relatedToVideoId: 'Ks-_Mh1QhMc',
        type: 'video'
      },
      (_err, _data) => {
        console.log(_data);
        if (!_err) resolve(_data);
        else reject(_err);
      }
    );
  });
}

exports.api = functions.https.onRequest(api);
