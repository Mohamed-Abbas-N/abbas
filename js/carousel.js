 $(document).ready(function () {
      $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: true,
        dotsEach: 1,
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: false,
        navText: [
          '<i class="fa-solid fa-chevron-left"></i>',
          '<i class="fa-solid fa-chevron-right"></i>'
        ],
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 }
        }
      });
    });

    // =======================
    // Fixed Lightbox Logic
    // =======================
    const lightbox = document.getElementById("lightboxOverlay");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let currentLightboxIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let isScrolling = false;

    // Select only real slides (ignore Owl clones)
    const realSlides = Array.from(document.querySelectorAll(".owl-carousel img"));

    // Add event listeners to each image
    realSlides.forEach((img, index) => {
      // For touch devices
      img.addEventListener('touchstart', handleTouchStart, { passive: true });
      img.addEventListener('touchmove', handleTouchMove, { passive: true });
      img.addEventListener('touchend', handleTouchEnd);
      
      // For mouse devices
      img.addEventListener('mousedown', handleMouseDown);
      img.addEventListener('mouseup', handleMouseUp);
      img.addEventListener('click', handleClick);
      
      // Store the index as a data attribute
      img.setAttribute('data-index', index);
    });

    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isScrolling = false;
    }

    function handleTouchMove(e) {
      // If user is scrolling, mark it so we don't open the lightbox
      if (Math.abs(e.touches[0].clientX - touchStartX) > 5 || 
          Math.abs(e.touches[0].clientY - touchStartY) > 5) {
        isScrolling = true;
      }
    }

    function handleTouchEnd(e) {
      if (!isScrolling) {
        // It was a tap, not a scroll - open lightbox
        const index = parseInt(e.target.getAttribute('data-index'));
        currentLightboxIndex = index;
        openLightbox();
      }
    }

    function handleMouseDown(e) {
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      isScrolling = false;
    }

    function handleMouseUp(e) {
      const deltaX = Math.abs(e.clientX - touchStartX);
      const deltaY = Math.abs(e.clientY - touchStartY);
      
      // If mouse moved significantly, it was a drag, not a click
      if (deltaX > 5 || deltaY > 5) {
        isScrolling = true;
      }
    }

    function handleClick(e) {
      // Only process if it wasn't a scroll action
      if (!isScrolling) {
        const index = parseInt(e.target.getAttribute('data-index'));
        currentLightboxIndex = index;
        openLightbox();
      }
    }

    function openLightbox() {
      lightboxImg.src = realSlides[currentLightboxIndex].src;
      lightbox.classList.remove("hidden");
      setTimeout(() => {
        lightbox.classList.add("show");
      }, 10);
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("show");
      setTimeout(() => {
        lightbox.classList.add("hidden");
        document.body.style.overflow = "";
      }, 300);
    }

    function showPrevLightbox() {
      currentLightboxIndex = (currentLightboxIndex - 1 + realSlides.length) % realSlides.length;
      lightboxImg.src = realSlides[currentLightboxIndex].src;
    }

    function showNextLightbox() {
      currentLightboxIndex = (currentLightboxIndex + 1) % realSlides.length;
      lightboxImg.src = realSlides[currentLightboxIndex].src;
    }

    // Event Listeners
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrevLightbox);
    lightboxNext.addEventListener("click", showNextLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevLightbox();
      if (e.key === "ArrowRight") showNextLightbox();
    });

