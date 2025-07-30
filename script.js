// =========================================================================================
// LOGIC CHÍNH CỦA TRANG WEB
// =========================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- CÁC BIẾN TOÀN CỤC ---
    const siteHeader = document.querySelector('.site-header');
    const modal = document.querySelector('.modal');
    const modalOverlayEl = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalImage = document.getElementById('modal-image');

    // Biến cho TÌM KIẾM MỚI (OVERLAY)
    const searchOverlay = document.getElementById('search-overlay');
    const searchInputOverlay = document.getElementById('search-overlay-input');
    const overlaySearchResultsContainer = document.getElementById('overlay-search-results');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const desktopSearchTrigger = document.getElementById('desktop-search-trigger');
    const mobileSearchTrigger = document.getElementById('mobile-search-trigger');

    // === SỬA LỖI: BIẾN CHO POP-UP AVATAR (được chuyển vào đây) ===
    const avatarImage = document.getElementById('avatar-image');
    const avatarPopup = document.getElementById('avatar-popup');
    const avatarPopupImg = document.getElementById('avatar-popup-img');
    const avatarCloseButton = document.querySelector('.avatar-popup-close');


    // --- HÀM MỞ VÀ ĐÓNG POP-UP (MODAL DỊCH VỤ) ---
    const openModal = () => {
        if (!modal || !modalOverlayEl) return;
        siteHeader.classList.add('is-hidden');
        modal.classList.add('active');
        modalOverlayEl.classList.add('active');
        document.body.classList.add('modal-open');
        document.dispatchEvent(new CustomEvent('modalHasOpened'));
    };

    const closeModal = () => {
        if (!modal || !modalOverlayEl) return;
        siteHeader.classList.remove('is-hidden');
        modal.classList.remove('active');
        modalOverlayEl.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            modal.classList.remove('image-view');
        }, 400);
        document.dispatchEvent(new CustomEvent('modalHasClosed'));
    };

    // --- HÀM HIỂN THỊ CHI TIẾT DỊCH VỤ ---
    async function showServiceModal(serviceId) {
        const { serviceData } = await import('./service-data.js');
        const data = serviceData[serviceId];
        if (!data) return;

        modal.classList.remove('image-view');
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-headline').innerHTML = data.headline;
        document.getElementById('modal-text').innerHTML = data.text;
        modalImage.src = data.img || '';

        openModal();
        initFaqAccordionInsideModal();
    }

    // --- HÀM TÌM KIẾM CHO LỚP PHỦ OVERLAY ---
    const handleOverlaySearch = async (event) => {
        const query = event.target.value.toLowerCase().trim();
        overlaySearchResultsContainer.innerHTML = '';
        const quickLinks = document.querySelector('.search-quick-links');
        if (quickLinks) {
            quickLinks.style.display = query.length > 0 ? 'none' : 'block';
        }
        if (query.length < 2) {
            overlaySearchResultsContainer.style.display = 'none';
            return;
        }

        const { serviceData } = await import('./service-data.js');
        const results = Object.keys(serviceData)
            .map(key => ({ id: key, ...serviceData[key] }))
            .filter(service => {
                const headline = service.headline.toLowerCase().replace(/<[^>]*>?/gm, '');
                const title = service.title.toLowerCase();
                return headline.includes(query) || title.includes(query);
            });

        if (results.length > 0) {
            overlaySearchResultsContainer.style.display = 'block';
            results.forEach(result => {
                const itemElement = document.createElement('div');
                itemElement.className = 'result-item';
                itemElement.innerHTML = `
                    <img src="${result.searchImg || './images/logo11.webp'}" alt="${result.title}">
                    <div class="result-item-info">
                        <h4>${result.headline.replace(/<[^>]*>?/gm, '')}</h4>
                        <p>${result.title}</p>
                    </div>`;
                itemElement.addEventListener('click', () => {
                    closeSearch();
                    setTimeout(() => showServiceModal(result.id), 400);
                });
                overlaySearchResultsContainer.appendChild(itemElement);
            });
        } else {
            overlaySearchResultsContainer.style.display = 'none';
        }
    };
    
    // --- LOGIC MỞ/ĐÓNG LỚP PHỦ TÌM KIẾM ---
    const openSearch = (e) => {
        if(e) e.preventDefault();
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInputOverlay.focus(), 400);
    };

    const closeSearch = () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        searchInputOverlay.value = '';
        overlaySearchResultsContainer.innerHTML = '';
        const quickLinks = document.querySelector('.search-quick-links');
        if (quickLinks) quickLinks.style.display = 'block';
    };

    // --- HÀM KHỞI TẠO ACCORDION CHO FAQ ---
    function initFaqAccordionInsideModal() {
        const faqContainer = modal.querySelector('.faq-container');
        if (!faqContainer) return;

        faqContainer.addEventListener('click', function (e) {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;
            const answer = questionBtn.nextElementSibling;
            const wasActive = questionBtn.classList.contains('active');
            this.querySelectorAll('.faq-question').forEach(btn => btn.classList.remove('active'));
            this.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
            if (!wasActive) {
                questionBtn.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    }

    // --- GÁN CÁC SỰ KIỆN ---
    function setupGlobalListeners() {
        // Sự kiện cho modal dịch vụ
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalOverlayEl) modalOverlayEl.addEventListener('click', closeModal);
        if (modal) {
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.modal-content')) e.stopPropagation();
             });
        }

        // Sự kiện cho các thẻ dịch vụ
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.dataset.id;
                if (serviceId) showServiceModal(serviceId);
            });
        });

        // Sự kiện cho Tìm kiếm
        if (desktopSearchTrigger) desktopSearchTrigger.addEventListener('click', openSearch);
        if (mobileSearchTrigger) mobileSearchTrigger.addEventListener('click', openSearch);
        if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
        }
        if (searchInputOverlay) searchInputOverlay.addEventListener('input', handleOverlaySearch);
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && searchOverlay.classList.contains('active')) closeSearch(); });
        
        // Sự kiện cho các link gợi ý nhanh trong tìm kiếm
        const quickLinksContainer = document.querySelector('.search-quick-links');
        if (quickLinksContainer) {
            quickLinksContainer.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                const serviceId = link ? link.dataset.id : null;
                if (serviceId) {
                    e.preventDefault();
                    closeSearch();
                    setTimeout(() => showServiceModal(serviceId), 400);
                }
            });
        }

        // === SỬA LỖI: LOGIC POP-UP AVATAR (được chuyển vào đây) ===
        if (avatarImage && avatarPopup && avatarPopupImg && avatarCloseButton) {
            // 1. Khi click vào ảnh avatar
            avatarImage.addEventListener('click', () => {
                const imgSrc = avatarImage.getAttribute('src');
                avatarPopupImg.setAttribute('src', imgSrc);
                avatarPopup.classList.add('show');
            });
            // 2. Khi click vào nút "x" để đóng
            avatarCloseButton.addEventListener('click', () => {
                avatarPopup.classList.remove('show');
            });
            // 3. Khi click vào nền đen bên ngoài để đóng
            avatarPopup.addEventListener('click', (event) => {
                if (event.target.id === 'avatar-popup') {
                    avatarPopup.classList.remove('show');
                }
            });
        }
        // === KẾT THÚC SỬA LỖI ===

        // Các sự kiện khác...
        const categoryTrigger = document.getElementById('category-trigger');
        const categoryOverlay = document.getElementById('category-overlay');
        const categoryMenu = document.getElementById('category-menu');
        const categoryCloseBtn = document.getElementById('category-close-btn');

        const openCategoryMenu = () => {
            siteHeader.classList.add('is-hidden');
            categoryOverlay.classList.add('active');
            categoryMenu.classList.add('active');
            document.body.classList.add('modal-open');
        };

        const closeCategoryMenu = () => {
            siteHeader.classList.remove('is-hidden');
            categoryOverlay.classList.remove('active');
            categoryMenu.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        if (categoryTrigger) categoryTrigger.addEventListener('click', (e) => { e.preventDefault(); openCategoryMenu(); });
        if (categoryOverlay) categoryOverlay.addEventListener('click', closeCategoryMenu);
        if (categoryCloseBtn) categoryCloseBtn.addEventListener('click', closeCategoryMenu);

        if (categoryMenu) {
            categoryMenu.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;
                const serviceId = link.dataset.id;
                if (serviceId) {
                    e.preventDefault();
                    closeCategoryMenu();
                    setTimeout(() => showServiceModal(serviceId), 50);
                } else {
                    closeCategoryMenu();
                }
            });
        }

        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mainNav = document.querySelector('.main-nav');
        if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mainNav.classList.toggle('is-open'));
        if (mainNav) {
            mainNav.addEventListener('click', (e) => {
                if (e.target.closest('a') && mainNav.classList.contains('is-open')) mainNav.classList.remove('is-open');
            });
        }
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href').length <= 1) return;
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Hiệu ứng fade-in khi cuộn
        const animatedElements = document.querySelectorAll('.card, .section-title, .owner-profile');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- KHỞI CHẠY CÁC HÀM VÀ SỰ KIỆN ---
    setupGlobalListeners();
    
    // Xử lý các chức năng riêng của từng trang
    const billShowcase = document.querySelector('.bill-showcase');
    if (billShowcase) {
        initBillCarousel();
    }
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
        pricingGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.price-card');
            if (card) {
                const serviceId = card.dataset.id;
                if (serviceId) showServiceModal(serviceId);
            }
        });
    }
    const faqNavContainer = document.querySelector('.faq-nav');
    const faqContentContainer = document.querySelector('.faq-content');
    if (faqNavContainer && faqContentContainer) {
        initFaqPage(faqNavContainer, faqContentContainer);
    }

    // --- CÁC HÀM CỤ THỂ ---
    function initFaqPage(nav, content) {
        nav.addEventListener('click', function (e) {
            e.preventDefault();
            const clickedLink = e.target.closest('.faq-nav-link');
            if (!clickedLink || clickedLink.classList.contains('active')) return;
            const targetId = clickedLink.getAttribute('href');
            const targetArticle = document.querySelector(targetId);
            if (targetArticle) {
                nav.querySelector('.active')?.classList.remove('active');
                clickedLink.classList.add('active');
                content.querySelector('.active')?.classList.remove('active');
                targetArticle.classList.add('active');
                if (window.innerWidth <= 768) targetArticle.scrollIntoView({ behavior: 'smooth' });
            }
        });
        content.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.faq-article')) {
                e.stopPropagation();
                if (modal && modalImage) {
                    modal.classList.add('image-view');
                    modalImage.src = e.target.src;
                    openModal();
                }
            }
        });
    }

    function initBillCarousel() {
        const billTrack = document.querySelector('.bill-carousel-track');
        if (!billTrack) return;
        const billSlider = document.querySelector('.bill-slider');
        const billCounter = document.querySelector('.bill-counter');

        const allBillImages = [
            { src: "./images_bill_thanh_toan/0313YTCAZL.webp", alt: "Bill 30" }, { src: "./images_bill_thanh_toan/0311YTVBZL.webp", alt: "Bill 29" },
            { src: "./images_bill_thanh_toan/0311YTTVFB.webp", alt: "Bill 28" }, { src: "./images_bill_thanh_toan/0311YTNHZL.webp", alt: "Bill 27" },
            { src: "./images_bill_thanh_toan/0311YTDMZL.webp", alt: "Bill 26" }, { src: "./images_bill_thanh_toan/0310YTTNFB.webp", alt: "Bill 25" },
            { src: "./images_bill_thanh_toan/0310DSDAFB.webp", alt: "Bill 24" }, { src: "./images_bill_thanh_toan/0309YTQHFB.webp", alt: "Bill 23" },
            { src: "./images_bill_thanh_toan/0308YTTAFB.webp", alt: "Bill 22" }, { src: "./images_bill_thanh_toan/0308YTMTFB.webp", alt: "Bill 21" },
            { src: "./images_bill_thanh_toan/0308YTDVFB.webp", alt: "Bill 20" }, { src: "./images_bill_thanh_toan/0308DSMTZL.webp", alt: "Bill 19" },
            { src: "./images_bill_thanh_toan/0306YTVPFB.webp", alt: "Bill 18" }, { src: "./images_bill_thanh_toan/0305YTNLFB.webp", alt: "Bill 17" },
            { src: "./images_bill_thanh_toan/0305YTAVFB.webp", alt: "Bill 16" }, { src: "./images_bill_thanh_toan/0305DSĐHFB.webp", alt: "Bill 15" },
            { src: "./images_bill_thanh_toan/0302YTVHZL.webp", alt: "Bill 14" }, { src: "./images_bill_thanh_toan/0302DSATFB.webp", alt: "Bill 13" },
            { src: "./images_bill_thanh_toan/0227YTTFB.webp", alt: "Bill 12" }, { src: "./images_bill_thanh_toan/0223YTTLFB.webp", alt: "Bill 11" },
            { src: "./images_bill_thanh_toan/0222YTATZL.webp", alt: "Bill 10" }, { src: "./images_bill_thanh_toan/0219YTNTFB.webp", alt: "Bill 9" },
            { src: "./images_bill_thanh_toan/0218YTNCFB.webp", alt: "Bill 8" }, { src: "./images_bill_thanh_toan/0216YTNTFB.webp", alt: "Bill 7" },
            { src: "./images_bill_thanh_toan/0215YTTHFB.webp", alt: "Bill 6" }, { src: "./images_bill_thanh_toan/0215YTTNZL.webp", alt: "Bill 5" },
            { src: "./images_bill_thanh_toan/0204DSLHZL.webp", alt: "Bill 4" }, { src: "./images_bill_thanh_toan/0203YTQPZL.webp", alt: "Bill 3" },
            { src: "./images_bill_thanh_toan/0202DSĐHFB.webp", alt: "Bill 2" }, { src: "./images_bill_thanh_toan/0128YTVHZL.webp", alt: "Bill 1" }
        ];

        let items = [];
        let currentIndex = 0;
        let autoSlideTimer;

        allBillImages.slice(0, 10).forEach(imgData => {
            const item = document.createElement('div');
            item.className = 'bill-carousel-item';
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            img.loading = 'lazy';
            item.appendChild(img);
            billTrack.appendChild(item);
        });
        
        items = Array.from(billTrack.children);
        if (items.length <= 1) return;

        function updateSliderAndCounter(index) {
            if (billSlider) {
                billSlider.value = index;
                const progressPercent = (allBillImages.length > 1) ? (index / (allBillImages.length - 1)) * 100 : 0;
                billSlider.style.setProperty('--progress', `${progressPercent}%`);
            }
            if (billCounter) billCounter.textContent = `${index + 1} / ${allBillImages.length}`;
        }

        function moveToSlide(index) {
            if (index < 0 || index >= allBillImages.length) return;
            if (index >= items.length) {
                for (let i = items.length; i <= index; i++) {
                     const imgData = allBillImages[i];
                     const item = document.createElement('div');
                     item.className = 'bill-carousel-item';
                     const img = document.createElement('img');
                     img.src = imgData.src;
                     img.alt = imgData.alt;
                     img.loading = 'lazy';
                     item.appendChild(img);
                     billTrack.appendChild(item);
                }
                items = Array.from(billTrack.children);
            }
            const targetItem = items[index];
            if (targetItem) {
                const padding = (billTrack.clientWidth - targetItem.clientWidth) / 2;
                const scrollAmount = targetItem.offsetLeft - padding;
                billTrack.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                currentIndex = index;
                updateSliderAndCounter(index);
                items.forEach((item, idx) => item.classList.toggle('active', idx === index));
            }
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideTimer = setInterval(() => {
                let nextIndex = (currentIndex + 1) % allBillImages.length;
                moveToSlide(nextIndex);
            }, 2000);
        }
        function stopAutoSlide() { clearInterval(autoSlideTimer); }
        
        let isScrolling;
        billTrack.addEventListener('scroll', () => {
             stopAutoSlide();
             window.clearTimeout(isScrolling);
             isScrolling = setTimeout(() => {
                const trackRect = billTrack.getBoundingClientRect();
                const trackCenter = trackRect.left + trackRect.width / 2;
                let closestIndex = -1, minDiff = Infinity;
                items.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenter = itemRect.left + itemRect.width / 2;
                    const diff = Math.abs(itemCenter - trackCenter);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = index;
                    }
                });
                if (closestIndex !== -1 && currentIndex !== closestIndex) moveToSlide(closestIndex);
                startAutoSlide();
             }, 150);
        });

        if (billSlider) {
            billSlider.max = allBillImages.length - 1;
            billSlider.addEventListener('input', () => {
                stopAutoSlide();
                moveToSlide(parseInt(billSlider.value, 10));
            });
            billSlider.addEventListener('change', startAutoSlide);
        }

        billTrack.addEventListener('click', (e) => {
            const img = e.target.closest('.bill-carousel-item img');
            if (img) {
                modal.classList.add('image-view');
                modalImage.src = img.src;
                openModal();
            }
        });
        
        document.addEventListener('modalHasOpened', stopAutoSlide);
        document.addEventListener('modalHasClosed', startAutoSlide);
        
        const firstItem = items[0];
        if (firstItem) {
            const padding = (billTrack.clientWidth - firstItem.clientWidth) / 2;
            billTrack.style.paddingLeft = `${padding}px`;
            billTrack.style.paddingRight = `${padding}px`;
        }

        setTimeout(() => { moveToSlide(0); startAutoSlide(); }, 100);
    }
});