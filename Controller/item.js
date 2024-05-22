const Item = require("../models/item");
const Orders = require("../models/order");
const User = require("../models/user");

module.exports.index = async (req, res) => {
    const allItem = await Item.find({});
    res.render("items/index.ejs", { allItem });
}
module.exports.indexHardware = async (req, res) => {
    const allItem = await Item.find({ category: "Hardware" });
    res.render("items/index.ejs", { allItem });
}
module.exports.indexClothes = async (req, res) => {
    const allItem = await Item.find({ category: "Clothes" });
    res.render("items/index.ejs", { allItem });
}
module.exports.indexAccessories = async (req, res) => {
    const allItem = await Item.find({ category: "Accessories" });
    res.render("items/index.ejs", { allItem });
}
module.exports.indexPaint = async (req, res) => {
    const allItem = await Item.find({ category: "Paint" });
    res.render("items/index.ejs", { allItem });
}
module.exports.indexGrocery = async (req, res) => {
    const allItem = await Item.find({ category: "Grocery" });
    res.render("items/index.ejs", { allItem });
}
module.exports.search = async (req, res) => {
    const keyword = req.query.keyword; // Assuming keyword is sent in the query parameters
    console.log(keyword);
    // Find items where title or description contains the keyword
    const allItem = await Item.find({
        $or: [
            { title: { $regex: new RegExp(keyword, 'i') } }, // Case-insensitive regex search for title
            { description: { $regex: new RegExp(keyword, 'i') } }, // Case-insensitive regex search for description
            { key: { $regex: new RegExp(keyword, 'i') } },
            { category: { $regex: new RegExp(keyword, 'i') } },
        ]
    });

    res.render("items/index.ejs", { allItem });
}

module.exports.showItem = async (req, res) => {
    let { id } = req.params;
    const item = await Item.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");;
    if (!item) {
        req.flash("error", "Item you trying to access does not exist");
        res.redirect("/items");
    }
   
    res.render("items/show.ejs", { item });
}
module.exports.orders = async (req, res) => {
    const allOrder = await Orders.find({}).sort({ createdAt: -1 });
    res.render("items/orders.ejs", { allOrder,User });
}
module.exports.myOrders = async (req, res, next) => {
    try {
        let { id } = req.params;
        const allOrder = await Orders.find({ "author._id": id });
        res.render("user/myOrders.ejs", { allOrder, User });
    } catch (error) {
        next(error); 
    }
};



module.exports.createItem = async (req, res) => {
    let { title, description, category, unit, key } = req.body;
    let { price, typ } = req.body;

    let url = req.file.path;
    let filename = req.file.filename;

    // Create an array of detail objects
    let detail = [];
    for (let i = 0; i < price.length; i++) {
        detail.push({ price: price[i], typ: typ[i] });
    }

    try {
        let newItem = await new Item({
            owner: req.user._id,
            title: title,
            description: description,
            category: category,
            unit: unit,
            key: key.split(" "),
            image: { url, filename },
            detail: detail, // Assign the detail array
        });

        await newItem.save();
        console.log("New item saved");
        req.flash("success", "New Item Created");
        res.redirect("/items");
    } catch (err) {
        console.log(err);
        req.flash("error", "Error creating new item");
        res.redirect("/items/new");
    }
}


module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const item = await Item.findById(id);
    if(!item){
        res.flash("error","Item you requested does not exist!");
        res.redirect("/items");
    }
    let originalImageUrl=item.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("items/edit.ejs", { item,originalImageUrl });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, unit, detail, key } = req.body;

    // Convert key from a comma-separated string to an array
    const keywords = key.split(',').map(keyword => keyword.trim());

    // Find and update the item
    let item = await Item.findByIdAndUpdate(id, {
        title,
        description,
        category,
        unit,
        detail,  // Assuming detail is correctly formatted as an array of objects { price, typ }
        key: keywords,
    }, { new: true });  // The { new: true } option returns the updated document

    // Handle image upload
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        item.image = { url, filename };
        await item.save();
    }

    req.flash("success", "Item Updated");
    res.redirect(`/items/${id}/show.ejs`);
};


module.exports.destroyItem = async (req, res) => {
    let { id } = req.params;
    let deleted = await Item.findByIdAndDelete(id);
    req.flash("success", " Item deleted");
    res.redirect("/items");
}