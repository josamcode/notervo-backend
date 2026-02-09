const NotebookCategory = require("../models/NotebookCategory");
const {
  uploadImageBuffer,
  deleteCloudinaryImageByUrl,
} = require("../config/cloudinary");

const NOTEBOOK_CATEGORY_CLOUDINARY_FOLDER = "notervo/notebook-categories";

function normalizeCategoryKey(rawValue = "") {
  return String(rawValue)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function buildPayload(body = {}) {
  const payload = {};

  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.description !== undefined) {
    payload.description = String(body.description).trim();
  }
  if (body.categoryKey !== undefined) {
    payload.categoryKey = normalizeCategoryKey(body.categoryKey);
  }
  if (body.sortOrder !== undefined && body.sortOrder !== "") {
    payload.sortOrder = Number(body.sortOrder);
  }
  if (body.isActive !== undefined) {
    payload.isActive =
      body.isActive === true ||
      body.isActive === "true" ||
      body.isActive === 1 ||
      body.isActive === "1";
  }

  return payload;
}

async function uploadCategoryImage(file) {
  if (!file?.buffer) {
    return null;
  }

  const result = await uploadImageBuffer(file.buffer, {
    folder: NOTEBOOK_CATEGORY_CLOUDINARY_FOLDER,
  });

  return result?.secure_url || null;
}

exports.getNotebookCategories = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const filter = includeInactive ? {} : { isActive: true };

    const categories = await NotebookCategory.find(filter).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    res.json({
      length: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notebook categories" });
  }
};

exports.getNotebookCategoryById = async (req, res) => {
  try {
    const category = await NotebookCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Notebook category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notebook category" });
  }
};

exports.createNotebookCategory = async (req, res) => {
  try {
    const payload = buildPayload(req.body);
    const uploadedImageUrl = await uploadCategoryImage(req.file);
    if (uploadedImageUrl) {
      payload.imageUrl = uploadedImageUrl;
    }

    if (!payload.title || !payload.categoryKey || !payload.imageUrl) {
      return res.status(400).json({
        message: "title, categoryKey and image are required",
      });
    }

    const created = await NotebookCategory.create(payload);
    res.status(201).json(created);
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "categoryKey already exists. Use a unique value." });
    }

    res.status(400).json({
      message: error?.message || "Failed to create notebook category",
    });
  }
};

exports.updateNotebookCategory = async (req, res) => {
  try {
    const payload = buildPayload(req.body);
    const currentCategory = await NotebookCategory.findById(req.params.id);

    if (!currentCategory) {
      return res.status(404).json({ message: "Notebook category not found" });
    }

    const uploadedImageUrl = await uploadCategoryImage(req.file);
    if (uploadedImageUrl) {
      payload.imageUrl = uploadedImageUrl;
    }

    const updated = await NotebookCategory.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (uploadedImageUrl && currentCategory.imageUrl) {
      await deleteCloudinaryImageByUrl(currentCategory.imageUrl);
    }

    res.json(updated);
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "categoryKey already exists. Use a unique value." });
    }

    res.status(400).json({
      message: error?.message || "Failed to update notebook category",
    });
  }
};

exports.deleteNotebookCategory = async (req, res) => {
  try {
    const deleted = await NotebookCategory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Notebook category not found" });
    }

    if (deleted.imageUrl) {
      await deleteCloudinaryImageByUrl(deleted.imageUrl);
    }

    res.json({ message: "Notebook category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notebook category" });
  }
};
