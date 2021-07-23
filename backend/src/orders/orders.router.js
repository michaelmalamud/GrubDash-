const methodNotAllowed = require("../errors/methodNotAllowed");


const router = require("express").Router({ mergeParams: true});

//imports orders controller

const controller = require("./orders.controller");


// TODO: Implement the /orders routes needed to make the tests pass

//establishes /orders/:orderID route 

router.route("/:orderId").get(controller.read).put(controller.update).delete(controller.delete).all(methodNotAllowed);

//establishes /orders route

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);

module.exports = router;
