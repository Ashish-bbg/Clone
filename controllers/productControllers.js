import mongoose from "mongoose";
import Product from "../models/productModel.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const pagiNation = (pageNum, limitPerPage) => {
  let page = Number(pageNum) || 1;
  let limit = Number(limitPerPage) || DEFAULT_LIMIT;

  if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  if (limit < 1) limit = DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// @desc Get all products
// @route GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    // Pagination
    const { page, limit, skip } = pagiNation(req.query.page, req.query.limit);

    // Calculating the number of products to skip

    // fetch products with limit & skip
    const products = await Product.find().skip(skip).limit(limit);

    // Total products count useful for frontend (optional)
    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const product = await Product.findById(id).populate("reviews");

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
    const { q, category, minPrice, maxPrice, sort, page, limit } = req.query;

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
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        query.price.$lte = Number(maxPrice);
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

    // Pagination
    const { page: pageNumber, limit: pageSize, skip } = pagiNation(page, limit);

    // fetch Products from MongoDB
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Product.countDocuments(query);

    // let currentPage = 0;
    // if(total>0) currentPage = pageNumber
    // send Responf
    res.status(200).json({
      products,
      page: total === 0 ? 0 : pageNumber,
      totalPages: Math.ceil(total / pageSize),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
