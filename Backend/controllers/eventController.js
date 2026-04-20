const Event = require("../models/Event");

// 1. አዲስ ዝግጅት መፍጠር (ለአድሚን)
exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "መመዝገብ አልተቻለም", error: error.message });
  }
};

// 2. ሁሉንም ዝግጅቶች ለማግኘት (ለተጠቃሚዎች እና ለአድሚን)
exports.getAllEvents = async (req, res) => {
  try {
    // የቀን ቅደም ተከተልን ጠብቆ (የቅርብ ጊዜውን በማስቀደም) ያመጣል
    const events = await Event.find().sort({ startDate: 1 }).lean();
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "መረጃ ማግኘት አልተቻለም",
        error: error.message,
      });
  }
};

// 3. አንድን ዝግጅት በ ID ለይቶ ማግኘት
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ success: false, message: "ዝግጅቱ አልተገኘም" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. ለዝግጅት ለመመዝገብ (የተስተካከለ የምዝገባ ሎጂክ)
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "ዝግጅቱ አልተገኘም" });
    }

    // ቦታ መኖሩን ማረጋገጥ
    if (event.currentAttendees >= event.maxAttendees) {
      return res
        .status(400)
        .json({ success: false, message: "ይቅርታ፣ ቦታው ሞልቷል!" });
    }

    // ተሳታፊውን መጨመር
    event.currentAttendees += 1;
    await event.save();

    res.status(200).json({
      success: true,
      message: "ለዝግጅቱ በተሳካ ሁኔታ ተመዝግበዋል! (ነፃ ዝግጅት)",
      remainingSeats: event.maxAttendees - event.currentAttendees,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "የምዝገባ ስህተት", error: error.message });
  }
};

// 5. ዝግጅትን ለማሻሻል (ለአድሚን)
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "ዝግጅቱ አልተገኘም" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 6. ዝግጅትን ለመሰረዝ (ለአድሚን)
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: "ዝግጅቱ አልተገኘም" });
    }
    res.status(200).json({ success: true, message: "ዝግጅቱ በተሳካ ሁኔታ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
