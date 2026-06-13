import axios from "axios";
import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const addMasjid = async (req, res) => {
  try {
    const { name } = req.body;

    let lat, lng;

    if (req.body.latitude != null && req.body.longitude != null) {
      lat = req.body.latitude;
      lng = req.body.longitude;
    } else if (req.body.location) {
      if (typeof req.body.location === "string") {
        try {
          const parsed = JSON.parse(req.body.location);
          lat = parsed.latitude;
          lng = parsed.longitude;
        } catch {
          lat = undefined;
          lng = undefined;
        }
      } else {
        lat = req.body.location.latitude;
        lng = req.body.location.longitude;
      }
    } else if (req.body["location.latitude"] != null || req.body["location[latitude]"] != null) {
      lat = req.body["location.latitude"] || req.body["location[latitude]"];
      lng = req.body["location.longitude"] || req.body["location[longitude]"];
    }

    if (!name || lat == null || lng == null) {
      return res.status(400).json({ success: false, message: "እባክዎ ስም፣ ላቲቲዩድ እና ሎንጊቲዩድ በትክክል ያስገቡ" });
    }

    const cleanMasjidData = {
      name,
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        city: req.body.city || "Kombolcha"
      },
      imageUrl: req.body.fileUrl || req.body.image || (req.file && (req.file.path || req.file.secure_url)) || "",
      createdAt: new Date().toISOString()
    };

    const masjid = await addDoc(collections.masjids, cleanMasjidData);
    res.status(201).json({ success: true, data: masjid });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const adjustTime = (timeStr, offsetMinutes) => {
  if (!timeStr || timeStr === "--:--") return "--:--";
  const [hours, minutes] = timeStr.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes + (offsetMinutes || 0);
  totalMinutes = (totalMinutes + 1440) % 1440;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const getAllMasjid = async (req, res) => {
  try {
    const masjids = await getDocs(collections.masjids, { orderBy: "createdAt", orderDir: "desc" });
    res.status(200).json({ success: true, count: masjids.length, data: masjids });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPrayerTimesById = async (req, res) => {
  try {
    const { id } = req.params;
    const masjid = await getDoc(collections.masjids, id);
    if (!masjid) return res.status(404).json({ success: false, message: "መስጂዱ አልተገኘም" });

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
      const azanTime = masjid.manualTimes?.[p] || apiTimings[p];
      prayerData[p] = {
        azan: azanTime,
        iqamah: adjustTime(azanTime, masjid.iqamahOffsets?.[p] || 0),
        waitMinutes: masjid.iqamahOffsets?.[p] || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        masjidName: masjid.name,
        timings: prayerData,
        manualTimes: masjid.manualTimes,
        date: response.data.data.date,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateMasjid = async (req, res) => {
  try {
    await setDoc(collections.masjids, req.params.id, req.body);
    const updated = await getDoc(collections.masjids, req.params.id);
    if (!updated) return res.status(404).json({ success: false, message: "መስጂዱ አልተገኘም" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteMasjid = async (req, res) => {
  try {
    await deleteDoc(collections.masjids, req.params.id);
    res.status(200).json({ success: true, message: "ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
