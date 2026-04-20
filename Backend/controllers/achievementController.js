const Achievement = require('../models/Achievement');

// ሁሉንም የተማሪውን ስኬቶች የሚያመጣ
exports.getMyAchievements = async (req, res) => {
    try {
        // req.user.id የሚመጣው ከ Auth middleware ነው
        const achievements = await Achievement.find({ user: req.user.id })
            .sort({ earnedAt: -1 }); // በአዲሱ ቅደም ተከተል

        res.status(200).json({
            success: true,
            count: achievements.length,
            data: achievements
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "ስኬቶችን በመጫን ላይ ስህተት ተፈጥሯል", 
            error: error.message 
        });
    }
};

// አዲስ ስኬት የሚጨምር (ለአስተዳዳሪዎች ወይም ለሲስተሙ)
exports.createAchievement = async (req, res) => {
    try {
        const newAchievement = await Achievement.create(req.body);
        res.status(201).json({ success: true, data: newAchievement });
    } catch (error) {
        res.status(400).json({ success: false, message: "ስኬትን መመዝገብ አልተቻለም" });
    }
};