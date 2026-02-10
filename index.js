require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productsRoutes = require("./routes/productsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const couponRoutes = require("./routes/couponsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const websiteSettings = require("./routes/websiteSettingsRoutes");
const messageToUserRoutes = require("./routes/messageToUserRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const notebookCategoriesRoutes = require("./routes/notebookCategoriesRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/public", express.static("public"));

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = isProduction
  ? ["https://notervoadmin.vercel.app", "https://notervo.vercel.app"]
  : ["http://localhost:3000", "http://localhost:3001"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests with no Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/website-settings", websiteSettings);
app.use("/api/message-to-user", messageToUserRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/notebook-categories", notebookCategoriesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Notervo Ecommerce API");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
