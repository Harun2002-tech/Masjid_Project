const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Ayah', 'Hadith', 'Quote'], // 'Quote' (ጠቃሚ ምክር) ብንጨምርበት ይበልጥ አሪፍ ነው
    required: true 
  },
  arabic: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: [true, "የአማርኛ ትርጉም ያስፈልጋል"] 
  },
  reference: { 
    type: String, 
    required: [true, "ምንጩ መጥቀስ አለበት (ለምሳሌ፡ ቡኻሪ ወይም አል-በቀራህ 2:10)"] 
  },
  isActive: { // በየቀኑ የትኛው እንዲታይ ለመቆጣጠር
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// ✅ ስህተቱ እዚህ ጋር ተስተካክሏል (max ወደ model)
module.exports = mongoose.model('Message', messageSchema);