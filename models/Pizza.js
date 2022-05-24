// Importing the Schema constructor and model function
const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema({
  pizzaName: {
    // get to use javascript data types.
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    // sets a default value
    default: Date.now,
  },
  size: {
    type: String,
    default: "Large",
  },
  toppings: [],
});

// creates the Pizza model using the Schema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
