const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const api = express(); require('dotenv').config();
const Youtube = require('youtube-api');

// initilze App and Yt App
admin.initializeApp();
Youtube.authenticate({ type: 'key', key: process.env.GOOGLE_API_KEY });
api.use(cors({ origin: true }));
// Add Js Classes
const User = require('./User');
const Category = require('./Category');
const Channel = require('./Youtube/Channel');
const Video = require('./Youtube/Video');

api.post('/add_category', (req, res) => User.isAdmin(req.body.token).then(() => Category.Create(req.body.CategoryName)).then(message => res.json({ status: true, message })).catch(message => res.json({ status: false, message })));
api.post('/get_channel_by_id', (req, res) => {
    console.log(req.body.ChannelId);
    Channel.GetById(req.body.ChannelId).then(data => res.json({ status: true, data })).catch(message => res.json({ status: false, message }))
});
api.post('/get_channel_by_user', (req, res) => {
    console.log(req.body.ChannelUser);
    Channel.GetByUserName(req.body.ChannelUser).then(data => res.json({ status: true, data })).catch(message => res.json({ status: false, message }))
});
api.post('/get_channel_by_video_id', (req, res) => Video.GetChannelIdById(req.body.VideoId).then(ChannelId => Channel.GetById(ChannelId)).then(data => res.json({ status: true, data })).catch(message => res.json({ status: false, message })))

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('404 Not Found');
    next(error.message);
}

function errorHandler(message, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        status: false, message
    });
}
api.use(notFound);
api.use(errorHandler);
exports.api = functions.https.onRequest(api);
