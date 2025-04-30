document.addEventListener("DOMContentLoaded", () => {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const mainContainer = document.querySelector(".main-container");
    const celebration = document.getElementById("celebration");
    const announcementText = document.getElementById("announcement-text");
    const finalDetails = document.getElementById("final-details");
    const muteBtn = document.getElementById("muteBtn");
    const backgroundMusic = document.getElementById("backgroundMusic");

    // Simpan teks asli tombol "Nggak"
    const noBtnOriginalText = noBtn.innerText;

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
            ease: "power2.out"
        });
    }

    function isSafePosition(x, y, yesBtnRect) {
        const minDistance = 150;
        const dx = x - (yesBtnRect.left + yesBtnRect.width / 2);
        const dy = y - (yesBtnRect.top + yesBtnRect.height / 2);
        return Math.sqrt(dx * dx + dy * dy) > minDistance;
    }

    // Event listener tombol "Nggak"
    noBtn.addEventListener("mouseenter", () => {
        changeNoButtonTextToEits();
        moveNoButton();
    });

    noBtn.addEventListener("click", moveNoButton);

    // Kontrol musik
    let isMuted = false;

    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted;
        muteBtn.innerHTML = isMuted ? "🔇" : "🔊";
    });

    // Saat tombol "Mau" diklik
    yesBtn.addEventListener("click", () => {
        // Fade out kontainer awal
        gsap.to(mainContainer, {
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            ease: "power3.in",
            onComplete: () => {
                mainContainer.style.display = "none";
            }
        });

        // Aktifkan layar perayaan
        celebration.classList.add("active");

        // Play musik latar
        backgroundMusic.play().catch(err => {
            console.log("Gagal memulai musik. Interaksi pengguna diperlukan.", err);
        });

        // Tampilkan tombol mute/unmute
        gsap.to(muteBtn, {
            opacity: 1,
            duration: 0.5,
            delay: 0.5,
            onStart: () => {
                muteBtn.classList.remove("hidden");
            }
        });

        // Buat love besar
        const bigLove = document.createElement("div");
        bigLove.className = "big-love";
        celebration.querySelector("#big-love").appendChild(bigLove);

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
                        onComplete: () => smallLove.remove()
                    });
                }

                // Hapus love besar
                setTimeout(() => {
                    bigLove.remove();

                    // Tampilkan teks pengumuman
                    announcementText.classList.add("show");

                    // Tampilkan detail akhir
                    setTimeout(() => {
                        gsap.to(finalDetails, {
                            opacity: 1,
                            duration: 0.6,
                            delay: 0.2
                        });
                    }, 1000);
                }, 1000);
            }
        });
    });
});