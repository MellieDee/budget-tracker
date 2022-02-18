let db;

// establish connection / open DB
const request = indexedDB.open('budget-tracker', 1)

// To CREATE or UPDATE Object Store
request.onupgraeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore('budget-tracker', { autoIncrement: true })
};

// To handle ERRORS
request.onerror = function (e) {
  console.log("there was an error: " + e.target.errorCode)
};

// To handle SUCCESS - when DB is successfully created/upgraded
request.onsuccess = function (e) {
  let db = e.request.result

  if (navigator.online) {
    //upload local Budget data to API
  }
};