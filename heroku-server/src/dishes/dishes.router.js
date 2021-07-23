const methodNotAllowed = require("../errors/methodNotAllowed");

const router = require("express").Router();

//imports controller 

const controller = require("./dishes.controller");

//imports orders router in

const ordersRouter = require("../orders/orders.router");

// TODO: Implement the /dishes routes needed to make the tests pass

//establishes /dishes/:orderId route 

router.use("/dishes/:orderId", ordersRouter);

// /dishes/:dishId route


router.route("/:dishId").get(controller.read).put(controller.update).all(methodNotAllowed);

// /dishes route

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

module.exports = router;
