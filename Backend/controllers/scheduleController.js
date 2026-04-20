const Schedule = require("../models/Schedule");

// 1. ሁሉንም ፕሮግራሞች ማምጣት
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ createdAt: -1 });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "መረጃውን ማምጣት አልተቻለም", error: error.message });
  }
};

// 2. አንድን ፕሮግራም በ ID ለይቶ ማምጣት (አዲስ የተጨመረ)
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "ፕሮግራሙ አልተገኘም" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "መረጃውን ማምጣት አልተቻለም", error: error.message });
  }
};

// 3. አዲስ ፕሮግራም መመዝገብ
exports.createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ message: "መመዝገብ አልተቻለም", error: error.message });
  }
};

// 4. ፕሮግራም ማሻሻል (አዲስ የተጨመረ)
exports.updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: "ሊታደስ የሚገባው ፕሮግራም አልተገኘም" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: "ማሻሻል አልተቻለም", error: error.message });
  }
};

// 5. ፕሮግራም መሰረዝ
exports.deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: "ሊሰረዝ የሚገባው ፕሮግራም አልተገኘም" });
    }
    res.status(200).json({ message: "በተሳካ ሁኔታ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ message: "መሰረዝ አልተቻለም", error: error.message });
  }
};