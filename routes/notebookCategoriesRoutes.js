const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const {
  getNotebookCategories,
  getNotebookCategoryById,
  createNotebookCategory,
  updateNotebookCategory,
  deleteNotebookCategory,
} = require("../controllers/notebookCategoriesControllers");

router.get("/", getNotebookCategories);
router.get("/:id", getNotebookCategoryById);

router.post("/", verifyToken, isAdmin, upload.single("image"), createNotebookCategory);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateNotebookCategory);
router.delete("/:id", verifyToken, isAdmin, deleteNotebookCategory);

module.exports = router;
