const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.renderSignUp = (req, res) => {
    res.render("user/signup.ejs");
}

const geolib = require('geolib'); // Import geolib library for distance calculation

module.exports.signup = async (req, res) => {
    try {
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.address + ' ' + req.body.pincode,
                limit: 2
            })
            .send()
        let userGeometry = response.body.features[0].geometry;
        const owner = "6638779c9bfc94fc81a42508";
        let { username, address, pincode, mobile, password } = req.body;
        const newUser = new User({ address, pincode, mobile, username, geometry: userGeometry, owner });
        const registerUser = await User.register(newUser, password);

        // Coordinates of the shop (Assuming you have the shop's coordinates)
        const shopCoordinates = { latitude: 26.726048, longitude: 82.679636 };
        // Calculate distance between user and shop coordinates
        const distance = geolib.getDistance(
            { latitude: userGeometry.coordinates[1], longitude: userGeometry.coordinates[0] }, // User coordinates
            shopCoordinates // Shop coordinates
        );

        // Update the user's distance field
        registerUser.distance = (distance/1000+distance*0.0001).toFixed(2);
        registerUser.balance_due=0;
        

        // Save the updated user document
        await registerUser.save();

        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Mukesh HardWare Store");
            res.redirect("/items");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLogin = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        res.clearCookie('order');
        req.flash("success", "you are logged out!");
        res.redirect("/items");
    })

}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Mukesh Hardware Store");
    let redirectUrl = res.locals.redirectUrl || "/items";

    res.redirect(redirectUrl);
}