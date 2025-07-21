// =========================================================================================
// LOGIC CHÍNH CỦA TRANG WEB
// Code đã được tối ưu và thêm chức năng tìm kiếm.
// =========================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- CÁC BIẾN TOÀN CỤC ---
    const siteHeader = document.querySelector('.site-header');
    const modal = document.querySelector('.modal');
    const modalOverlayEl = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalImage = document.getElementById('modal-image');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const headerSearchContainer = document.querySelector('.header-search');


    // --- HÀM MỞ VÀ ĐÓNG POP-UP (MODAL) ---
    const openModal = () => {
        siteHeader.classList.add('is-hidden');
        modal.classList.add('active');
        modalOverlayEl.classList.add('active');
        document.body.classList.add('modal-open');
        document.dispatchEvent(new CustomEvent('modalHasOpened'));
    };

    const closeModal = () => {
        siteHeader.classList.remove('is-hidden');
        modal.classList.remove('active');
        modalOverlayEl.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            modal.classList.remove('image-view');
            modal.style.transformOrigin = 'center center';
        }, 400);
        document.dispatchEvent(new CustomEvent('modalHasClosed'));
    };

    // --- HÀM HIỂN THỊ CHI TIẾT DỊCH VỤ (TẢI DỮ LIỆU ĐỘNG) ---
    async function showServiceModal(serviceId) {
        const { serviceData } = await import('./service-data.js');
        const data = serviceData[serviceId];
        if (!data) {
            console.error("No data found for service ID:", serviceId);
            return;
        }

        modal.classList.remove('image-view');
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-headline').innerHTML = data.headline;
        document.getElementById('modal-text').innerHTML = data.text;
        modalImage.src = data.img || '';

        openModal();
        initFaqAccordionInsideModal();
    }

    // --- ✅ BẮT ĐẦU: LOGIC TÌM KIẾM ---
    const handleSearch = async (event) => {
        const query = event.target.value.toLowerCase().trim();
        searchResultsContainer.innerHTML = '';

        if (query.length < 2) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        try {
            const { serviceData } = await import('./service-data.js');

            const results = Object.keys(serviceData)
                .map(key => ({ id: key, ...serviceData[key] }))
                .filter(service => {
                    const headline = service.headline.toLowerCase().replace(/<[^>]*>?/gm, ''); // Xóa tag HTML
                    const title = service.title.toLowerCase();
                    return headline.includes(query) || title.includes(query);
                });

            if (results.length > 0) {
                searchResultsContainer.style.display = 'block';
                results.forEach(result => {
                    const card = document.querySelector(`.card[data-id="${result.id}"]`);
                    const imgSrc = card ? card.querySelector('img').src : './images/logo11.png';

                    const itemElement = document.createElement('div');
                    itemElement.className = 'result-item';
                    itemElement.innerHTML = `
                        <img src="${imgSrc}" alt="${result.title}">
                        <div class="result-item-info">
                            <h4>${result.headline.replace(/<[^>]*>?/gm, '')}</h4>
                            <p>${result.title}</p>
                        </div>
                    `;

                    itemElement.addEventListener('click', () => {
                        showServiceModal(result.id);
                        searchInput.value = '';
                        searchResultsContainer.style.display = 'none';
                    });

                    searchResultsContainer.appendChild(itemElement);
                });
            } else {
                searchResultsContainer.style.display = 'none';
            }
        } catch (error) {
            console.error("Error loading or searching service data:", error);
            searchResultsContainer.style.display = 'none';
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    // Đóng kết quả tìm kiếm khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (headerSearchContainer && !headerSearchContainer.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
    // --- ✅ KẾT THÚC: LOGIC TÌM KIẾM ---


    // --- HÀM KHỞI TẠO ACCORDION CHO FAQ TRONG MODAL ---
    function initFaqAccordionInsideModal() {
        const faqContainer = modal.querySelector('.faq-container');
        if (!faqContainer) return;

        faqContainer.addEventListener('click', function (e) {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;
            const answer = questionBtn.nextElementSibling;
            const wasActive = questionBtn.classList.contains('active');
            this.querySelectorAll('.faq-question').forEach(btn => {
                if (btn !== questionBtn) {
                    btn.classList.remove('active');
                    btn.nextElementSibling.style.maxHeight = null;
                }
            });
            if (!wasActive) {
                questionBtn.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                questionBtn.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    }

    // --- GÁN CÁC SỰ KIỆN CHUNG CHO TRANG ---
    function setupGlobalListeners() {
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalOverlayEl) modalOverlayEl.addEventListener('click', closeModal);
        if (modal) modal.addEventListener('click', (e) => e.stopPropagation());

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.dataset.id;
                if (serviceId) showServiceModal(serviceId);
            });
        });

        // Logic cho menu danh mục dịch vụ
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
                } else if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    closeCategoryMenu();
                } else {
                    closeCategoryMenu();
                }
            });
        }

        // Logic cho menu mobile
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mainNav = document.querySelector('.main-nav');
        if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mainNav.classList.toggle('is-open'));
        if (mainNav) {
            mainNav.addEventListener('click', (e) => {
                if (e.target.closest('a') && mainNav.classList.contains('is-open')) mainNav.classList.remove('is-open');
            });
        }

        // Logic cuộn mượt
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href').length <= 1) return;
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Hiệu ứng xuất hiện khi cuộn
        const animatedElements = document.querySelectorAll('.card, .section-title');
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

    setupGlobalListeners();

    // LOGIC BỘ LỌC DỊCH VỤ
    const filterContainer = document.querySelector('.filter-buttons');
    const serviceCards = document.querySelectorAll('.services-section .card');
    if (filterContainer && serviceCards.length > 0) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const filterValue = e.target.getAttribute('data-filter');
                serviceCards.forEach(card => {
                    card.style.display = (filterValue === 'all' || card.dataset.category === filterValue) ? 'flex' : 'none';
                });
            }
        });
    }

    // LOGIC CAROUSEL BILL (Lazy loaded)
    const billShowcase = document.querySelector('.bill-showcase');
    if (billShowcase) {
        const carouselObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initBillCarousel();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        carouselObserver.observe(billShowcase);
    }

    function initBillCarousel() {
        const billTrack = document.querySelector('.bill-carousel-track');
        if (!billTrack) return;
        const billSlider = document.querySelector('.bill-slider');
        const billCounter = document.querySelector('.bill-counter');
        const billImages = [
            { src: "./images_bill_thanh_toan/0222YTATZL.png", alt: "Bill 10" }, { src: "./images_bill_thanh_toan/0219YTNTFB.png", alt: "Bill 9" }, { src: "./images_bill_thanh_toan/0218YTNCFB.png", alt: "Bill 8" }, { src: "./images_bill_thanh_toan/0216YTNTFB.png", alt: "Bill 7" }, { src: "./images_bill_thanh_toan/0215YTTHFB.png", alt: "Bill 6" }, { src: "./images_bill_thanh_toan/0215YTTNZL.png", alt: "Bill 5" }, { src: "./images_bill_thanh_toan/0204DSLHZL.png", alt: "Bill 4" }, { src: "./images_bill_thanh_toan/0203YTQPZL.png", alt: "Bill 3" }, { src: "./images_bill_thanh_toan/0202DSĐHFB.png", alt: "Bill 2" }, { src: "./images_bill_thanh_toan/0128YTVHZL.png", alt: "Bill 1" }
        ];

        billImages.forEach(imgData => {
            const item = document.createElement('div');
            item.className = 'bill-carousel-item';
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            img.loading = 'lazy';
            item.appendChild(img);
            billTrack.appendChild(item);
        });

        const items = Array.from(billTrack.children);
        if (items.length <= 1) return;

        let currentIndex = 0;
        let autoSlideTimer;
        let isModalOpen = false;
        const autoSlideInterval = 3500;

        function updateActiveState(centerIndex) {
            if (centerIndex === -1 || centerIndex === currentIndex) return;
            currentIndex = centerIndex;
            items.forEach((item, index) => item.classList.toggle('active', index === currentIndex));
            if (billSlider) {
                billSlider.value = currentIndex;
                const progressPercent = (items.length > 1) ? (currentIndex / (items.length - 1)) * 100 : 0;
                billSlider.style.setProperty('--progress', `${progressPercent}%`);
            }
            if (billCounter) billCounter.textContent = `${currentIndex + 1} / ${items.length}`;
        }

        function getCenterIndex() {
            const trackRect = billTrack.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;
            let closestIndex = -1;
            let minDiff = Infinity;
            items.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const diff = Math.abs(itemCenter - trackCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });
            return closestIndex;
        }

        function moveToSlide(index) {
            if (index < 0 || index >= items.length) return;
            const targetItem = items[index];
            if (targetItem) {
                const padding = (billTrack.clientWidth - targetItem.clientWidth) / 2;
                const scrollAmount = targetItem.offsetLeft - padding;
                billTrack.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                updateActiveState(index);
            }
        }

        function startAutoSlide() {
            if (isModalOpen) return;
            clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(() => {
                let nextIndex = (currentIndex + 1) % items.length;
                moveToSlide(nextIndex);
            }, autoSlideInterval);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideTimer);
        }

        let isScrolling;
        billTrack.addEventListener('scroll', () => {
            stopAutoSlide();
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                updateActiveState(getCenterIndex());
                startAutoSlide();
            }, 150);
        });

        if (billSlider) {
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

        document.addEventListener('modalHasOpened', () => { isModalOpen = true; stopAutoSlide(); });
        document.addEventListener('modalHasClosed', () => { isModalOpen = false; startAutoSlide(); });

        const firstItem = items[0];
        if (firstItem) {
            const padding = (billTrack.clientWidth - firstItem.clientWidth) / 2;
            billTrack.style.paddingLeft = `${padding}px`;
            billTrack.style.paddingRight = `${padding}px`;
        }
        if (billSlider) billSlider.max = items.length - 1;

        setTimeout(() => {
            moveToSlide(0);
            startAutoSlide();
        }, 100);
    }
});