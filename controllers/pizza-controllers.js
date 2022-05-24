// This file will handle the pizza model updates
const { Pizza } = require('../models')

// functions that will go in as methods
// These functions will be used as callback functions for the routes
// Each function will have two params (req, res)
const  pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    // use mongooses find method on the Pizza model and returns a promise
    Pizza.find({})
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err)
        res.status(400).json(err)
      })
  },

  // get one pizza by id
  // out of the request we just need the params to get the id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .then(dbPizzaData => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' })
          return
        }
        res.json(dbPizzaData)
      })
      .catch(err => {
        console.log(err)
        res.status(400).json
      })
  },

  // create a pizza
  createPizza({ body }, res) {
    Pizza.create(body)
  }
}

module.exports = pizzaController