import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// @route   POST /api/orders
// @desc    Create (place) a new order
// @access  Private
export const placeOrders = async (req, res) => {
  try {
    const { paymentMethod } = req.body || "COD";
    const userId = req.user._id;

    const user = await User.findById(userId).populate("address");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const stockUpdateBulk = cart.items.map((item) => ({
      updateOne: {
        filter: {
          _id: item.productId._id,
        },
        update: {
          $inc: {
            stock: -item.quantity,
          },
        },
      },
    }));

    await Product.bulkWrite(stockUpdateBulk);

    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      paymentMethod,
      shippingAddress: user.address[0],
    });

    // Clear the cart after placing
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    res.status(201).json({
      message: "Order placed Successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/orders/my
// @desc    get (placed)  order
// @access  Private
export const getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("items.productId", "name price imageUrl")
    .populate("shippingAddress");
  res.status(200).json(orders);
};
