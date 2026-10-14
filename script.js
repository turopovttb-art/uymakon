function openModal() { 
            document.getElementById("kadastr-modal").style.display = "flex"; 
            document.getElementById("modal-box").innerHTML = `
                <span class="close-btn" onclick="closeModal()">&times;</span>
                <h2 style="color: #0052cc; margin-bottom: 10px;"><img src="https://id.egov.uz/logo.png" style="width: 24px; vertical-align: middle;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3064/3064197.png'"> OneID orqali kiring</h2>
                <p style="font-size: 13px; color: #555; margin-bottom: 15px;">Shaxsingiz va uyga egalik huquqini tasdiqlash uchun 14 xonali JShSHIR (PINFL) raqamingizni kiriting:</p>
                <input type="password" id="kadastr-input" class="kadastr-input" style="text-align: center; letter-spacing: 3px;" placeholder="14 xonali raqam">
                <button class="verify-btn" onclick="checkKadastr()">OneID orqali tasdiqlash</button>
                <div id="modal-result" class="modal-result"></div>
            `; 
        }
        
        function closeModal() { document.getElementById("kadastr-modal").style.display = "none"; }
        
        function checkKadastr() { 
            let val = document.getElementById("kadastr-input").value; 
            let res = document.getElementById("modal-result"); 
            if(!val) return; 
            res.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Davlat bazasi bilan bog'lanmoqda..."; 
            setTimeout(() => { 
                // Endi 12345 emas, 14 ta raqamli maxfiy kod: 12345678901234
                if(val === "12345678901234") { 
                    res.innerHTML = "<span class='success-text'><i class='fas fa-check-circle'></i> Uy o'zingizning nomingizda ekani tasdiqlandi!</span>"; 
                    setTimeout(showAdForm, 1500); 
                } else { 
                    res.innerHTML = "<span class='error-text'>Xato! 14 xonali JShSHIR noto'g'ri yoki uy sizning nomingizda emas.</span>"; 
                } 
            }, 1000); 
        }