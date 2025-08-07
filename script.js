document.addEventListener("DOMContentLoaded", () => {
    // Các biến querySelector nên được khai báo ở đầu để dễ quản lý
    const siteHeader = document.querySelector(".site-header");
    const modal = document.querySelector(".modal");
    const modalOverlay = document.querySelector(".modal-overlay");
    const modalClose = document.querySelector(".modal-close");
    const modalImage = document.getElementById("modal-image");
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("search-input");
    const searchOverlayInput = document.getElementById("search-overlay-input");
    const overlaySearchResults = document.getElementById("overlay-search-results");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const desktopSearchTrigger = document.getElementById("desktop-search-trigger");
    const mobileSearchTrigger = document.getElementById("mobile-search-trigger");
    const avatarImage = document.getElementById("avatar-image");
    const avatarPopup = document.getElementById("avatar-popup");
    const avatarPopupImg = document.getElementById("avatar-popup-img");
    const avatarPopupClose = document.querySelector(".avatar-popup-close");

    // =========================================================================================
    // HÀM CHÍNH - Bắt đầu thực thi sau khi DOM đã sẵn sàng
    // =========================================================================================

    // Hàm mở pop-up/modal
    const openModal = () => {
        if (modal && modalOverlay) {
            siteHeader.classList.add("is-hidden"); // Thay đổi layout
            modal.classList.add("active"); // Thay đổi layout
            modalOverlay.classList.add("active"); // Thay đổi layout
            document.body.classList.add("modal-open"); // Thay đổi layout
            document.dispatchEvent(new CustomEvent("modalHasOpened"));
        }
    };

    // Hàm đóng pop-up/modal
    const closeModal = () => {
        if (modal && modalOverlay) {
            siteHeader.classList.remove("is-hidden"); // Thay đổi layout
            modal.classList.remove("active"); // Thay đổi layout
            modalOverlay.classList.remove("active"); // Thay đổi layout
            document.body.classList.remove("modal-open"); // Thay đổi layout
            setTimeout(() => {
                modal.classList.remove("image-view"); // Thay đổi layout
            }, 400);
            document.dispatchEvent(new CustomEvent("modalHasClosed"));
        }
    };

    // Hàm hiển thị chi tiết dịch vụ trong modal
    async function showServiceDetails(serviceId) {
        try {
            const { serviceData } = await import('./service-data.js');
            const data = serviceData[serviceId];
            if (data) {
                modal.classList.remove("image-view"); // Thay đổi layout
                document.getElementById("modal-title").textContent = data.title;
                document.getElementById("modal-headline").innerHTML = data.headline;
                document.getElementById("modal-text").innerHTML = data.text;
                modalImage.src = data.img || '';
                openModal();
                setupFaqToggle(); // Kích hoạt FAQ accordion trong modal
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu dịch vụ:", error);
        }
    }

    // Hàm xử lý tìm kiếm
    let searchTimeout;
    const handleSearch = async (event) => {
        const query = event.target.value.toLowerCase().trim();
        const quickLinks = document.querySelector('.search-quick-links');

        overlaySearchResults.innerHTML = '';
        if (quickLinks) {
            quickLinks.style.display = query.length > 0 ? 'none' : 'block';
        }

        if (query.length < 2) {
            overlaySearchResults.style.display = 'none';
            return;
        }

        try {
            const { serviceData } = await import('./service-data.js');
            const results = Object.keys(serviceData)
                .map(key => ({ id: key, ...serviceData[key] }))
                .filter(item => {
                    const headline = item.headline.toLowerCase().replace(/<[^>]*>?/gm, '');
                    const text = item.text.toLowerCase().replace(/<[^>]*>?/gm, '');
                    return headline.includes(query) || text.includes(query);
                });

            if (results.length > 0) {
                overlaySearchResults.style.display = 'block';
                results.forEach(item => {
                    const resultElement = document.createElement('div');
                    resultElement.className = 'result-item';
                    resultElement.innerHTML = `
                        <img src="${item.searchImg || './images/logo11.png'}" alt="${item.title}" loading="lazy">
                        <div class="result-item-info">
                            <h4>${item.headline.replace(/<[^>]*>?/gm, '')}</h4>
                            <p>${item.title}</p>
                        </div>`;
                    resultElement.addEventListener('click', () => {
                        closeSearchOverlay();
                        setTimeout(() => showServiceDetails(item.id), 400);
                    });
                    overlaySearchResults.appendChild(resultElement);
                });
            } else {
                overlaySearchResults.style.display = 'none';
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        }
    };

    if (searchOverlayInput) {
        searchOverlayInput.addEventListener('input', (event) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(event);
            }, 150);
        });
    }

    // Hàm mở và đóng lớp phủ tìm kiếm
    const openSearchOverlay = (e) => {
        if (e) e.preventDefault();
        searchOverlay.classList.add('active'); // Thay đổi layout
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchOverlayInput.focus(), 400);
    };

    const closeSearchOverlay = () => {
        searchOverlay.classList.remove('active'); // Thay đổi layout
        document.body.style.overflow = '';
        searchOverlayInput.value = '';
        overlaySearchResults.innerHTML = '';
        const quickLinks = document.querySelector('.search-quick-links');
        if (quickLinks) {
            quickLinks.style.display = 'block';
        }
    };

    // Hàm xử lý FAQ accordion
    function setupFaqToggle() {
        const faqContainer = modal.querySelector('.faq-container');
        if (faqContainer) {
            faqContainer.addEventListener('click', function(event) {
                const question = event.target.closest('.faq-question');
                if (!question) return;

                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');

                // Đóng tất cả các câu trả lời khác
                this.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
                this.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);

                // Mở câu trả lời được click (nếu nó chưa mở)
                if (!isActive) {
                    question.classList.add('active'); // Thay đổi layout
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    }

    // =========================================================================================
    // SỰ KIỆN - Gán các sự kiện sau khi trang đã tải xong
    // =========================================================================================
    function attachEventListeners() {
        // Sự kiện cho modal
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        if (modal) modal.addEventListener('click', (e) => {
            // Ngăn việc đóng modal khi click vào nội dung bên trong
            if (e.target.closest('.modal-content')) {
                e.stopPropagation();
            }
        });

        // Sự kiện click vào thẻ dịch vụ
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.dataset.id;
                if (serviceId) showServiceDetails(serviceId);
            });
        });

        // Sự kiện cho thanh tìm kiếm
        if (desktopSearchTrigger) desktopSearchTrigger.addEventListener('click', openSearchOverlay);
        if (mobileSearchTrigger) mobileSearchTrigger.addEventListener('click', openSearchOverlay);
        if (searchInput) searchInput.addEventListener('click', openSearchOverlay);
        if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchOverlay);
        if (searchOverlay) searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearchOverlay();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearchOverlay();
            }
        });
        
        // Sự kiện cho gợi ý nhanh trong tìm kiếm
        const quickLinksContainer = document.querySelector('.search-quick-links');
        if (quickLinksContainer) {
            quickLinksContainer.addEventListener('click', e => {
                const link = e.target.closest('a');
                const serviceId = link ? link.dataset.id : null;
                if(serviceId) {
                    e.preventDefault();
                    closeSearchOverlay();
                    setTimeout(() => showServiceDetails(serviceId), 400);
                }
            });
        }

        // Sự kiện cho popup avatar
        if (avatarImage && avatarPopup && avatarPopupImg && avatarPopupClose) {
            avatarImage.addEventListener('click', () => {
                const src = avatarImage.getAttribute('src');
                avatarPopupImg.setAttribute('src', src);
                avatarPopup.classList.add('show'); // Thay đổi layout
            });
            avatarPopupClose.addEventListener('click', () => {
                avatarPopup.classList.remove('show'); // Thay đổi layout
            });
            avatarPopup.addEventListener('click', (e) => {
                if(e.target.id === 'avatar-popup') {
                    avatarPopup.classList.remove('show'); // Thay đổi layout
                }
            });
        }
        
        // Sự kiện cho menu danh mục (Category)
        const categoryTrigger = document.getElementById('category-trigger');
        const categoryOverlay = document.getElementById('category-overlay');
        const categoryMenu = document.getElementById('category-menu');
        const categoryCloseBtn = document.getElementById('category-close-btn');

        const openCategoryMenu = () => {
            siteHeader.classList.add('is-hidden'); // Thay đổi layout
            categoryOverlay.classList.add('active'); // Thay đổi layout
            categoryMenu.classList.add('active'); // Thay đổi layout
            document.body.classList.add('modal-open'); // Thay đổi layout
        };
        const closeCategoryMenu = () => {
            siteHeader.classList.remove('is-hidden'); // Thay đổi layout
            categoryOverlay.classList.remove('active'); // Thay đổi layout
            categoryMenu.classList.remove('active'); // Thay đổi layout
            document.body.classList.remove('modal-open'); // Thay đổi layout
        };

        if(categoryTrigger) categoryTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCategoryMenu();
        });
        if(categoryOverlay) categoryOverlay.addEventListener('click', closeCategoryMenu);
        if(categoryCloseBtn) categoryCloseBtn.addEventListener('click', closeCategoryMenu);
        if(categoryMenu) categoryMenu.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if(!link) return;
            const serviceId = link.dataset.id;

            if (serviceId) {
                e.preventDefault();
                closeCategoryMenu();
                setTimeout(() => showServiceDetails(serviceId), 50);
            } else {
                 closeCategoryMenu();
            }
        });
        
        // Sự kiện cho menu hamburger trên mobile
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mainNav = document.querySelector('.main-nav');
        if (hamburgerBtn && mainNav) {
            hamburgerBtn.addEventListener('click', () => {
                mainNav.classList.toggle('is-open'); // Thay đổi layout
            });
             mainNav.addEventListener('click', (e) => {
                if (e.target.closest('a')) {
                    mainNav.classList.remove('is-open'); // Thay đổi layout
                }
            });
        }

        // Xử lý scroll mượt cho các link anchor
        document.querySelectorAll('a[href^="#"]:not(.faq-nav-link)').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href').length <= 1) return;
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // =========================================================================================
    // CÁC HÀM KHỞI TẠO - Chỉ chạy khi trang đã tải xong hoàn toàn
    // =========================================================================================
    
    // Hàm này sẽ được bao bọc trong sự kiện "load"
    function initializeLayoutDependentScripts() {
        // Hiệu ứng lazy load cho các phần tử
        const lazyElements = document.querySelectorAll('.card, .section-title, .owner-profile');
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible'); // Thay đổi layout
                    lazyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        lazyElements.forEach(el => lazyObserver.observe(el));

        // Hàm xử lý nút copy link trong FAQ
        function setupFaqLinkSharing() {
            const copyButtons = document.querySelectorAll('.copy-faq-btn');
            copyButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const targetId = button.dataset.targetId;
                    const url = `${window.location.origin}${window.location.pathname}`;
                    const shareLink = `${url}#${targetId}`;
                    navigator.clipboard.writeText(shareLink).then(() => {
                        const originalText = button.innerText;
                        button.innerText = 'Đã chép link!';
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.innerText = originalText;
                            button.classList.remove('copied');
                        }, 2500);
                    }).catch(err => {
                        console.error('Lỗi sao chép link: ', err);
                        alert('Không thể sao chép liên kết. Vui lòng thử lại.');
                    });
                });
            });
        }
        
        // Hàm điều hướng cho trang FAQ
        function setupFaqNavigation(hash) {
            if(!hash || hash.length <= 1) return;

            const navContainer = document.querySelector('.faq-nav');
            const contentContainer = document.querySelector('.faq-content');
            if(!navContainer || !contentContainer) return;
            
            const targetArticle = contentContainer.querySelector(hash);
            const targetLink = navContainer.querySelector(`.faq-nav-link[href="${hash}"]`);

            if(targetArticle && targetLink) {
                // Xóa active class cũ
                navContainer.querySelector('.active')?.classList.remove('active');
                contentContainer.querySelector('.active')?.classList.remove('active');
                // Thêm active class mới
                targetLink.classList.add('active');
                targetArticle.classList.add('active');

                // Cuộn tới mục được chọn
                 setTimeout(() => {
                    targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }

        function handleFaqPage() {
            const faqNav = document.querySelector('.faq-nav');
            const faqContent = document.querySelector('.faq-content');

            if (faqNav && faqContent) {
                // Xử lý click vào menu điều hướng
                faqNav.addEventListener('click', function(e) {
                    const link = e.target.closest('.faq-nav-link');
                    if (!link) return;
                    e.preventDefault();
                    const hash = link.getAttribute('href');
                    if (window.history.pushState) {
                        window.history.pushState(null, null, hash);
                    } else {
                        window.location.hash = hash;
                    }
                    setupFaqNavigation(hash);
                });
                
                // Xử lý click vào ảnh trong bài viết FAQ để xem lớn
                faqContent.addEventListener('click', e => {
                    if (e.target.tagName === 'IMG' && e.target.closest('.faq-article')) {
                        e.stopPropagation();
                        if (modal && modalImage) {
                           modal.classList.add('image-view');
                           modalImage.src = e.target.src;
                           openModal();
                        }
                    }
                });

                setupFaqLinkSharing();

                // Kiểm tra hash ban đầu khi tải trang
                if (window.location.hash) {
                    setupFaqNavigation(window.location.hash);
                }

                // Lắng nghe sự kiện thay đổi hash (nút back/forward)
                window.addEventListener('popstate', () => {
                     if (window.location.pathname.includes("faq.html") && window.location.hash) {
                        setupFaqNavigation(window.location.hash);
                    }
                });
            }
        }

        // Hàm khởi tạo carousel hóa đơn
        function initializeBillCarousel() {
            const track = document.querySelector(".bill-carousel-track");
            if (!track) return;
            
            const slider = document.querySelector(".bill-slider");
            const counter = document.querySelector(".bill-counter");
            const bills = [
                { src: "./images_bill_thanh_toan/0329DSMQZL.webp", alt: "Bill 46" }, { src: "./images_bill_thanh_toan/0327DSMQZL.webp", alt: "Bill 45" },
                { src: "./images_bill_thanh_toan/0326YTVTFB.webp", alt: "Bill 44" }, { src: "./images_bill_thanh_toan/0326YTNCFB.webp", alt: "Bill 43" },
                { src: "./images_bill_thanh_toan/0323YTTLFB.webp", alt: "Bill 42" }, { src: "./images_bill_thanh_toan/0319YTTVFB.webp", alt: "Bill 41" },
                { src: "./images_bill_thanh_toan/0319YTQVFB.webp", alt: "Bill 40" }, { src: "./images_bill_thanh_toan/0319YTMTFB.webp", alt: "Bill 39" },
                { src: "./images_bill_thanh_toan/0318YTVQFB.webp", alt: "Bill 38" }, { src: "./images_bill_thanh_toan/0318YTTHZL.webp", alt: "Bill 37" },
                { src: "./images_bill_thanh_toan/0317YTTHFB.webp", alt: "Bill 36" }, { src: "./images_bill_thanh_toan/0317YTDHFB.webp", alt: "Bill 35" },
                { src: "./images_bill_thanh_toan/0316YTMĐFB.webp", alt: "Bill 34" }, { src: "./images_bill_thanh_toan/0316YTBĐFB.webp", alt: "Bill 33" },
                { src: "./images_bill_thanh_toan/0315YTTHFB.webp", alt: "Bill 32" }, { src: "./images_bill_thanh_toan/0315YTNTFB.webp", alt: "Bill 31" },
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

            // Render initial bills
            bills.slice(0, 5).forEach(bill => {
                const item = document.createElement("div");
                item.className = "bill-carousel-item";
                const img = document.createElement("img");
                img.src = bill.src;
                img.alt = bill.alt;
                img.loading = 'lazy';
                item.appendChild(img);
                track.appendChild(item);
            });
            
            let items = Array.from(track.children);
            if (items.length <= 1) return;

            let currentIndex = 0;
            let autoScrollInterval;

            function loadMoreBills(index) {
                if(index < bills.length && index >= items.length) {
                    for(let i=items.length; i <= index; i++) {
                        if (!bills[i]) continue;
                        const bill = bills[i];
                        const item = document.createElement("div");
                        item.className = "bill-carousel-item";
                        const img = document.createElement("img");
                        img.src = bill.src;
                        img.alt = bill.alt;
                        img.loading = 'lazy';
                        item.appendChild(img);
                        track.appendChild(item);
                    }
                    items = Array.from(track.children);
                }
            }

            function updateCarousel(index) {
                if (index < 0 || index >= bills.length) return;
                loadMoreBills(index);
                
                const targetItem = items[index];
                if (targetItem) {
                    const scrollOffset = (track.clientWidth - targetItem.clientWidth) / 2;
                    const targetScroll = targetItem.offsetLeft - scrollOffset;
                    track.scrollTo({ left: targetScroll, behavior: "smooth" });
                    currentIndex = index;
                    updateSliderAndCounter(index);
                    items.forEach((item, i) => item.classList.toggle("active", i === index));
                }
                 loadMoreBills(index + 5); // Tải trước 5 ảnh tiếp theo
            }
            
             function updateSliderAndCounter(index) {
                if(slider) {
                    slider.value = index;
                    const progress = bills.length > 1 ? (index / (bills.length - 1)) * 100 : 0;
                    slider.style.setProperty('--progress', `${progress}%`);
                }
                if (counter) {
                    counter.textContent = `${index + 1} / ${bills.length}`;
                }
            }

            function startAutoScroll() {
                stopAutoScroll();
                autoScrollInterval = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % bills.length;
                    updateCarousel(nextIndex);
                }, 2000);
            }

            function stopAutoScroll() {
                clearInterval(autoScrollInterval);
            }

            let scrollTimeout;
            track.addEventListener("scroll", () => {
                stopAutoScroll();
                window.clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Tìm item ở giữa
                    const trackRect = track.getBoundingClientRect();
                    const trackCenter = trackRect.left + trackRect.width / 2;
                    let closestIndex = -1;
                    let minDistance = Infinity;

                    items.forEach((item, index) => {
                        const itemRect = item.getBoundingClientRect();
                        const itemCenter = itemRect.left + itemRect.width / 2;
                        const distance = Math.abs(itemCenter - trackCenter);

                        if(distance < minDistance) {
                            minDistance = distance;
                            closestIndex = index;
                        }
                    });

                    if (closestIndex !== -1 && currentIndex !== closestIndex) {
                        updateCarousel(closestIndex);
                    }
                    startAutoScroll();
                }, 150);
            });

            if (slider) {
                slider.max = bills.length - 1;
                slider.addEventListener("input", () => {
                    stopAutoScroll();
                    updateCarousel(parseInt(slider.value, 10));
                });
                 slider.addEventListener("change", startAutoScroll);
            }
            
             track.addEventListener("click", e => {
                const img = e.target.closest(".bill-carousel-item img");
                if (img) {
                    modal.classList.add('image-view');
                    modalImage.src = img.src;
                    openModal();
                }
            });

            document.addEventListener("modalHasOpened", stopAutoScroll);
            document.addEventListener("modalHasClosed", startAutoScroll);

            // Căn chỉnh padding cho carousel để item đầu tiên vào giữa
            const firstItem = items[0];
            if (firstItem) {
                const padding = (track.clientWidth - firstItem.clientWidth) / 2;
                track.style.paddingLeft = `${padding}px`;
                track.style.paddingRight = `${padding}px`;
            }
            
            // Khởi tạo carousel
            setTimeout(() => {
                updateCarousel(0);
                startAutoScroll();
            }, 100);
        }

        // Hàm xử lý header khi cuộn
        function handleHeaderScroll() {
            if (siteHeader) {
                window.addEventListener("scroll", () => {
                    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollPos > 20) {
                        siteHeader.classList.add("scrolled");
                    } else {
                        siteHeader.classList.remove("scrolled");
                    }
                });
            }
        }
        
        // Hàm cập nhật link active trên thanh điều hướng khi cuộn
        function updateActiveNavOnScroll() {
             const navLinks = document.querySelectorAll('.main-nav a[href*="#"]');
             const homeLink = document.querySelector('.main-nav a[href="index.html"]');
             const sections = Array.from(navLinks).map(link => {
                const id = link.getAttribute('href').split('#')[1];
                if (id) return document.getElementById(id);
             }).filter(Boolean); // Lọc bỏ các giá trị null/undefined

             if (sections.length === 0) return;
             
             const observer = new IntersectionObserver((entries) => {
                let isAnySectionVisible = false;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isAnySectionVisible = true;
                        const id = entry.target.getAttribute('id');
                        document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active-page'));
                        const activeLink = document.querySelector(`.main-nav a[href*="#${id}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active-page');
                        }
                    }
                });
                
                // Nếu không có section nào active và đang ở đầu trang, active Trang Chủ
                if (!isAnySectionVisible && window.scrollY < sections[0].offsetTop - 150) {
                     document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active-page'));
                     if (homeLink) homeLink.classList.add('active-page');
                }

            }, { rootMargin: "-150px 0px -50% 0px" });

            sections.forEach(section => observer.observe(section));
        }

        // Hàm bộ lọc dịch vụ
        function setupServiceFilter() {
            const filterButtons = document.querySelectorAll(".filter-btn");
            const cards = document.querySelectorAll(".card");
            if(filterButtons.length && cards.length) {
                 filterButtons.forEach(button => {
                    button.addEventListener("click", () => {
                        document.querySelector(".filter-btn.active").classList.remove("active");
                        button.classList.add("active");
                        const filter = button.dataset.filter;
                        cards.forEach(card => {
                            const category = card.dataset.category;
                            if (filter === "all" || filter === category) {
                                card.classList.remove("hide");
                            } else {
                                card.classList.add("hide");
                            }
                        });
                    });
                });
            }
        }

        // Chạy các hàm khởi tạo
        setupServiceFilter();
        handleHeaderScroll();
        updateActiveNavOnScroll();
        
        // Chỉ khởi tạo carousel và trang FAQ nếu các phần tử tương ứng tồn tại
        if (document.querySelector(".bill-showcase")) {
            initializeBillCarousel();
        }
        if (document.querySelector(".pricing-grid")) {
             document.querySelector(".pricing-grid").addEventListener('click', e => {
                const card = e.target.closest('.price-card');
                if (card) {
                    const serviceId = card.dataset.id;
                    if(serviceId) showServiceDetails(serviceId);
                }
            });
        }
        handleFaqPage();
    }

    // =========================================================================================
    // TRÌNH TỰ THỰC THI
    // =========================================================================================
    attachEventListeners(); // Gán các sự kiện không phụ thuộc vào layout trước
    
    // 🔥 Sử dụng window.addEventListener("load", ...) để trì hoãn các tác vụ thay đổi layout
    window.addEventListener("load", function () {
        initializeLayoutDependentScripts();
    });
});