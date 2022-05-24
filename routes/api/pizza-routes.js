const router = require("express").Router();
const {
  getAllPizza,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../../controllers/pizza-controllers");

// this code
// router.route('/').get(getCallbackFunction).post(postCallbackFunction);

// is this same as this
// router.get('/', getCallbackFunction);
// router.post('/' postCallbackFunction);

// Set up GET all and POST at /api/pizzas
router.route("/").get(getAllPizza).post(createPizza);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router.route("/:id").get(getPizzaById).put(updatePizza).delete(deletePizza);

module.exports = router;
