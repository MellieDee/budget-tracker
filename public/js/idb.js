if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
  // return;
}

let db;

// establish connection / open DB
const request = indexedDB.open('budget_tracker', 1)

// To CREATE or UPDATE Object Store
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore('updated_budget', { autoIncrement: true });
};

// To handle ERRORS
request.onerror = function (e) {
  console.log("there was an error: " + e.target.errorCode)
};

// To handle SUCCESS - when DB is successfully created/upgraded
request.onsuccess = function (event) {
  db = event.target.result

  // catch any error
  db.onerror = function (event) {
    console.log("error" + event.target.errorCode);
  }

  if (navigator.online) {
    //upload local Budget data to API
    uploadBudget()
  }
};

function saveRecord(record) {
  // open new transaction w/read & write priv
  const transaction = db.transaction(['updated_budget'], 'readwrite');

  // "unlock"  ObjStore
  const budgetObjectStore = transaction.objectStore('updated_budget');

  // add to objStore
  budgetObjectStore.add(record);
}

function uploadBudget() {
  // open a transaction on pending db
  const transaction = db.transaction(['updated_budget'], 'readwrite');

  // access the pending store
  const budgetObjectStore = transaction.objectStore('updated_budget');

  //get all the records from the store
  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    // if data in store then send to API server
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(res = res.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(['updated_budget'],
            'readwrite');
          const budgetObjectStore = transaction.objectStore('updated_budget');

          // clear items in store
          budgetObjectStore.clear();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}