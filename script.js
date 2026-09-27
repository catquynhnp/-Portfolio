/**
 * PORTFOLIO NGUYỄN PHAN CÁT QUỲNH
 * JavaScript Interactions:
 * - Two-Way Scroll Reveal & Auto-Exit Animation Engine
 * - Multi-Island Droplet Navbar & Active Section Tracking
 * - Showcase Tab Switcher
 * - Simulated Video Player Mockup
 * - Image Lightbox Viewer
 * - One-Click Email Copy
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. TWO-WAY SCROLL REVEAL & AUTO-EXIT ENGINE
       Hiệu ứng 2 chiều: Cuộn tới thì tự hiện ra, lướt qua thì tự mờ dần đi
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    function handleScrollAnimations() {
        const viewportHeight = window.innerHeight;

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const topThreshold = -120; // Ngưỡng khi phần tử cuộn vượt quá cạnh trên
            const bottomThreshold = viewportHeight - 80; // Ngưỡng khi phần tử tiến vào từ dưới

            // 1. Nếu phần tử đã bị cuộn vượt quá lên trên cùng màn hình -> AUTO-EXIT
            if (rect.bottom < 150) {
                el.classList.add('is-exit');
                el.classList.remove('is-visible');
            } 
            // 2. Nếu phần tử đang nằm trong vùng nhìn thấy của người dùng -> IS-VISIBLE
            else if (rect.top <= bottomThreshold && rect.bottom >= topThreshold) {
                el.classList.add('is-visible');
                el.classList.remove('is-exit');
            } 
            // 3. Nếu phần tử nằm tít bên dưới chưa cuộn tới -> Reset về trạng thái chờ
            else if (rect.top > bottomThreshold) {
                el.classList.remove('is-visible');
                el.classList.remove('is-exit');
            }
        });
    }

    // Lắng nghe sự kiện cuộn với requestAnimationFrame để đạt 60fps mượt mà
    let isTicking = false;
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                handleScrollAnimations();
                handleNavbarScroll();
                updateActiveNavLink();
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });

    // Kích hoạt ngay lần đầu tải trang
    handleScrollAnimations();


    /* ==========================================================================
       2. MULTI-ISLAND DROPLET NAVBAR & ACTIVE SECTION TRACKING
       ========================================================================== */
    const floatingHeader = document.getElementById('floatingHeader');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollY = window.scrollY;

    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;

        // Tự ẩn khi cuộn xuống quá 200px và đang cuộn xuống nhanh
        if (currentScrollY > 250 && currentScrollY > lastScrollY + 10) {
            floatingHeader.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY - 5) {
            // Hiện lại khi cuộn ngược lên
            floatingHeader.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    }

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Cuộn mượt khi click menu
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    /* ==========================================================================
       3. SHOWCASE TABS SWITCHER (Fanpage vs Media Production)
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
                // Gọi lại hiệu ứng cuộn cho các phần tử bên trong tab mới
                setTimeout(handleScrollAnimations, 50);
            }
        });
    });


    /* ==========================================================================
       4. SIMULATED VIDEO PLAYER MOCKUP (Tablet)
       ========================================================================== */
    const playBtn = document.getElementById('playBtnMock');
    const progressFill = document.querySelector('.progress-fill');
    const timeCurrent = document.querySelector('.time-current');
    let isPlaying = false;
    let playInterval;

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                let currentPercent = 35;
                let currentSec = 62;
                playInterval = setInterval(() => {
                    currentPercent += 0.5;
                    currentSec += 1;
                    if (currentPercent >= 100) {
                        currentPercent = 0;
                        currentSec = 0;
                    }
                    progressFill.style.width = `${currentPercent}%`;
                    const mins = String(Math.floor(currentSec / 60)).padStart(2, '0');
                    const secs = String(currentSec % 60).padStart(2, '0');
                    timeCurrent.textContent = `${mins}:${secs}`;
                }, 500);
            } else {
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                clearInterval(playInterval);
            }
        });
    }


    /* ==========================================================================
       5. IMAGE LIGHTBOX MODAL
       ========================================================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');

    function openLightbox(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Gán sự kiện phóng to cho các ảnh trong Gallery và bài viết Facebook
    document.querySelectorAll('.gallery-main-frame, .gallery-sub-frame').forEach(frame => {
        frame.addEventListener('click', () => {
            const img = frame.querySelector('img');
            const caption = frame.querySelector('.img-caption span');
            if (img) openLightbox(img.src, caption ? caption.textContent : '');
        });
    });

    document.querySelectorAll('.single-post-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const title = card.querySelector('h4');
            if (img) openLightbox(img.src, title ? title.textContent : '');
        });
    });


    /* ==========================================================================
       6. ONE-CLICK EMAIL COPY
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailVal = document.getElementById('emailVal');
    const copyTooltip = document.getElementById('copyTooltip');

    if (copyEmailBtn && emailVal) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailVal.textContent.trim();
            navigator.clipboard.writeText(email).then(() => {
                copyTooltip.classList.add('show');
                setTimeout(() => {
                    copyTooltip.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Không thể sao chép email: ', err);
            });
        });
    }

});
