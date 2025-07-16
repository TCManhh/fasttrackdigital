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
            initFaqAccordion();
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

    // ===== LOGIC MỚI CHO BILL SLIDER SỬ DỤNG CSS ANIMATION =====
    function setupBillSlider() {
        const slider = document.querySelector('.bill-section');
        const container = document.querySelector('.bill-container');
        if (!slider || !container) return;

        let isDown = false;
        let startX;
        let scrollLeft;
        let wasDragged = false;
        let idleTimer;

        // Hàm khởi tạo hoặc reset animation
        const initAnimation = () => {
            // Tính toán khoảng cách cần di chuyển
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            const travelDistance = scrollWidth - clientWidth;

            // Nếu không có gì để cuộn, thì dừng lại
            if (travelDistance <= 0) return;

            // Tốc độ (pixels per second)
            const speed = 100; // Thay đổi số này để nhanh hơn hoặc chậm hơn
            const duration = travelDistance / speed;

            // Tạo và chèn Keyframes vào trang
            const styleSheet = document.createElement("style");
            const keyframes = `
                @keyframes scrollAnimation {
                    from { transform: translateX(0); }
                    to { transform: translateX(-${travelDistance}px); }
                }`;
            styleSheet.innerText = keyframes;
            document.head.appendChild(styleSheet);

            // Áp dụng animation
            container.style.animationDuration = `${duration}s`;
            container.classList.add('is-animating');
        };

        const handleInteractionStart = (e) => {
            isDown = true;
            wasDragged = false;
            container.classList.add('is-paused'); // Tạm dừng animation
            startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            // Lấy vị trí transform hiện tại để kéo từ đó
            const transformMatrix = window.getComputedStyle(container).getPropertyValue('transform');
            if (transformMatrix !== 'none') {
                scrollLeft = parseInt(transformMatrix.split(',')[4], 10);
            } else {
                scrollLeft = 0;
            }
        };

        const handleInteractionEnd = () => {
            isDown = false;
            // Bật lại animation sau 2 giây không tương tác
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                container.classList.remove('is-paused');
            }, 2000);
        };

        const handleInteractionMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            wasDragged = true;
            const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            const walk = (x - startX);
            const newPos = scrollLeft + walk;

            // Giới hạn không cho kéo quá
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            const maxScroll = -(scrollWidth - clientWidth);

            container.style.transform = `translateX(${Math.max(maxScroll, Math.min(0, newPos))}px)`;
        };

        // Chờ tất cả mọi thứ load xong mới chạy để đảm bảo tính toán đúng
        window.addEventListener('load', () => {
            // Nhân đôi nội dung để tạo hiệu ứng lướt vô tận
            const originalItems = container.innerHTML;
            container.innerHTML += originalItems;

            initAnimation();
        });

        slider.addEventListener('mousedown', handleInteractionStart);
        slider.addEventListener('mouseup', handleInteractionEnd);
        slider.addEventListener('mouseleave', handleInteractionEnd);
        slider.addEventListener('mousemove', handleInteractionMove);

        slider.addEventListener('touchstart', handleInteractionStart, { passive: false });
        slider.addEventListener('touchend', handleInteractionEnd);
        slider.addEventListener('touchmove', handleInteractionMove, { passive: false });

        document.querySelectorAll('.bill-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Chỉ mở popup nếu người dùng không kéo
                if (wasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    window.openImageModal(item.querySelector('img').src, item);
                }
            });
        });
    }


    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .section-title');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-visible');
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

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

    function checkUrlForModal() {
        const hash = window.location.hash;
        if (hash.startsWith('#show-')) {
            const productId = hash.replace('#show-', '');
            const product = ALL_PRODUCTS.find(p => p.id === productId);
            if (product) {
                setTimeout(() => {
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