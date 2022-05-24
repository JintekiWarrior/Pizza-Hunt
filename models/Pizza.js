// Importing the Schema constructor and model function
const dateFormat = require("../utils/dateFormat");
const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema(
  {
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
      // Uses a getter (special type of function that modifies stored data before retrieval) to format the date
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [],
    // Referencing the Object id of the comment section to create a relationship
    comments: [
      {
        type: Schema.Types.ObjectId,
        // The ref property tells the Pizza model which document to search for the right comments.
        ref: "Comment",
      },
    ],
  },
  // tells the schema that virtuals and getters can be used
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    // id is false becuase its a virtual we don't need
    id: false,
  }
);

// Virtuals allow you to add properties not stored in the database
// They are normally computed values that get evaluated when there properties are accessed.
// To learn more https://mongoosejs.com/docs/tutorials/virtuals.html

// Virtual to get the total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// creates the Pizza model using the Schema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
