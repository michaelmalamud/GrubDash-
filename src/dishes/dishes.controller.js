const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//checks whether :dishId exists in dishes

function dishExists (req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dishId = dishId;
        res.locals.dish = foundDish;
        return next()
    }
    next({
        status: 404,
        message: `Dish ID not found: ${dishId}.`
    })
}

function isValidDish(req, res, next) {
    
    //gets all required data properties in an array

    const requiredFields = ["name", "description", "price", "image_url"];

    //checks for existence of properties by iterating through array

    for (const field of requiredFields) {
      if (!req.body.data[field]) {
        return next({
          status: 400,
          message: `Dish must include a ${field}`,
        });
      }
    }
    if (req.body.data.price < 0 || !Number.isInteger(req.body.data.price)) {
      return next({
        status: 400,
        message: `Dish must have a price that is an integer greater than 0`,
      });
    }

        //checks if dishId exists and matches :dishId
        if (req.body.data.id && (req.body.data.id !== res.locals.dishId)) {
          return next({
            status: 400,
            message: `No match found for id: ${req.body.data.id}`
          })
        }

    next();
  }

function create (req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newId = nextId();
    const newDish = {
        id: newId,
        name,
        description,
        price,
        image_url
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

//updates an existing dish 

function update (req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const { dishId } = req.params;
    res.locals.dish.id = dishId;
    res.locals.dish.name = name;
    res.locals.dish.description = description;
    res.locals.dish.price = price;
    res.locals.dish.image_url = image_url;

    res.json({ data: res.locals.dish })
}

//gets an individual dish by ID

function read (req, res) {
    res.json({ data: res.locals.dish })
}

//lists the dishes

function list (req, res) {
    res.json({ data: dishes });
}

//exports functions to dishes router

module.exports = {
    update: [dishExists, isValidDish, update],

    create: [isValidDish, create],

    read: [dishExists, read],

    list,
}