const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic product info
    title: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    // Discount details
    discount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"], // Fixed amount or percentage
      default: "fixed",
    },

    // Multiple categories allowed (e.g. ["daily", "lined"])
    category: {
      type: [String],
      default: [],
    },

    // Notebook variations
    sizes: {
      type: [String], // e.g. ["A5", "A4", "B5"]
      default: [],
    },
    colors: {
      type: [String], // e.g. ["black", "stone", "ivory"]
      default: [],
    },

    // Tags for filtering/searching
    tags: {
      type: [String], // e.g. ["grid", "dot", "planner"]
      default: [],
    },

    // Image URLs or filenames
    images: {
      type: [String],
      default: [],
    },

    // Inventory control
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number, // Useful for quantity-based stock tracking
      default: 0,
    },

    // Brand or notebook line
    brand: {
      type: String,
      default: "Notervo",
    },

    // Rating system
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    // Product visibility (can hide without deleting)
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
