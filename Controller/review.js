const Review = require("../models/review.js");
const Item = require("../models/item.js");
module.exports.createReview=async(req,res)=>{
    let item=await Item.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(req.body);
    item.reviews.push(newReview);
    await newReview.save();
    await item.save();
    req.flash("success","New Review added");    
    res.redirect(`/items/${item._id}/show.ejs`);
}

module.exports.destroyReview=async (req, res) => {
    let { id, rid } = req.params;
    
    await Item.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findById(rid);
    req.flash("success","Review Deleted");
    res.redirect(`/items/${id}/show.ejs`);
}