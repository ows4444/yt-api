/* eslint-disable prefer-promise-reject-errors */
const admin = require('firebase-admin');
const db = admin.database();
class Category {
  Create(name) {
    return new Promise((resolve, reject) => {
      if (name && typeof name === 'string') {
        db.ref('Config')
          .child('Categories')
          .push({ name })
          .then(() => resolve())
          .catch(e => reject(e));
      } else reject('Give Category name in String');
    });
  }
}
module.exports = new Category();
