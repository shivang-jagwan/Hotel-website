document.addEventListener('DOMContentLoaded', function() {
    /***********************
     * CAROUSEL FUNCTIONALITY
     ***********************/
    class Carousel {
        constructor() {
            this.track = document.querySelector('.carousel-track');
            this.dotsContainer = document.querySelector('.carousel-dots');
            this.carousel = document.querySelector('.views-carousel');
            
            if (!this.track || !this.dotsContainer || !this.carousel) return;
            
            this.slides = document.querySelectorAll('.carousel-slide');
            this.slideCount = this.slides.length;
            this.currentIndex = 0;
            this.isTransitioning = false;
            this.interval = null;
            this.touchStartX = 0;
            this.isDragging = false;
            this.resizeTimeout = null;
            this.slideDuration = 3000; // 3 seconds per slide
            
            this.init();
        }
        
        init() {
            this.createDots();
            this.setupEventListeners();
            this.setupImageLoading();
            this.updateCarousel();
            this.startAutoSlide();
        }
        
        createDots() {
            this.dotsContainer.innerHTML = '';
            
            for (let i = 0; i < this.slideCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
        }
        
        setupEventListeners() {
            this.track.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
            this.carousel.addEventListener('mouseenter', this.pauseAutoSlide.bind(this));
            this.carousel.addEventListener('mouseleave', this.startAutoSlide.bind(this));
            
            // Touch events
            this.track.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.track.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
            this.track.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            
            // Window resize
            window.addEventListener('resize', this.handleResize.bind(this));
        }
        
        setupImageLoading() {
            this.slides.forEach(slide => {
                const img = slide.querySelector('img');
                if (img.complete) {
                    img.style.opacity = 1;
                } else {
                    img.style.opacity = 0;
                    img.addEventListener('load', () => {
                        img.style.opacity = 1;
                    }, { once: true });
                }
            });
        }
        
        updateCarousel() {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
        
        startAutoSlide() {
            this.pauseAutoSlide();
            this.interval = setInterval(() => {
                this.nextSlide();
            }, this.slideDuration);
        }
        
        pauseAutoSlide() {
            clearInterval(this.interval);
        }
        
        resetAutoSlide() {
            this.pauseAutoSlide();
            this.startAutoSlide();
        }
        
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.slideCount;
            this.updateCarousel();
        }
        
        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
            this.updateCarousel();
        }
        
        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoSlide();
        }
        
        handleTransitionEnd() {
            this.isTransitioning = false;
        }
        
        handleTouchStart(e) {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = true;
            this.pauseAutoSlide();
        }
        
        handleTouchMove(e) {
            if (!this.isDragging) return;
            const touchX = e.touches[0].clientX;
            const diff = this.touchStartX - touchX;
            this.track.style.transform = `translateX(calc(-${this.currentIndex * 100}% - ${diff}px))`;
        }
        
        handleTouchEnd(e) {
            if (!this.isDragging) return;
            this.isDragging = false;
            
            const touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextSlide();
                else this.prevSlide();
            } else {
                this.updateCarousel();
            }
            
            this.startAutoSlide();
        }
        
        handleResize() {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            }, 100);
        }
        
        destroy() {
            this.pauseAutoSlide();
            this.track.removeEventListener('transitionend', this.handleTransitionEnd);
            this.carousel.removeEventListener('mouseenter', this.pauseAutoSlide);
            this.carousel.removeEventListener('mouseleave', this.startAutoSlide);
            this.track.removeEventListener('touchstart', this.handleTouchStart);
            this.track.removeEventListener('touchmove', this.handleTouchMove);
            this.track.removeEventListener('touchend', this.handleTouchEnd);
            window.removeEventListener('resize', this.handleResize);
            
            document.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.removeEventListener('click', this.goToSlide);
            });
        }
    }

    /************************
     * HAMBURGER MENU FUNCTIONALITY
     ************************/
    class MobileMenu {
        constructor() {
            this.hamburger = document.querySelector('.hamburger');
            this.mobileMenu = document.querySelector('.mobile-menu');
            this.mobileCloseBtn = document.querySelector('.mobile-close-btn');
            this.body = document.body;
            
            if (!this.hamburger || !this.mobileMenu) return;
            
            this.overlay = this.createOverlay();
            this.init();
        }
        
        createOverlay() {
            const overlay = document.createElement('div');
            overlay.classList.add('mobile-menu-overlay');
            document.body.appendChild(overlay);
            return overlay;
        }
        
        init() {
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            this.hamburger.addEventListener('click', this.toggleMenu.bind(this));
            this.mobileCloseBtn.addEventListener('click', this.closeMenu.bind(this));
            this.overlay.addEventListener('click', this.closeMenu.bind(this));
            
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', this.closeMenu.bind(this));
            });
        }
        
        toggleMenu() {
            this.hamburger.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
            this.overlay.classList.toggle('active');
            this.body.classList.toggle('no-scroll');
        }
        
        closeMenu() {
            this.hamburger.classList.remove('active');
            this.mobileMenu.classList.remove('active');
            this.overlay.classList.remove('active');
            this.body.classList.remove('no-scroll');
        }
        
        destroy() {
            this.hamburger.removeEventListener('click', this.toggleMenu);
            this.mobileCloseBtn.removeEventListener('click', this.closeMenu);
            this.overlay.removeEventListener('click', this.closeMenu);
            
            this.mobileMenu.querySelectorAll('a').forEach(link => {
                link.removeEventListener('click', this.closeMenu);
            });
            
            document.body.removeChild(this.overlay);
        }
    }

    /************************
     * INITIALIZE ALL COMPONENTS
     ************************/
    const carousel = new Carousel();
    const mobileMenu = new MobileMenu();

    // Make available globally if needed
    window.app = {
        carousel,
        mobileMenu
    };
});