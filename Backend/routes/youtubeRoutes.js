import express from 'express';
import axios from 'axios';
const router = express.Router();

/**
 * @route   GET /api/youtube/videos
 * @desc    ከዩቲዩብ ቻናል ላይ የቅርብ ቪዲዮዎችን ማምጣት
 * @access  Public
 */
router.get('/videos', async (req, res) => {
    try {
        // በ .env ፋይልህ ላይ ያሉትን ቁልፎች መፈለግ
        const apiKey = process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
        const channelId = process.env.VITE_YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID;
        
        if (!apiKey || !channelId) {
            return res.status(500).json({ 
                success: false, 
                message: "YouTube API Key ወይም Channel ID በ .env ፋይል ውስጥ አልተገኘም" 
            });
        }

        const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
        
        const response = await axios.get(url);
        
        res.status(200).json({
            success: true,
            data: response.data.items
        });
    } catch (error) {
        // ትክክለኛውን ስህተት በሰርቨር ተርሚናል ላይ ለማየት
        if (error.response) {
            console.error("YouTube Error Details:", error.response.data.error.message);
        } else {
            console.error("YouTube API Error:", error.message);
        }
        
        res.status(500).json({ 
            success: false, 
            message: "ከዩቲዩብ መረጃ ማምጣት አልተቻለም" 
        });
    }
});

export default router; // 👈 module.exports ሳይሆን ይሄን ተጠቀም