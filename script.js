async function checkTelegramCode() { 
    let code = document.getElementById("tg-code-input").value; 
    let res = document.getElementById("modal-result"); 
    let autoUserToken = localStorage.getItem("userToken"); 
    
    if(!code) {
        res.innerHTML = "<span class='error-text'>Iltimos, kodni kiriting!</span>";
        return; 
    }
    
    res.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Tekshirilmoqda..."; 
    
    try {
        // To'liq va eng ishonchli manzil
        let response = await fetch('https://uymakon.onrender.com/api/verify-tg-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userToken: autoUserToken, code: code })
        });
        
        let data = await response.json();
        
        if(data.success) { 
            res.innerHTML = "<span class='success-text'><i class='fas fa-check-circle'></i> Muvaffaqiyatli tasdiqlandi!</span>"; 
            localStorage.removeItem("userToken"); 
            setTimeout(showAdForm, 1500); 
        } else { 
            res.innerHTML = "<span class='error-text'>Xato! Kod noto'g'ri kiritildi.</span>"; 
        } 
    } catch (error) {
        // AYNAN SHU YER O'ZGARDI: Umumiy "Server yo'q" emas, aniq xatoni ekranga chiqaradi
        res.innerHTML = `<span class='error-text'>Xato sababi: ${error.message}</span>`;
    }
}