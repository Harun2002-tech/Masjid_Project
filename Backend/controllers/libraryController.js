import {
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  collections,
} from "../utils/firestore.js";

export const addBook = async (req, res) => {
  try {
    const { uploadedUrls, uploadedFiles, fileUrl, file, ...rest } = req.body;

    const finalUrl = fileUrl || rest.fileUrl || "";

    const book = await addDoc(collections.books, {
      ...rest,
      fileUrl: finalUrl,
      isSheikhBook: String(rest.isSheikhBook) === "true",
      downloadCount: 0,
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
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
    if (!existing) return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });

    const { uploadedUrls, uploadedFiles, fileUrl, file, ...cleanData } = req.body;
    const updates = {
      ...cleanData,
      fileUrl: fileUrl || cleanData.fileUrl || existing.fileUrl || "",
      isSheikhBook: cleanData.isSheikhBook !== undefined
        ? String(cleanData.isSheikhBook) === "true"
        : existing.isSheikhBook,
    };
    await setDoc(collections.books, req.params.id, updates);
    const book = await getDoc(collections.books, req.params.id);
    if (!book)
      return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await getDoc(collections.books, req.params.id);
    if (!book) return res.status(404).json({ message: "መጽሐፉ አልተገኘም" });
    await deleteDoc(collections.books, req.params.id);
    res.json({ success: true, message: "መጽሐፉ ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
