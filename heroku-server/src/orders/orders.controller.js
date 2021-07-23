const path = require("path");
const { includes } = require("../data/orders-data");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

//checks whether the specific order exists

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.orderId = orderId;
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order ID not found: ${orderId}.`,
  });
}

function isValidOrder(req, res, next) {
  const requiredFields = ["deliverTo", "mobileNumber", "dishes"];

  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      return next({
        status: 400,
        message: `Order must include a ${field}`,
      });
    }
  }

  let dishes = req.body.data.dishes;

  if (!Array.isArray(dishes) || !dishes.length) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }

  for (const dish of dishes) {
    if (
      !dish.quantity ||
      dish.quantity <= 0 ||
      !Number.isInteger(dish.quantity)
    ) {
      return next({
        status: 400,
        message: `Dish ${dish.id} must have a quantity that is an integer of 0 or greater.`,
      });
    }
  }

  next();
}

function validateId (req, res, next) {
    if (req.body.data.id && (req.body.data.id !== res.locals.orderId)) {
        return next({
          status: 400,
          message: `No match found for id: ${req.body.data.id}`,
        });
      }
      next();
}


function isValidStatus (req, res, next) {

    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"]

    if (validStatuses.includes(req.body.data.status)) {
        return next()
    }

    next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
      });
    //checks for existence of status

    // if (!res.locals.order.status) {
    //     return next({
    //         status: 400,
    //         message: "Order must have a status"
    //       });
    // }
  //handles delivered orders

//   if (res.locals.order.status === "delivered") {
//     return next({
//       status: 400,
//       message: "An order with delievered status cannot be changed"
//     });
//   }
  next();
}

function isPending(req, res, next) {
  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: "An order can not be deleted unless the status is pending."
    });
  }
  next();
}


function destroy(req, res) {
  const index = orders.findIndex(
    (order) => order.id === Number(res.locals.orderId)
  );
  orders.splice(index, 1);
  res.sendStatus(204);
}

function update(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  res.locals.order.id = res.locals.orderId;
  res.locals.order.deliverTo = deliverTo;
  res.locals.order.mobileNumber = mobileNumber;
  res.locals.order.status = status;
  res.locals.order.dishes = dishes;
  res.json({ data: res.locals.order });
}
//create a new order
function create(req, res) {
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

//gets a single order

function read(req, res) {
  res.json({ data: res.locals.order });
}

//gets all the orders

function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  delete: [orderExists, isPending, destroy],
  update: [orderExists, isValidStatus, isValidOrder, validateId, update],
  create: [isValidOrder, create],
  read: [orderExists, read],
  list,
};
