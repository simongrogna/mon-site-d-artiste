// --- SCRIPT LIGHTBOX UNIFIÉ (NAVIGATION GLOBALE PAR PAGE) ---
window.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('imageLightbox') || document.querySelector('.lightbox, .lightbox-modal');
    const lightboxImg = document.getElementById('lightboxImg') || document.querySelector('.lightbox-img, .lightbox-content');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const counter = document.getElementById('lightboxCounter') || document.querySelector('.lightbox-counter');

    let currentImages = [];
    let currentIndex = 0;

    // Fonction d'ouverture de la lightbox
    function openLightbox(imagesArray, index = 0) {
        currentImages = imagesArray;
        currentIndex = index;
        
        if (!lightbox || !lightboxImg) return;

        lightboxImg.src = currentImages[currentIndex];
        
        // S'il y a plus d'une image au total, on affiche les flèches et le compteur
        const isMulti = currentImages.length > 1;
        
        if (counter) {
            counter.textContent = isMulti ? `${currentIndex + 1} / ${currentImages.length}` : '';
            counter.style.display = isMulti ? 'block' : 'none';
        }
        if (prevBtn) prevBtn.style.display = isMulti ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = isMulti ? 'flex' : 'none';

        // Ouvre la modale
        lightbox.classList.add('active');
        lightbox.style.display = 'flex';
    }

    // Fonction de fermeture
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.style.display = 'none';
    }

    // Écouteur global des clics
    document.addEventListener('click', function(e) {
        
        // 1. Bouton de spectacle ou éléments avec data-images explicite
        const dataImagesEl = e.target.closest('[data-images]');
        if (dataImagesEl) {
            e.preventDefault();
            try {
                const images = JSON.parse(dataImagesEl.getAttribute('data-images'));
                if (images && images.length > 0) {
                    openLightbox(images, 0);
                    return;
                }
            } catch (err) {
                console.error("Erreur de lecture JSON des images :", err);
            }
        }

        // 2. Images de projets / galeries (Cirque, Musique, etc.)
        const triggerEl = e.target.closest('.gallery-item, .music-img-wrap, .gallery-trigger, .project-image');
        if (triggerEl) {
            e.preventDefault();
            
            // Récupère TOUTES les images de la page courante pour permettre de naviguer de l'une à l'autre !
            const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item, .music-img-wrap, .gallery-trigger, .project-image'));
            
            const imagesArray = allGalleryItems.map(item => {
                const img = item.querySelector('img') || item;
                return item.getAttribute('data-full') || img.getAttribute('src');
            }).filter(src => src); // Filtre pour s'assurer qu'il n'y a pas de liens vides

            // Trouve l'index de l'image cliquée dans cette liste
            const clickedImg = triggerEl.querySelector('img') || triggerEl;
            const clickedSrc = triggerEl.getAttribute('data-full') || clickedImg.getAttribute('src');
            const clickedIndex = imagesArray.indexOf(clickedSrc);

            if (imagesArray.length > 0) {
                openLightbox(imagesArray, clickedIndex !== -1 ? clickedIndex : 0);
                return;
            }
        }
    });

    // --- NAVIGATION SUIVANT (→) ---
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImages.length > 1) {
                currentIndex = (currentIndex + 1) % currentImages.length;
                lightboxImg.src = currentImages[currentIndex];
                if (counter) {
                    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                }
            }
        });
    }

    // --- NAVIGATION PRÉCÉDENT (←) ---
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImages.length > 1) {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                lightboxImg.src = currentImages[currentIndex];
                if (counter) {
                    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                }
            }
        });
    }

    // --- FERMETURE ---
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            e.target === lightbox && closeLightbox();
        });
    }

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const galleryBtn = document.querySelector('.spectacle-gallery-btn');
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (galleryBtn && lightbox) {
        let images = [];
        try {
            images = JSON.parse(galleryBtn.getAttribute('data-images'));
        } catch (e) {
            images = [galleryBtn.getAttribute('href')];
        }
        
        let currentIndex = 0;

        function updateLightbox() {
            lightboxImg.src = images[currentIndex];
            if (lightboxCounter) {
                lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
            }
        }

        // Clic sur le bouton "Photos"
        galleryBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche l'ouverture du lien brut dans un nouvel onglet
            currentIndex = 0;
            updateLightbox();
            lightbox.classList.add('active'); // Ou lightbox.style.display = 'flex' selon ton CSS
        });

        // Fermer la modale
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Image suivante
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateLightbox();
            });
        }

        // Image précédente
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightbox();
            });
        }
    }
});



// --- GESTION DU MENU MOBILE (HAMBURGER) ---
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-btn");

    if (menuToggle && navLinks) {
        // Ouvrir / Fermer au clic sur le bouton
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Fermer automatiquement le menu lorsqu'on clique sur un lien
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
});
// --- GESTION DES LECTEURS AUDIO SIMPLIFIÉS ---
document.addEventListener("DOMContentLoaded", () => {
    const players = document.querySelectorAll(".custom-audio-player");

    players.forEach(player => {
        const audio = player.querySelector("audio");
        const playBtn = player.querySelector(".play-btn");
        const seekSlider = player.querySelector(".seek-slider");
        const currentTimeEl = player.querySelector(".current-time");
        const durationEl = player.querySelector(".duration");

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        audio.addEventListener("loadedmetadata", () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        playBtn.addEventListener("click", () => {
            players.forEach(p => {
                const otherAudio = p.querySelector("audio");
                const otherBtn = p.querySelector(".play-btn");
                if (otherAudio !== audio && !otherAudio.paused) {
                    otherAudio.pause();
                    otherBtn.textContent = "▶";
                }
            });

            if (audio.paused) {
                audio.play();
                playBtn.textContent = "❚❚";
            } else {
                audio.pause();
                playBtn.textContent = "▶";
            }
        });

        audio.addEventListener("timeupdate", () => {
            if (!audio.duration) return;
            const percent = (audio.currentTime / audio.duration) * 100;
            seekSlider.value = percent;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        // Permet de glisser ou de cliquer sur la barre pour avancer/reculer instantanément
        seekSlider.addEventListener("input", () => {
            if (!audio.duration) return;
            const time = (seekSlider.value / 100) * audio.duration;
            audio.currentTime = time;
        });

        audio.addEventListener("ended", () => {
            playBtn.textContent = "▶";
            seekSlider.value = 0;
            currentTimeEl.textContent = "0:00";
        });
    });
});
