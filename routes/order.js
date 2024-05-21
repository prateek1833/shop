const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { orderSchema } = require("../schema.js");
const Order = require("../models/order.js");
const Item = require("../models/item.js");
const {isLoggedIn,validateOrder}=require("../middleware.js");

const orderController=require("../Controller/order.js")

router
.post("/",isLoggedIn, wrapAsync(orderController.addToCart));

router.delete("/delete",isLoggedIn, wrapAsync(orderController.destroyFromCart));

router.get("/:id/location", isLoggedIn, async (req, res) => {
    res.render('user/location.ejs');
})
router.get("/checkout", isLoggedIn, async (req, res) => {
    const order = req.cookies.order ? JSON.parse(req.cookies.order) : [];
    res.render('user/checkout.ejs', { order: order});
})

router
.post("/updateLocation",(orderController.updateLocation));

router
.post("/checkout",isLoggedIn, (orderController.createOrder));

module.exports=router;
