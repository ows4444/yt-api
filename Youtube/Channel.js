/* eslint-disable prefer-promise-reject-errors */
const Youtube = require('youtube-api');
class Channel {
  GetById(id) {
    return new Promise((resolve, reject) =>
      id && typeof id === 'string'
        ? Youtube.channels.list({ part: 'snippet', id }, (_err, _data) =>
            !_err
              ? _data.items.length
                ? resolve(_data.items[0])
                : reject('No Channel Found')
              : reject(_err)
          )
        : reject('Give Id In String')
    );
  }
}
module.exports = new Channel();
