const storage = require('./storage');

/*
*   Correct: these should all work out of the box. Look at console and debugger for feedback
* */

// storage.put("test1", 10);
// storage.put("test2", "test");
//
// console.log(storage.get("test1")); // Should return "10"
//
// storage.update("test1", "updated");
//
// storage.delete("test2");
//
// storage.clear();

storage.put("test1", "value1");
storage.put("test2", "value2");
storage.put("test3", "value3");

storage.save();

storage.clear();

// storage.loadPromise();
// storage.loadPromise().then(() => {
//     "use strict";
//     storage.put("test4", 4);
// });

storage.loadSync();
storage.put("AFTER", "AFTER");



/*
*   Incorrect:
*   First two (under Setup initial values) are initial values used for testing. Uncomment those.
*   The rest uncomment one by one. They should throw the commented error.
* */

// Setup initial values:
// storage.put("test1", 1);
// storage.put("test2", 2);

// storage.put(10, "WRONG"); // TypeError
// storage.put("test1", "test"); // ReferenceError
//
// storage.get(10); // TypeError
// storage.get("test3"); // ReferenceError
//
// storage.update(10) // TypeError
// storage.update("test3") // ReferenceError
//
// storage.delete(10) // TypeError
// storage.delete("test3") // ReferenceError


