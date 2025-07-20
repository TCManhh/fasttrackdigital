// Products data for Fast Track Digital
const products = [
    // YouTube Premium products
    {
        category: 'youtube',
        name: 'YouTube Premium 1 Tháng',
        price: '25,000',
        originalPrice: '59,000',
        description: 'Trải nghiệm YouTube không quảng cáo',
        features: ['Không quảng cáo', 'Nghe nền', 'Tải video offline']
    },
    {
        category: 'youtube',
        name: 'YouTube Premium 3 Tháng',
        price: '70,000',
        originalPrice: '177,000',
        description: 'Tiết kiệm hơn với gói 3 tháng',
        features: ['Không quảng cáo', 'Nghe nền', 'Tải video offline']
    },
    // Spotify products
    {
        category: 'spotify',
        name: 'Spotify Premium 1 Tháng',
        price: '30,000',
        originalPrice: '59,000',
        description: 'Nghe nhạc chất lượng cao không giới hạn',
        features: ['Chất lượng cao', 'Không quảng cáo', 'Tải nhạc offline']
    },
    // Netflix products
    {
        category: 'netflix',
        name: 'Netflix Premium 1 Tháng',
        price: '120,000',
        originalPrice: '260,000',
        description: 'Xem phim 4K không giới hạn',
        features: ['4K Ultra HD', '4 màn hình cùng lúc', 'Tải phim offline']
    }
];

// Function to filter products by category
function getProductsByCategory(category) {
    if (!category || category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Function to render products
function renderProducts(productsToRender = products) {
    const productContainer = document.querySelector('.product-grid');
    if (!productContainer) return;
    
    productContainer.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-header">
                <h3>${product.name}</h3>
                <div class="price-container">
                    <span class="current-price">${product.price}đ</span>
                    <span class="original-price">${product.originalPrice}đ</span>
                </div>
            </div>
            <p class="product-description">${product.description}</p>
            <ul class="product-features">
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="order-btn" onclick="openOrderModal('${product.name}')">Đặt hàng ngay</button>
        </div>
    `).join('');
}

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page with products
    if (document.querySelector('.product-grid')) {
        renderProducts();
        
        // Add category filter functionality
        const categoryLinks = document.querySelectorAll('[data-category]');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                const filteredProducts = getProductsByCategory(category);
                renderProducts(filteredProducts);
                
                // Update active state
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, getProductsByCategory, renderProducts };
}