document.addEventListener('DOMContentLoaded', function () {
    const siteHeader = document.querySelector('.site-header');

    // --- GLOBAL COMPONENTS LOGIC (HEADER, CATEGORY MENU) ---
    function setupGlobalComponents() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mainNav = document.querySelector('.main-nav');
        const mobileSearchIcon = document.querySelector('.mobile-search-icon');
        const categoryTrigger = document.getElementById('category-trigger');
        const categoryOverlay = document.getElementById('category-overlay');
        const categoryMenu = document.getElementById('category-menu');
        const categoryCloseBtn = document.getElementById('category-close-btn');

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mainNav.classList.toggle('is-open'));
        if (mobileSearchIcon) mobileSearchIcon.addEventListener('click', () => siteHeader.classList.toggle('search-active'));

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

        // Redirect with hash for category links
        if (categoryMenu) {
            categoryMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetUrl = this.href;
                    window.location.href = targetUrl;
                });
            });
        }
    }

    // --- FAQ PAGE SPECIFIC LOGIC ---
    function setupFaqPage() {
        const navContainer = document.querySelector('.faq-nav');
        const articles = document.querySelectorAll('.faq-article');
        const faqImages = document.querySelectorAll('.faq-article ol img');

        // Tab navigation
        if (navContainer) {
            navContainer.addEventListener('click', function (e) {
                const clickedLink = e.target.closest('.faq-nav-link');
                if (!clickedLink) return;
                e.preventDefault();

                const targetId = clickedLink.getAttribute('href');
                const targetArticle = document.querySelector(targetId);

                navContainer.querySelectorAll('.faq-nav-link').forEach(link => link.classList.remove('active'));
                articles.forEach(article => article.classList.remove('active'));

                clickedLink.classList.add('active');
                if (targetArticle) targetArticle.classList.add('active');
            });
        }

        // Image pop-up
        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalCloseBtn = modal.querySelector('.modal-close');
        const modalImage = document.getElementById('modal-image');

        const openImageModal = (imgSrc) => {
            if (modalImage) modalImage.src = imgSrc;
            if (siteHeader) siteHeader.classList.add('is-hidden');
            modal.classList.add('active', 'image-view');
            modalOverlay.classList.add('active');
            document.body.classList.add('modal-open');
        };

        const closeImageModal = () => {
            if (siteHeader) siteHeader.classList.remove('is-hidden');
            modal.classList.remove('active', 'image-view');
            modalOverlay.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeImageModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeImageModal);

        faqImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openImageModal(img.src);
            });
        });
    }

    // --- SEARCH LOGIC (Redirect to index.html with search query) ---
    function setupSearchRedirect() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        // For simplicity, we just redirect. A more advanced solution would use query params.
                        window.location.href = `index.html`;
                    }
                }
            });
        }
    }

    // Initialize all functionalities
    setupGlobalComponents();
    setupFaqPage();
    setupSearchRedirect();
});