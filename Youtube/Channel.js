/* eslint-disable prefer-promise-reject-errors */
const Youtube = require('youtube-api');
class Channel {
  GetById(id) {
    return new Promise((resolve, reject) => {
      Youtube.channels.list({ part: 'snippet', id }, (_err, _data) =>
        !_err ? resolve(_data) : reject(_err)
      );
    });
  }
}
module.exports = new Channel();
