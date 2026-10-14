const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Rasmlar va ma'lumotlar hajmi uchun limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Sayt fayllari (index.html, rasmlar va h.k.) bitta havolada ochilishi uchun
app.use(express.static(__dirname));

const token = '8642292002:AAGjdmjoYVP0UKQWFhUNgo9DHqG3qfjBXFo';
const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
const ADMIN_CHAT_ID = '8418915058'; 

const verificationCodes = {};
let lastUpdateId = 0;

async function sendMessage(chatId, text) {
    try {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
    } catch (e) {
        console.error("Telegramga yuborish xatosi:", e.message);
    }
}

async function pollTelegram() {
    try {
        const response = await fetch(`${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                lastUpdateId = update.update_id;

                if (update.message && update.message.text) {
                    const chatId = update.message.chat.id;
                    const text = update.message.text.trim();

                    if (text.startsWith('/start')) {
                        const parts = text.split(' ');
                        const userToken = parts[1];

                        if (userToken) {
                            const code = Math.floor(1000 + Math.random() * 9000).toString();
                            verificationCodes[userToken] = code;

                            await sendMessage(chatId, `Assalomu alaykum! 🏠 UyMakon saytiga xush kelibsiz.\n\n🔑 Tasdiqlash kodingiz: <b>${code}</b>\n\nUshbu kodni saytdagi maydonga kiriting.`);
                        } else {
                            await sendMessage(chatId, "Iltimos, saytdagi 'Botga o'tish' tugmasi orqali kiring.");
                        }
                    }
                }
            }
        }
    } catch (e) {}

    setTimeout(pollTelegram, 1000);
}

pollTelegram();

// Kodni tekshirish
app.post('/api/verify-tg-code', (req, res) => {
    const { userToken, code } = req.body;

    if (verificationCodes[userToken] && verificationCodes[userToken] === code) {
        delete verificationCodes[userToken];
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Adminga bildirishnoma jo'natish
app.post('/api/notify-admin', async (req, res) => {
    const { type, data } = req.body;

    let msg = '';
    if (type === 'new_ad') {
        const mapLink = (data.lat && data.lng) ? `https://maps.google.com/?q=${data.lat},${data.lng}` : "Tanlanmagan";
        const urgentTag = data.isUrgent ? "🔥 <b>SHOSHILINCH (SROCHNO)</b>\n" : "";
        msg = `🏠 <b>YANGI E'LON MODERATSIYAGA KELDI!</b>\n\n` +
              urgentTag +
              `📍 <b>Manzil:</b> ${data.address}\n` +
              `💰 <b>Narxi:</b> ${data.price}\n` +
              `🚪 <b>Xonalar:</b> ${data.rooms} xona\n` +
              `🏷 <b>Turi:</b> ${data.category}\n` +
              `👤 <b>Aloqa:</b> ${data.telegram || "Ko'rsatilmagan"}\n` +
              `🖼 <b>Rasmlar soni:</b> ${data.photoCount} ta\n` +
              `🗺 <b>Lokatsiya:</b> ${mapLink}\n\n` +
              `<i>Admin panel orqali ushbu e'lonni tasdiqlashingiz mumkin.</i>`;
    } else if (type === 'report') {
        msg = `⚠️ <b>YANGI SHIKOYAT TUSHDI!</b>\n\n` +
              `👤 <b>Mijoz:</b> ${data.user}\n` +
              `📝 <b>Shikoyat sababi:</b> ${data.reason}`;
    }

    if (msg) {
        await sendMessage(ADMIN_CHAT_ID, msg);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
});

// Asosiy sahifani ochib berish
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server porti (Render yoki boshqa hosting o'z portini beradi, bo'lmasa 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 UyMakon Serveri ${PORT}-portda ishlamoqda...`);
});