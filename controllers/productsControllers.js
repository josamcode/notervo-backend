const Product = require("../models/Product");
const NotebookCategory = require("../models/NotebookCategory");
const fs = require("fs");
const path = require("path");
const {
  uploadImageBuffer,
  deleteCloudinaryImageByUrl,
} = require("../config/cloudinary");

const LOCAL_PRODUCTS_IMAGE_DIR = path.join(__dirname, "../public/images/products");

function parseImagesInput(imagesInput) {
  if (!imagesInput) return [];
  return typeof imagesInput === "string" ? [imagesInput] : imagesInput;
}

async function uploadFilesToCloudinary(files = []) {
  if (!files.length) return [];

  const uploads = files.map((file) => uploadImageBuffer(file.buffer));
  const uploadedResults = await Promise.all(uploads);
  return uploadedResults.map((result) => result.secure_url);
}

async function removeImageAsset(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return { skipped: true };
  }

  if (imagePath.startsWith("http")) {
    return deleteCloudinaryImageByUrl(imagePath);
  }

  const filename = path.basename(imagePath);
  const filePath = path.join(LOCAL_PRODUCTS_IMAGE_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return { notFound: true };
  }

  fs.unlinkSync(filePath);
  return { deleted: true };
}

// CREATE Product - Admin Only
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      sizes,
      colors,
      brand,
      inStock,
      stockQuantity,
      tags,
      images: bodyImages,
      discount,
      discountType,
      rating,
      numReviews,
    } = req.body;

    const imagePaths = [];

    const uploadedImageUrls = await uploadFilesToCloudinary(req.files);
    imagePaths.push(...uploadedImageUrls);

    // Handle image URLs from request body
    if (bodyImages) {
      const parsedImages = parseImagesInput(bodyImages);
      parsedImages.forEach((imgUrl) => {
        if (imgUrl.startsWith("http")) imagePaths.push(imgUrl);
      });
    }

    // Prepare product document
    const product = new Product({
      title,
      description,
      price: Number(price),
      category: category
        ? Array.isArray(category)
          ? category
          : category.split(",")
        : [],
      sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(",")) : [],
      colors: colors
        ? Array.isArray(colors)
          ? colors
          : colors.split(",")
        : [],
      brand: brand || "Notervo",
      inStock: inStock !== undefined ? inStock : true,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
      images: imagePaths,
      discount: discount !== undefined ? Number(discount) : 0,
      discountType: ["fixed", "percentage"].includes(discountType)
        ? discountType
        : "fixed",
      rating:
        rating !== undefined
          ? Math.min(Math.max(Number(rating), 0), 5) // clamp between 0 and 5
          : 0,
      numReviews: numReviews !== undefined ? Number(numReviews) : 0,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// READ All Products - Public
// READ All Products - Public
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      q,
      discounted,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { brand: regex },
        { category: regex },
      ];
    }

    if (discounted === "true") {
      filter.discount = { $exists: true, $ne: 0 };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);
    const allProductsCount = await Product.countDocuments();

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
      totalAllProducts: allProductsCount,
      totalPages: Math.ceil(total / limit),
      length: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products?category=daily&brand=Notervo&maxPrice=1000
// GET /api/products?category=creative&minPrice=200&maxPrice=500
// GET /api/products?brand=Notervo&limit=5&page=1
// GET /api/products?page=2&limit=5
// GET /api/products/categories
// GET /api/products/brands

// SEARCH Products
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q, "g");

    const products = await Product.find({
      $or: [
        { title: regex },
        { description: regex },
        { brand: regex },
        { category: regex },
      ],
    });

    res.json({ data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Categories
exports.getCategories = async (req, res) => {
  try {
    const [productCategories, notebookCategories] = await Promise.all([
      Product.distinct("category"),
      NotebookCategory.distinct("categoryKey"),
    ]);

    const categories = [
      ...new Set([...(productCategories || []), ...(notebookCategories || [])]),
    ].sort((a, b) => a.localeCompare(b));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");

    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Top Rated Products
exports.getTopRatedProducts = async (req, res) => {
  try {
    const topProducts = await Product.find()
      .sort({ rating: -1, numReviews: -1 })
      .limit(10);

    res.json({
      length: topProducts.length,
      data: topProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ Single Product by ID - Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Product - Admin Only
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let updatedImages = [...product.images];

    if (req.body.removeImages) {
      const toRemove = parseImagesInput(req.body.removeImages);

      for (const imgPath of toRemove) {
        updatedImages = updatedImages.filter((img) => img !== imgPath);
        await removeImageAsset(imgPath);
      }
    }

    const uploadedImageUrls = await uploadFilesToCloudinary(req.files);
    updatedImages.push(...uploadedImageUrls);

    if (req.body.newImageLinks) {
      const newLinks = parseImagesInput(req.body.newImageLinks);

      newLinks.forEach((link) => {
        if (link.startsWith("http")) updatedImages.push(link);
      });
    }

    const updateData = {
      ...req.body,
      images: updatedImages,
    };
    delete updateData.removeImages;
    delete updateData.newImageLinks;

    if (typeof updateData.sizes === "string")
      updateData.sizes = updateData.sizes.split(",");
    if (typeof updateData.colors === "string")
      updateData.colors = updateData.colors.split(",");

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ message: "Product updated successfully", data: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE Product - Admin Only
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const notFoundImages = [];
    const deletedImages = [];

    for (const img of product.images) {
      const result = await removeImageAsset(img);
      if (result?.deleted) {
        deletedImages.push(img);
      } else if (result?.notFound) {
        notFoundImages.push(img);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully",
      deletedImages,
      notFoundImages: notFoundImages.length > 0 ? notFoundImages : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
