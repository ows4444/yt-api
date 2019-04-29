/* eslint-disable prefer-promise-reject-errors */
const admin = require('firebase-admin');
class User {
  isAdmin(token) {
    if (token && typeof token === 'string') {
      return new Promise((resolve, reject) => {
        admin
          .auth()
          .verifyIdToken(token)
          .then(decodeToken => {
            if (decodeToken.uid === 'docLZ6T6UNbxHzFVXt7OAFwBGcy1') {
              resolve(decodeToken);
            } else reject('Not A Admin User');
          })
          .catch(e => reject(e));
      });
    }
    return Promise.reject('Give  A Token');
  }
}
module.exports = new User();
