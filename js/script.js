document.addEventListener("DOMContentLoaded", () => {
    // Deteksi iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const audioPrompt = document.getElementById('ios-audio-prompt');
    const music = document.getElementById('background-music');
    let audioEnabled = false;
  
    // Elemen UI
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainContainer = document.querySelector(".main-container");
    const celebration = document.getElementById("celebration");
    const announcementText = document.getElementById("announcement-text");
    const finalDetails = document.getElementById("final-details");
    const muteBtn = document.getElementById("muteBtn");
    const noBtnOriginalText = noBtn.innerText;
  
    // 1. Inisialisasi Audio untuk iOS
    if (isIOS) {
      // Memuat audio terlebih dahulu
      music.load();
      music.volume = 0;
      
      // Tampilkan prompt audio
      audioPrompt.classList.remove('hidden');
      
      // Aktifkan audio saat layar disentuh
      const enableAudio = () => {
        if (!audioEnabled) {
          music.volume = 1;
          music.play().then(() => {
            audioEnabled = true;
            audioPrompt.classList.add('hidden');
            muteBtn.classList.remove('hidden');
          }).catch(e => {
            console.log("Audio activation failed:", e);
            audioPrompt.querySelector('p').textContent = 'Tap to unmute - then tap here';
          });
        }
      };
      
      document.addEventListener('touchstart', enableAudio, { once: true });
    } else {
      // Untuk non-iOS, langsung aktifkan audio
      music.volume = 1;
      audioEnabled = true;
    }
  
    // 2. Fungsi untuk tombol "Nggak"
    function changeNoButtonTextToEits() {
      noBtn.innerText = "Eits..";
      setTimeout(() => {
        noBtn.innerText = noBtnOriginalText;
      }, 800);
    }
  
    function moveNoButton() {
      const yesBtnRect = yesBtn.getBoundingClientRect();
      let newX, newY;
      do {
        newX = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        newY = Math.random() * (window.innerHeight - noBtn.offsetHeight);
      } while (!isSafePosition(newX, newY, yesBtnRect));
      
      gsap.to(noBtn, {
        x: newX - noBtn.offsetLeft,
        y: newY - noBtn.offsetTop,
        duration: 0.1,
        ease: "power2.out",
      });
    }
  
    function isSafePosition(x, y, yesBtnRect) {
      const minDistance = 150;
      const dx = x - (yesBtnRect.left + yesBtnRect.width / 2);
      const dy = y - (yesBtnRect.top + yesBtnRect.height / 2);
      return Math.sqrt(dx * dx + dy * dy) > minDistance;
    }
  
    // Event listeners untuk tombol "Nggak"
    noBtn.addEventListener("mouseenter", () => {
      changeNoButtonTextToEits();
      moveNoButton();
    });
  
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      changeNoButtonTextToEits();
      moveNoButton();
    });
  
    noBtn.addEventListener("click", () => {
      changeNoButtonTextToEits();
      moveNoButton();
    });
  
    // 3. Fungsi untuk tombol "Mau"
    yesBtn.addEventListener("click", () => {
      // Animasi hilangkan kontainer utama
      gsap.to(mainContainer, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => {
          mainContainer.style.display = "none";
        },
      });
  
      // Tampilkan perayaan
      celebration.classList.add("active");
  
      // Buat animasi love
      const bigLove = document.createElement("div");
      bigLove.className = "big-love";
      celebration.querySelector("#big-love").appendChild(bigLove);
  
      // 4. Handle audio untuk semua platform
      const handleAudio = () => {
        if (audioEnabled) {
          music.currentTime = 0;
          music.play().catch(e => console.log("Play error:", e));
        } else if (isIOS) {
          audioPrompt.classList.remove('hidden');
          audioPrompt.querySelector('p').textContent = 'Tap anywhere to enable sound';
        }
        
        // Tampilkan tombol mute
        muteBtn.classList.remove("hidden");
      };
  
      // Untuk iOS, tunggu interaksi pengguna
      if (isIOS && !audioEnabled) {
        const enableOnTap = () => {
          document.removeEventListener('touchstart', enableOnTap);
          music.volume = 1;
          music.play().then(() => {
            audioEnabled = true;
            audioPrompt.classList.add('hidden');
          }).catch(e => {
            console.log("Audio play failed:", e);
          });
        };
        document.addEventListener('touchstart', enableOnTap);
      } else {
        // Untuk non-iOS atau iOS yang sudah diaktifkan
        handleAudio();
      }
  
      // Animasi love
      gsap.to(bigLove, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        onComplete: () => {
          // Buat pecahan love kecil
          for (let i = 0; i < 20; i++) {
            const smallLove = document.createElement("div");
            smallLove.className = "small-love";
            smallLove.style.left = `${50 + Math.random() * 10}%`;
            smallLove.style.top = `${50 + Math.random() * 10}%`;
            celebration.querySelector("#love-container").appendChild(smallLove);
            
            const angle = Math.random() * 2 * Math.PI;
            const distance = 100 + Math.random() * 150;
            const speed = 1 + Math.random() * 1;
            
            gsap.to(smallLove, {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 1.2,
              opacity: 0.8,
              duration: speed,
              ease: "power2.out",
              onComplete: () => smallLove.remove(),
            });
          }
  
          setTimeout(() => {
            bigLove.remove();
            announcementText.classList.add("show");
  
            setTimeout(() => {
              gsap.to(finalDetails, {
                opacity: 1,
                duration: 0.6,
                delay: 0.2,
              });
            }, 1000);
          }, 1000);
        },
      });
    });
  
    // 5. Fungsi mute/unmute yang kompatibel dengan iOS
    muteBtn.addEventListener("click", function() {
      if (!audioEnabled && isIOS) {
        // Kasus khusus untuk iOS yang belum mengaktifkan audio
        music.volume = 1;
        music.play().then(() => {
          audioEnabled = true;
          this.classList.remove("muted");
          const icon = this.querySelector("i");
          icon.classList.remove("fa-volume-mute");
          icon.classList.add("fa-volume-up");
          audioPrompt.classList.add('hidden');
        }).catch(e => {
          console.log("Unmute failed:", e);
          audioPrompt.classList.remove('hidden');
          audioPrompt.querySelector('p').textContent = 'Tap screen to enable sound';
        });
        return;
      }
  
      // Normal mute/unmute functionality
      const icon = this.querySelector("i");
      if (music.volume > 0) {
        music.volume = 0;
        this.classList.add("muted");
        icon.classList.remove("fa-volume-up");
        icon.classList.add("fa-volume-mute");
      } else {
        music.volume = 1;
        this.classList.remove("muted");
        icon.classList.remove("fa-volume-mute");
        icon.classList.add("fa-volume-up");
        // Untuk iOS, pastikan audio diputar kembali
        if (isIOS) {
          music.play().catch(e => console.log("Play on unmute failed:", e));
        }
      }
    });
  
    // Tambahkan touch support untuk mute button
    muteBtn.addEventListener("touchstart", function(e) {
      e.preventDefault();
      this.click();
    });
  });
