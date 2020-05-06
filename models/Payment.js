const mongoose = require("mongoose");
const Room = require("./Room");
const Product = require("./Product");

const PaymentSchema = new mongoose.Schema({
  room: {
    type: mongoose.Types.ObjectId,
    ref: "Room",
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  checkInDate: {
    type: Date,
    default: Date.now,
  },

  checkOutDate: {
    type: Date,
    default: null,
  },

  totalHourSpend: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["checkedIn", "checkedOut"],
    default: "checkedIn",
  },

  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calulate total price
PaymentSchema.pre("save", async () => {
  // Only caluclte when checked out
  if (this.checkOutDate == null) return;

  const room = await Room.findById(this.room);

  if (!room) return;

  // Caluclate diff in date
  const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
  const diffHours = diffTime / (1000 * 60 * 60);

  let total = room.price * diffHours;

  let productIds = [];
  let quantity = {};

  for (let i = 0; i < this.products.length; i++) {
    productIds.push(this.products[i].productId);
    quantity[this.products[i].productId] = this.products[i].quantity;
  }

  const products = await Product.find({ _id: { $in: productIds } });

  products.forEach((product) => {
    total += product.price * quantity[product._id];
  });

  this.total = total;

  this.status = "checkedOut";
});

module.exports = mongoose.model("Payment", PaymentSchema);
