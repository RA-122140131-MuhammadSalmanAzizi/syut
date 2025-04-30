document.addEventListener("DOMContentLoaded", () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const music = document.getElementById('background-music');
  const iosOverlay = document.getElementById('ios-audio-overlay');
  let audioInitialized = false;

  // iOS Audio Initialization
  if (isIOS) {
    const initAudio = () => {
      music.volume = 0.01;
      music.play()
        .then(() => {
          music.pause();
          music.currentTime = 0;
          music.volume = 1;
          audioInitialized = true;
          iosOverlay.classList.add('hidden');
        })
        .catch(() => {
          iosOverlay.classList.remove('hidden');
        });
    };

    document.body.addEventListener('touchstart', function firstTouch() {
      document.body.removeEventListener('touchstart', firstTouch);
      initAudio();
    }, { once: true });

    iosOverlay.addEventListener('touchstart', initAudio);
    iosOverlay.classList.remove('hidden');
  }

  // Button Logic
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const muteBtn = document.getElementById("muteBtn");
  const noBtnOriginalText = noBtn.innerText;

  // No Button Behavior
  noBtn.addEventListener('mouseenter', handleNoButton);
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleNoButton();
  });
  noBtn.addEventListener('click', handleNoButton);

  function handleNoButton() {
    noBtn.innerText = "Eits..";
    setTimeout(() => {
      noBtn.innerText = noBtnOriginalText;
    }, 800);
    moveButton();
  }

  function moveButton() {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    let newX, newY;
    do {
      newX = Math.random() * (window.innerWidth - 150);
      newY = Math.random() * (window.innerHeight - 60);
    } while (Math.abs(newX - yesBtnRect.x) < 150);
    
    gsap.to(noBtn, {
      x: newX - noBtn.offsetLeft,
      y: newY - noBtn.offsetTop,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  // Yes Button Logic
  yesBtn.addEventListener('click', () => {
    gsap.to(".main-container", {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      onComplete: () => {
        document.querySelector(".main-container").style.display = "none";
      }
    });

    document.getElementById("celebration").classList.add("active");
    startCelebration();
  });

  function startCelebration() {
    // Music Handling
    const handleMusic = () => {
      if (isIOS && !audioInitialized) {
        iosOverlay.classList.remove('hidden');
        return;
      }
      
      music.volume = 0.7;
      music.play().catch(() => {
        if (isIOS) iosOverlay.classList.remove('hidden');
      });
      muteBtn.classList.remove('hidden');
    };

    isIOS ? handleMusic() : setTimeout(handleMusic, 300);

    // Celebration Animations
    const bigLove = document.createElement('div');
    bigLove.className = 'big-love';
    document.getElementById('big-love').appendChild(bigLove);

    gsap.to(bigLove, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
      onComplete: createHearts
    });
  }

  // Mute Button Logic
  muteBtn.addEventListener('click', () => {
    if (isIOS) {
      music.volume = music.volume > 0 ? 0 : 1;
      muteBtn.innerHTML = music.volume > 0 ? 
        '<i class="fas fa-volume-up"></i>' : 
        '<i class="fas fa-volume-mute"></i>';
      if (music.volume > 0) music.play();
    } else {
      music.muted = !music.muted;
      muteBtn.innerHTML = music.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
    }
  });

  // Handle Tab Visibility Changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && music.paused && isIOS) {
      music.play().catch(() => {
        iosOverlay.classList.remove('hidden');
      });
    }
  });

  // Heart Animation Functions
  function createHearts() {
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.className = 'small-love';
      heart.style.left = `${50 + Math.random() * 10}%`;
      heart.style.top = `${50 + Math.random() * 10}%`;
      document.getElementById('love-container').appendChild(heart);
      
      gsap.to(heart, {
        x: Math.cos(Math.random() * Math.PI * 2) * 200,
        y: Math.sin(Math.random() * Math.PI * 2) * 200,
        opacity: 0.8,
        scale: 1.2,
        duration: 1 + Math.random(),
        onComplete: () => heart.remove()
      });
    }

    gsap.to("#announcement-text", {
      opacity: 1,
      delay: 0.5,
      duration: 1
    });

    gsap.to("#final-details", {
      opacity: 1,
      delay: 1.5,
      duration: 1
    });
  }
});
