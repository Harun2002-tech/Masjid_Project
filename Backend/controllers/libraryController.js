const Book = require("../models/Book");
const fs = require('fs');
const path = require('path');

// 1. አዲስ መጽሐፍ ለመመዝገብ (Create)
exports.addBook = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "ፋይል አልተመረጠም!" });

    const { title, author, category, description, isSheikhBook } = req.body;
    
    // በሰርቨሩ ላይ የተቀመጠበትን መንገድ (URL) ማግኘት
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/books/${req.file.filename}`;

    const book = await Book.create({
      title,
      author,
      category,
      description,
      fileUrl,
      // String ሆኖ የሚመጣውን ወደ Boolean መቀየር (Multer መረጃውን በ String ስለሚልክ)
      isSheikhBook: String(isSheikhBook) === "true"
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    // ስህተት ከተፈጠረና ፋይሉ ተሰቅሎ ከሆነ መልሰን እናጥፋው
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. ሁሉንም መጽሐፍት ለማምጣት (Get All)
exports.getBooks = async (req, res) => {
  try {
    // የሼኩንና ሌሎችንም በአንድ ላይ አዳዲሶቹ ከላይ እንዲሆኑ አድርጎ ያመጣል
    const books = await Book.find().sort("-uploadedAt").lean();
    res.json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: "መረጃ ማግኘት አልተቻለም" });
  }
};

// 3. መጽሐፍ በ ID ለይቶ ማምጣት (Get by ID)
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. መጽሐፍ ለማሻሻል (Update)
exports.updateBook = async (req, res) => {
  try {
    const { title, author, category, description, isSheikhBook } = req.body;
    const updates = { title, author, category, description };

    if (isSheikhBook !== undefined) {
      updates.isSheikhBook = String(isSheikhBook) === "true";
    }

    const book = await Book.findByIdAndUpdate(req.params.id, updates, { 
      new: true, 
      runValidators: true 
    });

    if (!book) return res.status(404).json({ success: false, message: "መጽሐፉ አልተገኘም" });
    res.json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 5. መጽሐፍ ለመሰረዝ (Delete)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "መጽሐፉ አልተገኘም" });

    // ፋይሉን ከፎልደር ውስጥ መፈለግና መሰረዝ
    const filename = book.fileUrl.split('/').pop();
    const filePath = path.join(__dirname, '../uploads/books', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "መጽሐፉ እና ፋይሉ በትክክል ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};