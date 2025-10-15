import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// @desc Get All cart items for the logged-in user
// @route GET /api/cart
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price images"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        message: "Cart not found",
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    }

    const items = cart.items.map((item) => {
      let price = item.price ?? item.productId.price;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        images: item.productId.images,
        quatity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

    res.status(200).json({
      items,
      totalItems: items.length,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Post Add to cart
// @route POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const { productId, price: frontPrice } = req.body;
    const quantity = Number(req.body.quantity) || 1;
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }
    // fetch product from DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let expectedPrice = product.offerPrice ?? product.price;

    // verify price
    // if (frontPrice !== expectedPrice) {
    //   return res.status(400).json({
    //     message: "Price mismatch",
    //   });
    // }

    // add to cart
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [
          {
            productId,
            quantity,
            price: expectedPrice,
          },
        ],
      });
    } else {
      // check if product already exist in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex >= 0) {
        // product exists -> update quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].price = expectedPrice;
      } else {
        cart.items.push({ productId, quantity, price: expectedPrice });
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Update item quantity
// @route PUT /api/cart/:productId
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
