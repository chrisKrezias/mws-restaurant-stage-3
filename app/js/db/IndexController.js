const dbPromise = idb.open('keyval-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('keyval');
});

const dbReviews = idb.open('reviews-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('reviewsdb');
});

const idbKeyval = {
  get(key) {
    return dbPromise.then(db => {
      return db.transaction('keyval')
        .objectStore('keyval').get(key);
    });
  },
  set(key, val) {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').put(val, key);
      return tx.complete;
    });
  },
  delete(key) {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').delete(key);
      return tx.complete;
    });
  },
  clear() {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').clear();
      return tx.complete;
    });
  },
  keys() {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval');
      const keys = [];
      const store = tx.objectStore('keyval');

      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
};

const idbReviews = {
  get(key) {
    return dbReviews.then(db => {
      return db.transaction('reviewsdb')
        .objectStore('reviewsdb').get(key);
    });
  },
  set(key, val) {
    return dbReviews.then(db => {
      const tx = db.transaction('reviewsdb', 'readwrite');
      tx.objectStore('reviewsdb').put(val, key);
      return tx.complete;
    });
  },
  delete(key) {
    return dbReviews.then(db => {
      const tx = db.transaction('reviewsdb', 'readwrite');
      tx.objectStore('reviewsdb').delete(key);
      return tx.complete;
    });
  },
  clear() {
    return dbReviews.then(db => {
      const tx = db.transaction('reviewsdb', 'readwrite');
      tx.objectStore('reviewsdb').clear();
      return tx.complete;
    });
  },
  keys() {
    return dbReviews.then(db => {
      const tx = db.transaction('reviewsdb');
      const keys = [];
      const store = tx.objectStore('reviewsdb');

      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
};