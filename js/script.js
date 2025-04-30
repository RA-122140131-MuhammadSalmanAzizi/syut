document.addEventListener("DOMContentLoaded", () => {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainContainer = document.querySelector(".main-container");
    const celebration = document.getElementById("celebration");
    const announcementText = document.getElementById("announcement-text");
    const finalDetails = document.getElementById("final-details");
  
    // Simpan teks asli tombol "Nggak"
    const noBtnOriginalText = noBtn.innerText;
  
    // Fungsi mengganti teks tombol "Nggak"
    function changeNoButtonTextToEits() {
      noBtn.innerText = "Eits..";
      setTimeout(() => {
        noBtn.innerText = noBtnOriginalText;
      }, 800);
    }
  
    // Fungsi memindahkan posisi tombol "Nggak"
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
  
    // Cek apakah lokasi aman dari tombol "Mau"
    function isSafePosition(x, y, yesBtnRect) {
      const minDistance = 150;
      const dx = x - (yesBtnRect.left + yesBtnRect.width / 2);
      const dy = y - (yesBtnRect.top + yesBtnRect.height / 2);
      return Math.sqrt(dx * dx + dy * dy) > minDistance;
    }
  
    // Event listener untuk tombol "Nggak"
    noBtn.addEventListener("mouseenter", () => {
      changeNoButtonTextToEits();
      moveNoButton();
    });
  
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      changeNoButtonTextToEits();
      moveNoButton();
    });
  
    noBtn.addEventListener("click", moveNoButton);
  
    // Event klik tombol "Mau"
    yesBtn.addEventListener("click", () => {
      // Fade out kontainer awal
      gsap.to(mainContainer, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => {
          mainContainer.style.display = "none";
        },
      });
  
      // Aktifkan layar perayaan
      celebration.classList.add("active");
  
      // Buat love besar
      const bigLove = document.createElement("div");
      bigLove.className = "big-love";
      celebration.querySelector("#big-love").appendChild(bigLove);
  
      // Mainkan musik hanya jika di dalam event click langsung
      const music = document.getElementById("background-music");
      if (music) {
        const playPromise = music.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Autoplay ditolak oleh browser:", err);
          });
        }
  
        const muteBtn = document.getElementById("muteBtn");
        if (muteBtn) {
          muteBtn.classList.remove("hidden");
        }
      }
  
      // Animasi love besar muncul dan meledak
      gsap.to(bigLove, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        onComplete: () => {
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
  
    // Event listener untuk tombol mute/unmute
    const muteBtn = document.getElementById("muteBtn");
    const icon = muteBtn ? muteBtn.querySelector("i") : null;
    const music = document.getElementById("background-music");
  
    if (muteBtn && icon && music) {
      muteBtn.addEventListener("click", () => {
        if (music.volume > 0) {
          music.volume = 0;
          muteBtn.classList.add("muted");
          icon.classList.remove("fa-volume-up");
          icon.classList.add("fa-volume-mute");
        } else {
          music.volume = 1;
          muteBtn.classList.remove("muted");
          icon.classList.remove("fa-volume-mute");
          icon.classList.add("fa-volume-up");
        }
      });
    }
  });
