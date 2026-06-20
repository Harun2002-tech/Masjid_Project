import {
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  collections,
} from "../utils/firestore.js";

/**
 * Add a new book with file upload to Firestore
 * File URL is stored as Cloudinary URL (fileUrl field)
 * @route POST /api/library
 */
export const addBook = async (req, res) => {
  try {
    const { uploadedUrls, uploadedFiles, fileUrl, file, ...rest } = req.body;

    // fileUrl comes from uploadToStorage() → Cloudinary secure_url
    const finalUrl = fileUrl || rest.fileUrl || "";

    const book = await addDoc(collections.books, {
      ...rest,
      fileUrl: finalUrl,
      isSheikhBook: String(rest.isSheikhBook) === "true",
      downloadCount: 0,
      uploadedAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    console.error("Error adding book:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getBooks = async (req, res) => {
  try {
    const books = await getDocs(collections.books, {
      orderBy: "createdAt",
      orderDir: "desc",
    });
    res.json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: "መረጃ ማግኘት አልተቻለም" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await getDoc(collections.books, req.params.id);
    if (!book)
      return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const existing = await getDoc(collections.books, req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    }

    const { uploadedUrls, uploadedFiles, fileUrl, file, ...cleanData } = req.body;

    const newFileUrl = fileUrl || cleanData.fileUrl || existing.fileUrl || "";

    const updates = {
      ...cleanData,
      fileUrl: newFileUrl,
      isSheikhBook: cleanData.isSheikhBook !== undefined
        ? String(cleanData.isSheikhBook) === "true"
        : existing.isSheikhBook,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(collections.books, req.params.id, updates);
    const book = await getDoc(collections.books, req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    console.error("Error updating book:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await getDoc(collections.books, req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    }

    await deleteDoc(collections.books, req.params.id);
    res.json({ success: true, message: "መጽሐፉ ተሰርዟል" });
  } catch (err) {
    console.error("Error deleting book:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
