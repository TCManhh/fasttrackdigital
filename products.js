// File: products.js

const ALL_PRODUCTS = [
    {
        id: 'yt-premium', // ID duy nhất để xác định sản phẩm
        title: 'Nâng Cấp YouTube Premium - Tặng Kèm YouTube Music Premium',
        shortDescription: 'Xem video không quảng cáo, phát trong nền.',
        image: './images/card-1.png', // Đường dẫn đến ảnh đại diện
        cardSelector: '.card-1' // Selector để liên kết với card trên trang chính
    },
    {
        id: 'spotify-premium',
        title: 'Spotify Premium Family',
        shortDescription: 'Nghe nhạc chất lượng cao không giới hạn.',
        image: 'https://i.ibb.co/tYHk9cK/spotify-1.png',
        cardSelector: '.card-3'
    },
    {
        id: 'netflix',
        title: 'Tài khoản Netflix Premium UHD 4K',
        shortDescription: 'Xem phim và chương trình TV bản quyền.',
        image: 'https://i.ibb.co/L6v9v04/netflix-3.png',
        cardSelector: '.card-2' // Giả sử card-2 là Netflix
    }
    // ... bạn có thể thêm các sản phẩm khác vào đây theo cấu trúc tương tự
];