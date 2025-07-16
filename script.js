document.addEventListener('DOMContentLoaded', function () {
    const siteHeader = document.querySelector('.site-header');
    const modal = document.querySelector('.modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    // --- GLOBAL COMPONENTS LOGIC (HEADER, MODAL, CATEGORY MENU) ---

    function setupGlobalComponents() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mainNav = document.querySelector('.main-nav');
        const mobileSearchIcon = document.querySelector('.mobile-search-icon');
        const categoryTrigger = document.getElementById('category-trigger');
        const categoryOverlay = document.getElementById('category-overlay');
        const categoryMenu = document.getElementById('category-menu');
        const categoryCloseBtn = document.getElementById('category-close-btn');

        // Hamburger Menu
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => mainNav.classList.toggle('is-open'));
        }
        if (mainNav) {
            mainNav.addEventListener('click', e => {
                if (e.target.closest('a') && mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                }
            });
        }

        // Mobile Search
        if (mobileSearchIcon) {
            mobileSearchIcon.addEventListener('click', () => siteHeader.classList.toggle('search-active'));
        }

        // Category Menu
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

        if (categoryTrigger) categoryTrigger.addEventListener('click', e => {
            e.preventDefault();
            openCategoryMenu();
        });

        if (categoryOverlay) categoryOverlay.addEventListener('click', closeCategoryMenu);
        if (categoryCloseBtn) categoryCloseBtn.addEventListener('click', closeCategoryMenu);

        if (categoryMenu) {
            categoryMenu.addEventListener('click', e => {
                const link = e.target.closest('a');
                if (link && link.hash) {
                    closeCategoryMenu();
                    const product = ALL_PRODUCTS.find(p => p.id === link.hash.replace('#show-', ''));
                    if (product) {
                        e.preventDefault();
                        window.openModal(product);
                    }
                }
            });
        }
    }

    // --- MODAL (POP-UP) LOGIC ---
    function setupModal() {
        if (!modal) return;

        const modalCloseBtn = modal.querySelector('.modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalHeadline = document.getElementById('modal-headline');
        const modalText = document.getElementById('modal-text');
        const modalImage = document.getElementById('modal-image');

        const openModal = (content) => {
            modal.classList.remove('image-view');

            if (content.title) modalTitle.textContent = content.title;
            if (content.headline) modalHeadline.innerHTML = content.headline;
            if (content.detailsHTML) modalText.innerHTML = content.detailsHTML;
            if (content.imageSrc) {
                modalImage.src = content.imageSrc;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }

            siteHeader.classList.add('is-hidden');
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.classList.add('modal-open');
            initFaqAccordion(); // Re-initialize accordion for new content
        };

        const openImageModal = (imgSrc, originalElement) => {
            const rect = originalElement.getBoundingClientRect();
            modal.style.transformOrigin = `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
            modal.classList.add('image-view');
            modalText.innerHTML = '';
            modalTitle.textContent = '';
            modalHeadline.innerHTML = '';
            modalImage.src = imgSrc;
            modalImage.style.display = 'block';

            siteHeader.classList.add('is-hidden');
            modal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            siteHeader.classList.remove('is-hidden');
            modal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                modal.classList.remove('image-view');
                modalImage.src = "";
                modal.style.transformOrigin = 'center center';
            }, 350);
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        window.openModal = openModal;
        window.openImageModal = openImageModal;
    }

    // --- PAGE-SPECIFIC LOGIC ---

    // Render cards from product data
    function renderProductCards() {
        const container = document.querySelector('.card-container');
        if (!container || typeof ALL_PRODUCTS === 'undefined') return;

        const cards = container.querySelectorAll('.card');
        cards.forEach(card => {
            const productId = card.dataset.id;
            const product = ALL_PRODUCTS.find(p => p.id === productId);
            if (product) {
                card.style.backgroundImage = `url('${product.image}')`;
                card.addEventListener('click', () => {
                    window.openModal(product);
                });
            }
        });
    }

    // Handle search
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResultsContainer = document.getElementById('search-results');

        if (!searchInput || typeof ALL_PRODUCTS === 'undefined') return;

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            searchResultsContainer.innerHTML = '';
            if (query.length === 0) {
                searchResultsContainer.style.display = 'none';
                return;
            }
            const filteredProducts = ALL_PRODUCTS.filter(product =>
                product.title.toLowerCase().includes(query)
            );
            searchResultsContainer.style.display = 'block';

            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const itemLink = document.createElement('a');
                    itemLink.href = "#";
                    itemLink.classList.add('result-item');
                    itemLink.innerHTML = `<img src="${product.image}" alt="${product.title}"><div class="result-item-info"><h4>${product.title}</h4><p>${product.shortDescription}</p></div>`;
                    itemLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.openModal(product);
                        searchInput.value = '';
                        searchResultsContainer.style.display = 'none';
                        siteHeader.classList.remove('search-active');
                    });
                    searchResultsContainer.appendChild(itemLink);
                });
            } else {
                searchResultsContainer.innerHTML = '<div class="no-results">Không tìm thấy kết quả nào.</div>';
            }
        });
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResultsContainer.contains(e.target)) {
                searchResultsContainer.style.display = 'none';
            }
        });
    }

    // Bill showcase slider with inertia and auto-scroll
    function setupBillSlider() {
        const slider = document.querySelector('.bill-section');
        if (!slider) return;

        let isDown = false;
        let startX, scrollLeft, velocity = 0, lastPos = 0, lastTime = 0;
        let animationFrameId, autoScrollInterval, idleTimer;
        let wasDragged = false;
        const FRICTION = 0.95;
        const MIN_VELOCITY = 0.5;
        const IDLE_TIMEOUT = 1500;

        const stopAutoScroll = () => { clearInterval(autoScrollInterval); clearTimeout(idleTimer); };

        // ===== THAY ĐỔI LOGIC TỰ ĐỘNG CUỘN Ở ĐÂY =====
        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                // Kiểm tra nếu đã cuộn đến cuối (với 1px sai số)
                if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1) {
                    stopAutoScroll(); // Dừng lại khi đến ảnh cuối
                } else {
                    slider.scrollLeft += 0.5; // Nếu chưa, tiếp tục cuộn
                }
            }, 30);
        };
        // ===== KẾT THÚC THAY ĐỔI =====

        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(startAutoScroll, IDLE_TIMEOUT);
        };

        const dragStart = (e) => {
            isDown = true;
            wasDragged = false;
            slider.classList.add('active');
            startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            velocity = 0;
            lastTime = Date.now();
            lastPos = startX;
            cancelAnimationFrame(animationFrameId);
            stopAutoScroll();
        };

        const dragEnd = () => {
            if (!isDown) return;
            isDown = false;
            slider.classList.remove('active');
            animationFrameId = requestAnimationFrame(inertiaLoop);
            resetIdleTimer(); // Khi người dùng ngưng tương tác, hẹn giờ để tự động cuộn lại
        };

        const dragMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            const walk = x - startX;
            if (Math.abs(walk) > 10) wasDragged = true;
            slider.scrollLeft = scrollLeft - walk;

            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            if (deltaTime > 0) {
                velocity = (lastPos - x) / deltaTime * 16.67;
                lastPos = x;
                lastTime = currentTime;
            }
        };

        const inertiaLoop = () => {
            slider.scrollLeft += velocity;
            velocity *= FRICTION;
            if (Math.abs(velocity) > MIN_VELOCITY) {
                animationFrameId = requestAnimationFrame(inertiaLoop);
            }
        };

        slider.addEventListener('mousedown', dragStart);
        slider.addEventListener('mouseleave', dragEnd);
        slider.addEventListener('mouseup', dragEnd);
        slider.addEventListener('mousemove', dragMove);

        slider.addEventListener('touchstart', dragStart, { passive: false });
        slider.addEventListener('touchend', dragEnd);
        slider.addEventListener('touchmove', dragMove, { passive: false });

        document.querySelectorAll('.bill-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (wasDragged) return;
                window.openImageModal(item.querySelector('img').src, item);
            });
        });

        startAutoScroll();
    }

    // Animated elements on scroll
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .section-title');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // Accordion for FAQ inside modal
    function initFaqAccordion() {
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

    // Check for hash in URL to open modal on page load
    function checkUrlForModal() {
        const hash = window.location.hash;
        if (hash.startsWith('#show-')) {
            const productId = hash.replace('#show-', '');
            const product = ALL_PRODUCTS.find(p => p.id === productId);
            if (product) {
                setTimeout(() => { // Timeout to ensure page is fully rendered
                    window.openModal(product);
                }, 100);
            }
        }
    }

    // Initialize all functionalities
    setupGlobalComponents();
    setupModal();
    renderProductCards();
    setupSearch();
    setupBillSlider();
    setupScrollAnimations();
    checkUrlForModal();
});