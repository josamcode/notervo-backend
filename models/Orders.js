const mongoose = require("mongoose");
const crypto = require("crypto");

const ORDER_ID_PREFIX = "NTV";
const ORDER_ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOrderNumber() {
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    const randomIndex = crypto.randomInt(0, ORDER_ID_CHARS.length);
    suffix += ORDER_ID_CHARS[randomIndex];
  }
  return `${ORDER_ID_PREFIX}-${suffix}`;
}

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    orderNumber: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
      index: true,
      immutable: true,
    },
    total: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        image: String,
        price: Number,
        originalPrice: Number,
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          default: null,
        },
        size: {
          type: String,
          default: null,
        },
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      city: String,
      street: String,
      notes: String,
    },
    paymentMethod: {
      type: String,
      enum: ["CashOnDelivery", "Card", "PayPal"],
      default: "CashOnDelivery",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ordersSchema.pre("validate", async function (next) {
  if (this.orderNumber) {
    return next();
  }

  const OrderModel = this.constructor;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = generateOrderNumber();
    // Retry on collisions to keep IDs short and unique.
    // eslint-disable-next-line no-await-in-loop
    const existing = await OrderModel.exists({ orderNumber: candidate });
    if (!existing) {
      this.orderNumber = candidate;
      return next();
    }
  }

  return next(new Error("Failed to generate a unique order number"));
});

// Format total
ordersSchema.pre("save", function (next) {
  if (this.total !== undefined && this.total !== null) {
    this.total = Number(this.total.toFixed(2));
  }
  next();
});

module.exports = mongoose.model("Order", ordersSchema);
