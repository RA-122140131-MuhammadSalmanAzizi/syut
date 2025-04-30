document.addEventListener("DOMContentLoaded", () => {
    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // iOS audio message element
    const iosAudioMessage = document.getElementById('ios-audio-message');
    
    // Enable audio on iOS with a tap
    if (isIOS) {
      document.addEventListener('touchstart', function enableAudio() {
        document.removeEventListener('touchstart', enableAudio);
        const music = document.getElementById('background-music');
        music.load();
        music.play().then(() => {
          music.pause();
          music.currentTime = 0;
        }).catch(e => console.log('Audio init error:', e));
        iosAudioMessage.classList.add('hidden');
      }, { once: true });
      
      iosAudioMessage.classList.remove('hidden');
    }
  
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainContainer = document.querySelector(".main-container");
    const celebration = document.getElementById("celebration");
    const announcementText = document.getElementById("announcement-text");
    const finalDetails = document.getElementById("final-details");
    const noBtnOriginalText = noBtn.innerText;
  
    // Fungsi mengganti teks tombol "Nggak" menjadi "Eits.."
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
  
    // Event listeners for "Nggak" button
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
  
    yesBtn.addEventListener("click", () => {
      gsap.to(mainContainer, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => {
          mainContainer.style.display = "none";
        },
      });
  
      celebration.classList.add("active");
  
      const bigLove = document.createElement("div");
      bigLove.className = "big-love";
      celebration.querySelector("#big-love").appendChild(bigLove);
  
      const music = document.getElementById("background-music");
      if (music) {
        const playAudio = () => {
          music.volume = 0.7;
          music.play().catch(err => {
            console.log("Audio play failed:", err);
            if (isIOS) {
              iosAudioMessage.classList.remove('hidden');
              iosAudioMessage.textContent = 'Tap to enable sound';
            }
          });
        };
        
        if (isIOS) {
          playAudio();
        } else {
          setTimeout(playAudio, 300);
        }
  
        const muteBtn = document.getElementById("muteBtn");
        if (muteBtn) {
          muteBtn.classList.remove("hidden");
        }
      }
  
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
  
    const muteBtn = document.getElementById("muteBtn");
    if (muteBtn) {
      muteBtn.addEventListener("click", function() {
        const icon = this.querySelector("i");
        const music = document.getElementById("background-music");
        
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
          if (isIOS) {
            music.play().catch(e => console.log('Unmute play failed:', e));
          }
        }
      });
      
      muteBtn.addEventListener("touchstart", function(e) {
        e.preventDefault();
        this.click();
      });
    }
    
    if (isIOS) {
      document.addEventListener('touchstart', function handleAudioEnable() {
        const music = document.getElementById('background-music');
        if (music.paused && music.volume === 0) {
          music.volume = 1;
          music.play().catch(e => console.log('Audio play on tap failed:', e));
          iosAudioMessage.classList.add('hidden');
        }
      });
    }
  });
