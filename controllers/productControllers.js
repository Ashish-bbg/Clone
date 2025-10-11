import Product from "../models/productModel.js";

// @desc Get all products
// @route GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc get single product by id
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Search and filter products
// @route GET /api/products/search?q=..
export const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;

    // build dynamic query
    const query = {};

    // search by name (if q provided)
    if (q) {
      query.name = {
        $regex: q,
        $options: "i",
      };
    }

    // filter by category
    if (category) {
      query.category = category;
    }

    // filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$lte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$gte = Number(maxPrice);
      }
    }

    // Sorting options
    // sort=price_asc or sort=price_desc
    let sortOptions = {};
    if (sort === "price_asc") {
      sortOptions.price = 1;
    } else if (sort === "price_desc") {
      sortOptions.price = -1;
    } else if (sort === "newest") {
      sortOptions.createdAt = -1;
    }

    // fetch results
    const products = Product.find(query).sort(sortOptions);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
