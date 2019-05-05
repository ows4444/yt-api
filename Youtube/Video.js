/* eslint-disable prefer-promise-reject-errors */
const Youtube = require('youtube-api');
class Video {
    GetById(id) { return new Promise((resolve, reject) => id && typeof (id) === 'string' ? Youtube.videos.list({ part: 'snippet', id }, (_err, _data) => !_err ? resolve(_data) : reject(_err)) : reject('Give id In String')) }
    GetChannelIdById(id) { return new Promise((resolve, reject) => id && typeof (id) === 'string' ? Youtube.videos.list({ part: 'snippet', id }, (_err, _data) => !_err ? _data.items.length ? resolve(_data.items[0].snippet.channelId) : reject('No Channel Found') : reject(_err)) : reject('Give id In String')) }
}
module.exports = new Video();
