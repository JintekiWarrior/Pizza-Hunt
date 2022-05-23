const express = require("express");
// require mongoose so we can set it up to connect on app startup
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// mongoose.connect is a method from the mongoose library that tells mongoose which database to connect to
mongoose.connect(
  // Either we connect to MONGODB_URI which will be our deployed db. Otherwise use the local mongoDB databse.
  process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
  // these are configuration options MongoDB asks for and more info can be found here https://mongoosejs.com/docs/connections.html#options.
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// This logs mongo queries being executed
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
