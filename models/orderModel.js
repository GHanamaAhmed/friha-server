const couponModel = require("./couponModel");
const ProductModule = require("./productModel");
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  photo: {
    type: String,
  },
  email: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  productsIds: {
    type: [
      {
        name: String,
        price: Number,
        id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quntity: Number,
        size: String,
        color: String,
        thumbanil: String,
      },
    ],
    required: true,
  },
  adress: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  coupon: {
    type: String,
  },
  disCount: {
    type: {
      type: String,
      enum: ["porcent", "price"],
    },
    price: {
      type: Number,
    },
  },
  price: {
    type: Number,
  },
  delivery: {
    type: String,
    enum: ["deleveryAgency", "homeDelivery"],
    default: "deleveryAgency",
  },
  shipping: {
    type: Number,
  },
  states: {
    type: String,
    required: true,
    enum: [
      "pending",
      "accepted",
      "rejected",
      "cancelled",
      "completed",
      "return",
      "removed",
    ],
    default: "pending",
  },
  removed: Boolean,
});
orderSchema.pre("save", async function (next) {
  if (this.price === null || this.price === undefined) {
    let products = await Promise.all(
      this.productsIds.map(async (e, i) => await ProductModule.findById(e.id))
    );
    let p = products.filter(
      (e) => (!e.showPrice || !e.price) && (!e.showPromotion || !e.promotion)
    );
    if (!p.length) {
      let productsPrices = products.map((e, i) => {
        if (e.promotion && e.showPromotion) {
          return e.promotion * this.productsIds[i].quntity;
        }
        if (e.price && e.showPrice) {
          return e.price * this.productsIds[i].quntity;
        }
      });
      let price = productsPrices.reduce((sum, num) => sum + num, 0);
      const coupon = await couponModel.findOne({ code: this.coupon });
      if (
        coupon?.max ||
        (coupon?.expireAt &&
          !(
            coupon?.max + 1 < coupon?.count ||
            coupon?.expireAt - coupon.createAt <= 0
          ))
      ) {
        if (coupon.porcent) {
          this.price = price * (1 - coupon.porcent);
          this.disCount.type = "porcent";
          this.disCount.price = price - price * (1 - coupon.porcent);
        } else {
          this.price = price - coupon.price;
          this.disCount.type = "price";
          this.disCount.price = price - (price - coupon.price);
        }
      } else {
        this.price = price;
      }
    }
  }
  next();
});
module.exports = mongoose.model("order", orderSchema);
