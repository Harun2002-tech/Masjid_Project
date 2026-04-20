const Message = require('../models/Message');

// 1. የዘፈቀደ መልዕክት ማምጣት (ለተማሪው ዳሽቦርድ)
// GET /api/messages/random
exports.getDailyMessage = async (req, res) => {
  try {
    // መጀመሪያ በዳታቤዙ ውስጥ ያሉትን መልዕክቶች ብዛት መቁጠር
    const count = await Message.countDocuments({ isActive: true });
    
    // ምንም መልዕክት ከሌለ ባዶ ዳታ ከመላክ ይልቅ Default መልዕክት እንልካለን
    if (count === 0) {
      return res.status(200).json({ 
        success: true, 
        data: {
          text: "እንኳን ደህና መጡ! እባክዎን መጀመሪያ መልዕክት በአድሚን ገጽ ይመዝግቡ።",
          arabic: "مرحباً بكم",
          reference: "System",
          type: "Quote"
        } 
      });
    }

    // ከዜሮ እስከ count ባለው ቁጥር ውስጥ አንዱን በዘፈቀደ መምረጥ
    const random = Math.floor(Math.random() * count);
    
    // .skip() በመጠቀም አንዱን መልዕክት መምረጥ
    const message = await Message.findOne({ isActive: true }).skip(random).lean();

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    console.error("Error in getDailyMessage:", err);
    res.status(500).json({ success: false, error: "የሰርቨር ስህተት ተፈጥሯል" });
  }
};

// 2. አዲስ መልዕክት መመዝገብ (ለአድሚን)
// POST /api/messages
exports.createMessage = async (req, res) => {
  try {
    const newMessage = await Message.create(req.body);
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 3. ሁሉንም መልዕክቶች ማምጣት (ለአድሚን Table)
// GET /api/messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ 
      success: true, 
      count: messages.length, 
      data: messages 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. አንድን መልዕክት በ ID ማግኘት
// GET /api/messages/:id
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).lean();
    if (!message) {
      return res.status(404).json({ success: false, message: "መልዕክቱ አልተገኘም" });
    }
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. መልዕክትን ማሻሻል (Update)
// PUT /api/messages/:id
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: "ሊታደስ የሚችል መልዕክት አልተገኘም" });
    }
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 6. መልዕክትን መሰረዝ (Delete)
// DELETE /api/messages/:id
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "ሊሰረዝ የሚችል መልዕክት አልተገኘም" });
    }
    res.status(200).json({ success: true, message: "መልዕክቱ በተሳካ ሁኔታ ተሰርዟል" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};