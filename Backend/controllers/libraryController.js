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
    const { title, author, category, description, isSheikhBook, fileUrl, file } = req.body;

    let finalUrl = fileUrl || "";

    if (!finalUrl && typeof file === "string") {
      finalUrl = file;
    }

    if (!finalUrl && req.body.uploadedUrls && req.body.uploadedUrls.file) {
      finalUrl = req.body.uploadedUrls.file;
    }

    console.log("[libraryController] Destructured:", { title, author, category, fileUrl, file: typeof file === "string" ? file.substring(0, 60) : file, isSheikhBook });
    console.log("[libraryController] Final URL:", finalUrl);

    if (!finalUrl) {
      console.log("[libraryController] No file URL — saving without file. req.body keys:", Object.keys(req.body));
    }

    const book = await addDoc(collections.books, {
      title,
      author,
      category,
      description,
      fileUrl: finalUrl || "",
      isSheikhBook: String(isSheikhBook) === "true",
      downloadCount: 0,
      createdAt: new Date().toISOString(),
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
    const updates = { ...req.body };
    if (req.body.isSheikhBook !== undefined) {
      updates.isSheikhBook = String(req.body.isSheikhBook) === "true";
    }
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
