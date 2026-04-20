const axios = require("axios");
const Masjid = require("../models/Masjid");
// 5. አዲስ መስጂድ መመዝገብ (Create)
exports.addMasjid = async (req, res) => {
  try {
    // location (lat/long) እና ስም መኖሩን እናረጋግጥ
    const { name, location } = req.body;
    if (!name || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({
        success: false,
        message: "እባክዎ የመስጂዱን ስም እና ትክክለኛ የሎኬሽን መረጃ ያስገቡ",
      });
    }

    const masjid = await Masjid.create(req.body);
    res.status(201).json({ success: true, data: masjid });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// ሰዓትን በደቂቃ ለማስተካከል (Midnight safety ጨምሮ)
const adjustTime = (timeStr, offsetMinutes) => {
  if (!timeStr || timeStr === "--:--") return "--:--";
  const [hours, minutes] = timeStr.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes + (offsetMinutes || 0);
  totalMinutes = (totalMinutes + 1440) % 1440;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// 1. ሁሉንም መስጂዶች ማምጣት
exports.getAllMasjid = async (req, res) => {
  try {
    const masjids = await Masjid.find().sort({ createdAt: -1 }).lean();
    res
      .status(200)
      .json({ success: true, count: masjids.length, data: masjids });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
/**
 * አንድን መስጂድ በ ID ለይቶ የሶላት ሰዓቶቹን ማምጣት
 */
// በ controller ፋይልህ ውስጥ getPrayerTimesById ን በዚህ ተካው፡
exports.getPrayerTimesById = async (req, res) => {
  try {
    const { id } = req.params;
    const masjid = await Masjid.findById(id).lean();

    if (!masjid) {
      return res.status(404).json({ success: false, message: "መስጂዱ አልተገኘም" });
    }

    // ከ Aladhan API ዳታውን እናመጣለን (ለቀን እና ለሂጅሪ መረጃ)
    const response = await axios.get("https://api.aladhan.com/v1/timings", {
      params: {
        latitude: masjid.location.latitude,
        longitude: masjid.location.longitude,
        method: masjid.settings?.method || 5,
        school: masjid.settings?.school || 0,
      },
    });

    const apiTimings = response.data.data.timings;
    const prayerData = {};
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    prayers.forEach((p) => {
      // 🌟 ዋናው ማስተካከያ እዚህ ጋር ነው፡
      // አድሚኑ የሞላው ሰዓት (manualTimes) ካለ እሱን ይጠቀማል፣ ካልሌለ ከ API የመጣውን ይወስዳል
      const azanTime =
        masjid.manualTimes && masjid.manualTimes[p]
          ? masjid.manualTimes[p]
          : apiTimings[p];

      const iqamahTime = adjustTime(azanTime, masjid.iqamahOffsets?.[p] || 0);

      prayerData[p] = {
        azan: azanTime,
        iqamah: iqamahTime,
        waitMinutes: masjid.iqamahOffsets?.[p] || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        masjidName: masjid.name,
        timings: prayerData, // አሁን የተስተካከለው ሰዓት እዚህ ይላካል
        manualTimes: masjid.manualTimes,
        date: response.data.data.date,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// 2. የጸሎት ሰዓቶችን ከ API አምጥቶ ማቀናጀት
exports.getPrayerTimes = async (req, res) => {
  try {
    const { masjidId } = req.params;
    const masjid = await Masjid.findById(masjidId).lean();
    if (!masjid)
      return res.status(404).json({ success: false, message: "መስጂዱ አልተገኘም" });

    const response = await axios.get("https://api.aladhan.com/v1/timings", {
      params: {
        latitude: masjid.location.latitude,
        longitude: masjid.location.longitude,
        method: masjid.settings?.method || 5,
        school: masjid.settings?.school || 0,
      },
    });

    const raw = response.data.data.timings;
    const prayerData = {};
    ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach((p) => {
      const azanTime = adjustTime(raw[p], masjid.offsets?.[p] || 0);
      const iqamahTime = adjustTime(azanTime, masjid.iqamahOffsets?.[p] || 0);
      prayerData[p] = {
        azan: azanTime,
        iqamah: iqamahTime,
        waitMinutes: masjid.iqamahOffsets?.[p] || 0,
      };
    });

    res.json({
      success: true,
      data: {
        masjidName: masjid.name,
        timings: prayerData,
        date: response.data.data.date,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. መረጃ ማዘመን
exports.updateMasjid = async (req, res) => {
  try {
    const updatedMasjid = await Masjid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMasjid)
      return res.status(404).json({ success: false, message: "መስጂዱ አልተገኘም" });
    res.status(200).json({ success: true, data: updatedMasjid });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// 4. መሰረዝ
exports.deleteMasjid = async (req, res) => {
  try {
    const deleted = await Masjid.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "አልተገኘም" });
    res.status(200).json({ success: true, message: "ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
