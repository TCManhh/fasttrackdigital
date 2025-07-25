﻿// =========================================================================================
// LOGIC CHÍNH CỦA TRANG WEB
// Code đã được tối ưu và thêm chức năng tìm kiếm toàn màn hình (Apple Style).
// =========================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- CÁC BIẾN TOÀN CỤC ---
    const siteHeader = document.querySelector('.site-header');
    const modal = document.querySelector('.modal');
    const modalOverlayEl = document.querySelector('.modal-overlay');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalImage = document.getElementById('modal-image');

    // Biến cho tìm kiếm cũ (để xử lý click bên ngoài)
    const headerSearchContainer = document.querySelector('.header-search');
    const searchResultsContainer = document.getElementById('search-results');
    
    // --- Biến cho TÌM KIẾM MỚI (OVERLAY) ---
    const searchOverlay = document.getElementById('search-overlay');
    const searchInputOverlay = document.getElementById('search-overlay-input');
    const overlaySearchResultsContainer = document.getElementById('overlay-search-results');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const desktopSearchTrigger = document.getElementById('desktop-search-trigger');
    const mobileSearchTrigger = document.getElementById('mobile-search-trigger');


    // --- HÀM MỞ VÀ ĐÓNG POP-UP (MODAL) ---
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

        try {
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
                    const imgSrc = result.searchImg || './images/logo11.webp';

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
                        closeSearch();
                        setTimeout(() => showServiceModal(result.id), 400);
                    });

                    overlaySearchResultsContainer.appendChild(itemElement);
                });
            } else {
                overlaySearchResultsContainer.style.display = 'none';
            }
        } catch (error) {
            console.error("Error loading or searching service data:", error);
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
        
        if (modal) {
             modal.addEventListener('click', (e) => {
                 if (e.target.closest('.modal-content')) {
                    e.stopPropagation();
                 }
             });
        }


        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.dataset.id;
                if (serviceId) showServiceModal(serviceId);
            });
        });

        // --- GÁN SỰ KIỆN CHO TÌM KIẾM MỚI ---
        if (desktopSearchTrigger) desktopSearchTrigger.addEventListener('click', openSearch);
        if (mobileSearchTrigger) mobileSearchTrigger.addEventListener('click', openSearch);
        if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);
        
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    closeSearch();
                }
            });
        }
        
        if (searchInputOverlay) {
            searchInputOverlay.addEventListener('input', handleOverlaySearch);
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });
        
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

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('click', (event) => {
        event.preventDefault();
        openSearch(event);
      });
    }

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
    
    // --- BẮT ĐẦU CODE MỚI: XỬ LÝ CLICK TRÊN BẢNG GIÁ ---
    const pricingTable = document.querySelector('.pricing-table');
    if (pricingTable) {
        pricingTable.addEventListener('click', (e) => {
            const row = e.target.closest('.clickable-row');
            if (row) {
                const serviceId = row.dataset.id;
                if (serviceId) {
                    showServiceModal(serviceId);
                }
            }
        });
    }
    // --- KẾT THÚC CODE MỚI ---

    function initBillCarousel() {
        const billTrack = document.querySelector('.bill-carousel-track');
        if (!billTrack) return;
        const billSlider = document.querySelector('.bill-slider');
        const billCounter = document.querySelector('.bill-counter');

        const allBillImages = [
            { src: "./images_bill_thanh_toan/0313YTCAZL.webp", alt: "Bill 30" },
            { src: "./images_bill_thanh_toan/0311YTVBZL.webp", alt: "Bill 29" },
            { src: "./images_bill_thanh_toan/0311YTTVFB.webp", alt: "Bill 28" },
            { src: "./images_bill_thanh_toan/0311YTNHZL.webp", alt: "Bill 27" },
            { src: "./images_bill_thanh_toan/0311YTDMZL.webp", alt: "Bill 26" },
            { src: "./images_bill_thanh_toan/0310YTTNFB.webp", alt: "Bill 25" },
            { src: "./images_bill_thanh_toan/0310DSDAFB.webp", alt: "Bill 24" },
            { src: "./images_bill_thanh_toan/0309YTQHFB.webp", alt: "Bill 23" },
            { src: "./images_bill_thanh_toan/0308YTTAFB.webp", alt: "Bill 22" },
            { src: "./images_bill_thanh_toan/0308YTMTFB.webp", alt: "Bill 21" },
            { src: "./images_bill_thanh_toan/0308YTDVFB.webp", alt: "Bill 20" },
            { src: "./images_bill_thanh_toan/0308DSMTZL.webp", alt: "Bill 19" },
            { src: "./images_bill_thanh_toan/0306YTVPFB.webp", alt: "Bill 18" },
            { src: "./images_bill_thanh_toan/0305YTNLFB.webp", alt: "Bill 17" },
            { src: "./images_bill_thanh_toan/0305YTAVFB.webp", alt: "Bill 16" },
            { src: "./images_bill_thanh_toan/0305DSĐHFB.webp", alt: "Bill 15" },
            { src: "./images_bill_thanh_toan/0302YTVHZL.webp", alt: "Bill 14" },
            { src: "./images_bill_thanh_toan/0302DSATFB.webp", alt: "Bill 13" },
            { src: "./images_bill_thanh_toan/0227YTTFB.webp", alt: "Bill 12" },
            { src: "./images_bill_thanh_toan/0223YTTLFB.webp", alt: "Bill 11" },
            { src: "./images_bill_thanh_toan/0222YTATZL.webp", alt: "Bill 10" },
            { src: "./images_bill_thanh_toan/0219YTNTFB.webp", alt: "Bill 9" },
            { src: "./images_bill_thanh_toan/0218YTNCFB.webp", alt: "Bill 8" },
            { src: "./images_bill_thanh_toan/0216YTNTFB.webp", alt: "Bill 7" },
            { src: "./images_bill_thanh_toan/0215YTTHFB.webp", alt: "Bill 6" },
            { src: "./images_bill_thanh_toan/0215YTTNZL.webp", alt: "Bill 5" },
            { src: "./images_bill_thanh_toan/0204DSLHZL.webp", alt: "Bill 4" },
            { src: "./images_bill_thanh_toan/0203YTQPZL.webp", alt: "Bill 3" },
            { src: "./images_bill_thanh_toan/0202DSĐHFB.webp", alt: "Bill 2" },
            { src: "./images_bill_thanh_toan/0128YTVHZL.webp", alt: "Bill 1" }
        ];

        const initialLoadCount = 10;
        let items = [];

        function addImageToCarousel(index) {
            if (index >= allBillImages.length || billTrack.children[index]) return;

            const imgData = allBillImages[index];
            const item = document.createElement('div');
            item.className = 'bill-carousel-item';
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            img.loading = 'lazy';
            img.onerror = () => item.style.display = 'none';
            item.appendChild(img);
            billTrack.appendChild(item);
        }

        for (let i = 0; i < initialLoadCount && i < allBillImages.length; i++) {
            addImageToCarousel(i);
        }
        
        items = Array.from(billTrack.children);
        if (items.length <= 1) return;

        let currentIndex = 0;
        let autoSlideTimer;
        let isModalOpen = false;
        const autoSlideInterval = 2000;

        function updateActiveState(centerIndex) {
            if (centerIndex === -1 || centerIndex === currentIndex) return;
            currentIndex = centerIndex;
            items.forEach((item, index) => item.classList.toggle('active', index === currentIndex));
            
            if (billSlider) {
                billSlider.value = currentIndex;
                const progressPercent = (allBillImages.length > 1) ? (currentIndex / (allBillImages.length - 1)) * 100 : 0;
                billSlider.style.setProperty('--progress', `${progressPercent}%`);
            }
            if (billCounter) billCounter.textContent = `${currentIndex + 1} / ${allBillImages.length}`;
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
            if (index >= items.length && index < allBillImages.length) {
                addImageToCarousel(index);
                items = Array.from(billTrack.children);
            }

            const preloadIndex = index + 9;
            if (preloadIndex < allBillImages.length && !billTrack.children[preloadIndex]) {
                addImageToCarousel(preloadIndex);
                items = Array.from(billTrack.children);
            }

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
                let nextIndex = (currentIndex + 1) % allBillImages.length;
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
            firstItem.classList.add('active');
        }
        
        if (billSlider) billSlider.max = allBillImages.length - 1;
        if (billCounter) billCounter.textContent = `1 / ${allBillImages.length}`;

        setTimeout(() => {
            moveToSlide(0);
            startAutoSlide();
        }, 100);
    }
});