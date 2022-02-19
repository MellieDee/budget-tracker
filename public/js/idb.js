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
    saveRecord()
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

