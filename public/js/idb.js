const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          return response.json();
        })
        .then(() => {
          // delete records if successful
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);

















// if (!('indexedDB' in window)) {
//   console.log('This browser doesn\'t support IndexedDB');
//   // return;
// }

// let db;

// // establish connection / open DB
// const request = indexedDB.open('budget_tracker', 1)

// // To CREATE or UPDATE Object Store
// request.onupgradeneeded = function (event) {
//   const db = event.target.result;
//   db.createObjectStore('updated_budget', { autoIncrement: true });
// };

// // To handle ERRORS
// request.onerror = function (e) {
//   console.log("there was an error: " + e.target.errorCode)
// };

// // To handle SUCCESS - when DB is successfully created/upgraded
// request.onsuccess = function (event) {
//   db = event.target.result

//   // catch any error
//   db.onerror = function (event) {
//     console.log("error" + event.target.errorCode);
//   }
//   if (navigator.online) {
//     //upload local Budget data to API
//     uploadBudget()
//   }
// };

// function saveRecord(record) {
//   // open new transaction w/read & write priv
//   const transaction = db.transaction(['updated_budget'], 'readwrite');

//   // "unlock"  ObjStore
//   const budgetObjectStore = transaction.objectStore('updated_budget');

//   // add to objStore
//   budgetObjectStore.add(record);
// }

// function uploadBudget() {
//   // open a transaction on pending db
//   const transaction = db.transaction(['updated_budget'], 'readwrite');

//   // access the pending store
//   const budgetObjectStore = transaction.objectStore('updated_budget');

//   //get all the records from the store
//   const getAll = budgetObjectStore.getAll();

//   getAll.onsuccess = function () {
//     // if data in store then send to API server
//     if (getAll.result.length > 0) {
//       fetch('/api/transaction', {
//         method: 'POST',
//         body: JSON.stringify(getAll.result),
//         headers: {
//           Accept: 'application/json, text/plain, */*',
//           'Content-Type': 'application/json'
//         }
//       })
//         .then(res => {
//           return res.json();
//         })
//         .then(serverResponse => {
//           if (serverResponse.message) {
//             throw new Error(serverResponse);
//           }

//           const transaction = db.transaction(['updated_budget'], 'readwrite');
//           const budgetObjectStore = transaction.objectStore('updated_budget');

//           // clear items in store
//           budgetObjectStore.clear();
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }
//   };
// }