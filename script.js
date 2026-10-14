function openModal() { 
    document.getElementById("kadastr-modal").style.display = "flex"; 
    document.getElementById("modal-box").innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2 style="color: #0052cc; margin-bottom: 10px;">Tasdiqlash</h2>
        <p style="font-size: 13px; color: #555; margin-bottom: 15px;">Telegram botdan kelgan 4 xonali kodni va ID raqamingizni kiriting:</p>
        
        <input type="text" id="user-token-input" style="width: 90%; margin-bottom: 10px; text-align: center;" placeholder="Sizning ID (userToken)">
        <input type="text" id="tg-code-input" class="kadastr-input" style="text-align: center; letter-spacing: 3px;" placeholder="4 xonali kod">
        
        <button class="verify-btn" onclick="checkTelegramCode()">Tasdiqlash</button>
        <div id="modal-result" class="modal-result"></div>
    `; 
}

function closeModal() { document.getElementById("kadastr-modal").style.display = "none"; }

async function checkTelegramCode() { 
    let userToken = document.getElementById("user-token-input").value; 
    let code = document.getElementById("tg-code-input").value; 
    let res = document.getElementById("modal-result"); 
    
    if(!userToken || !code) return; 
    
    res.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Server tekshirmoqda..."; 
    
    try {
        // Render'dagi haqiqiy serveringizga so'rov yuborish
        let response = await fetch('https://uymakon.onrender.com/api/verify-tg-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userToken: userToken, code: code })
        });
        
        let data = await response.json();
        
        if(data.success) { 
            res.innerHTML = "<span class='success-text'><i class='fas fa-check-circle'></i> Muvaffaqiyatli tasdiqlandi!</span>"; 
            setTimeout(showAdForm, 1500); 
        } else { 
            res.innerHTML = "<span class='error-text'>Xato! Kod yoki ID noto'g'ri kiritildi.</span>"; 
        } 
    } catch (error) {
        res.innerHTML = "<span class='error-text'>Server bilan bog'lanib bo'lmadi!</span>";
    }
}