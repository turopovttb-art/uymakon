function openModal() { 
    // ID ni telefon xotirasidan qidiramiz, yo'q bo'lsa yangi yaratamiz
    let autoUserToken = localStorage.getItem("userToken");
    if (!autoUserToken) {
        autoUserToken = Math.floor(10000 + Math.random() * 90000).toString();
        localStorage.setItem("userToken", autoUserToken);
    }
    
    let telegramLink = `https://t.me/uymakon_auth_bot?start=${autoUserToken}`;

    document.getElementById("kadastr-modal").style.display = "flex"; 
    document.getElementById("modal-box").innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2 style="color: #0052cc; margin-bottom: 10px;">Tasdiqlash</h2>
        <p style="font-size: 13px; color: #555; margin-bottom: 15px;">Kodni olish uchun quyidagi tugma orqali botga kiring:</p>
        
        <a href="${telegramLink}" target="_blank" style="display: block; background: #0088cc; color: white; padding: 12px; text-decoration: none; border-radius: 5px; margin-bottom: 15px; font-weight: bold; font-size: 14px; text-align: center;">
            Telegramdan kod olish
        </a>
        
        <p style="font-size: 12px; color: #777; margin-bottom: 5px;">Bot bergan 4 xonali kodni yozing:</p>
        <input type="text" id="tg-code-input" class="kadastr-input" style="text-align: center; letter-spacing: 3px; font-size: 18px;" placeholder="****">
        
        <button class="verify-btn" onclick="checkTelegramCode()" style="margin-top: 15px; width: 100%;">Tasdiqlash</button>
        <div id="modal-result" class="modal-result" style="margin-top: 10px;"></div>
    `; 
}

function closeModal() { 
    document.getElementById("kadastr-modal").style.display = "none"; 
}

async function checkTelegramCode() { 
    let code = document.getElementById("tg-code-input").value; 
    let res = document.getElementById("modal-result"); 
    let autoUserToken = localStorage.getItem("userToken"); // Xotiradan ID ni olamiz
    
    if(!code) {
        res.innerHTML = "<span class='error-text'>Iltimos, kodni kiriting!</span>";
        return; 
    }
    
    res.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Tekshirilmoqda..."; 
    
    try {
        let response = await fetch('/api/verify-tg-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userToken: autoUserToken, code: code })
        });
        
        let data = await response.json();
        
        if(data.success) { 
            res.innerHTML = "<span class='success-text'><i class='fas fa-check-circle'></i> Muvaffaqiyatli tasdiqlandi!</span>"; 
            localStorage.removeItem("userToken"); // Ish bitgach, xotirani tozalaymiz
            setTimeout(showAdForm, 1500); 
        } else { 
            res.innerHTML = "<span class='error-text'>Xato! Kod noto'g'ri.</span>"; 
        } 
    } catch (error) {
        res.innerHTML = "<span class='error-text'>Server bilan bog'lanib bo'lmadi! Qayta urinib ko'ring.</span>";
    }
}