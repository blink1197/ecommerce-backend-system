const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const app = express();
require('dotenv').config();


// Mongoose Connection
mongoose.connect(process.env.MONGODB_STRING);
let db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => console.log("We're connected to the cloud database"))


// Middleware
app.use(express.json());

// Endpoints
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

if(require.main === module){
    app.listen(process.env.PORT || 3000, () => 
        console.log(`API is now online on port ${process.env.PORT || 3000}`));
}


// Export both app and mongoose for only for checking
module.exports = {app,mongoose};