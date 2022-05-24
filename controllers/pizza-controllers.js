// This file will handle the pizza model updates
const { Pizza } = require("../models");

// functions that will go in as methods
// These functions will be used as callback functions for the routes
// Each function will have two params (req, res)
const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    // use mongooses find method on the Pizza model and returns a promise
    Pizza.find({})
      // method to populate our field with comments
      // we need to pass the method an object with a key path and value of the field you
      // want populated
      // We use select to select the __v property and put a minus sign to tell mongo we dont
      // care about that.
      .populate({
        path: "comments",
        select: "-__v",
      })
      // doing the same as above but this is for the pizza model
      .select("-__v")
      // sorts in descending order by id so that we get the newest created pizza on top
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  // out of the request we just need the params to get the id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json;
      });
  },

  // create a pizza
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },

  // update pizza by id
  updatePizza({ params, body }, res) {
    // with this method mongoose finds a single document to update then returns the document after updating.
    // if we don't set { new: true } it returns the original document.
    // there are methods like updateOne() and updateMany() that update docs without returning
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    // finds the document to be returned and deletes it
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
