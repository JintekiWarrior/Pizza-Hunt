// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// the request varaible will act as an event listener for the database.
// The event listener is created when a connection is opened with the command following it.
// indexedDB is a global variable and part of the window object
const request = indexedDB.open("pizza_hunt", 1);

// this event will emit if the database version changes (nonexistent to version 1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  // create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// upon success
// set this up so when we finalize the connection to the database, we can store the resulting database object to the global db object we
// created earlier.
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection,
  // save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

// hendler to inform us if anything ever goes wrong with the databse interaction
request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  // This is because CRUD operations are not always available with IndexedDB, instead we must open a connection or transaction to perform them
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method
  // the add method is part of the store function which indexedDB uses to store data
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // .getAll() is an asynchronous function in which we must attach an event handler to
  // onsuccess will run if getAll completes successfully
  // getAll will return a .result property with all the data we saved in the store on it
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "aaplication/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listens for the app coming back online
window.addEventListener("online", uploadPizza);
