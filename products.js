const ALL_PRODUCTS = [
    {
        id: 'yt-premium',
        title: 'Fast Track - Dịch Vụ Premium Giá Rẻ',
        headline: "Nâng Cấp <span style='color: #FF0000;'>YouTube Premium</span> - Tặng Kèm <span style='color: #FF0000;'>YouTube Music Premium</span>",
        shortDescription: 'Xem video không quảng cáo, phát trong nền.',
        image: './images/card-1.png',
        detailsHTML: `
            <div class='packages-container'>
                <div class='package-option recommended'>
                    <div class='package-header'>
                        <h3 class='package-title'>Gói Nâng Cấp Chính Chủ</h3>
                        <p class='package-price'>40.000đ<span class='price-unit'> / tháng</span></p>
                    </div>
                    <p class='package-description'>Sử dụng Gmail cá nhân của bạn, ổn định và an toàn. Chỉ cần cung cấp email, không cần mật khẩu.</p>
                    <ul class='package-features'>
                        <li>Bảo mật 100%</li>
                        <li>Không giới hạn thiết bị</li>
                        <li>Hỗ trợ gia hạn hàng tháng</li>
                    </ul>
                </div>
                <div class='package-option'>
                    <div class='package-header'>
                        <h3 class='package-title'>Gói Thuê Tài Khoản</h3>
                        <p class='package-price'>35.000đ<span class='price-unit'> / tháng</span></p>
                    </div>
                    <p class='package-description'>Shop sẽ cấp tài khoản có sẵn Premium. Tiết kiệm chi phí, sử dụng đầy đủ tính năng.</p>
                    <ul class='package-features'>
                        <li>Giới hạn 3 thiết bị</li>
                        <li>Hỗ trợ gia hạn hàng tháng</li>
                    </ul>
                </div>
                <div class='package-option'>
                    <div class='package-header'>
                        <h3 class='package-title'>Gói YouTube TV</h3>
                        <p class='package-price'>20.000đ<span class='price-unit'> / tháng</span></p>
                    </div>
                    <p class='package-description'>Tài khoản do shop cấp, chuyên dùng cho Smart TV và TV Box, tối ưu chi phí.</p>
                    <ul class='package-features'>
                        <li>Giới hạn đăng nhập trên 5 TV</li>
                        <li>Hỗ trợ gia hạn hàng tháng</li>
                    </ul>
                </div>
            </div>
            <div class='purchase-section'>
                <p class='purchase-note'>💡 <strong>Lưu ý:</strong> Giá trên là đơn giá theo tháng. Mua nhiều tháng chỉ cần nhân đơn giá với số tháng mong muốn.</p>
                <a href='https://zalo.me/0978879931' class='btn-contact-buy'>Liên hệ để mua ngay</a>
            </div>
            <div class='modal-full-width-wrapper'>
                <div class='modal-benefits-section'>
                    <h3 style='color: #c00;'>🔥 Lợi ích khi sử dụng YouTube Premium</h3>
                    <ul style='list-style: none; padding: 0; line-height: 1.7;'>
                        <li style='margin-bottom: 12px; display: flex; align-items: flex-start;'><span style='margin-right: 10px; font-size: 18px;'>✅</span><div><strong>Xem video không quảng cáo:</strong> Tận hưởng trải nghiệm xem video mượt mà, không bị gián đoạn bởi bất kỳ quảng cáo nào.</div></li>
                        <li style='margin-bottom: 12px; display: flex; align-items: flex-start;'><span style='margin-right: 10px; font-size: 18px;'>✅</span><div><strong>Phát nền khi tắt màn hình:</strong> Nghe nhạc, podcast khi dùng ứng dụng khác hoặc tắt màn hình.</div></li>
                        <li style='margin-bottom: 12px; display: flex; align-items: flex-start;'><span style='margin-right: 10px; font-size: 18px;'>✅</span><div><strong>Tải video xem offline:</strong> Tải video, playlist yêu thích để xem lại mọi lúc mọi nơi, kể cả khi không có mạng.</div></li>
                        <li style='margin-bottom: 12px; display: flex; align-items: flex-start;'><span style='margin-right: 10px; font-size: 18px;'>✅</span><div><strong>YouTube Music Premium MIỄN PHÍ:</strong> Truy cập kho nhạc khổng lồ không quảng cáo, nghe nhạc nền, tải nhạc offline.</div></li>
                         <li style='margin-bottom: 12px; display: flex; align-items: flex-start;'><span style='margin-right: 10px; font-size: 18px;'>✅</span><div><strong>Xem miễn phí YouTube Originals:</strong> Thưởng thức các bộ phim, chương trình độc quyền từ những nhà sáng tạo hàng đầu.</div></li>
                    </ul>
                </div>
                <div class='modal-faq-section'>
                    <h3>❓ CÂU HỎI THƯỜNG GẶP (FAQ)</h3>
                    <div class='faq-container'>
                        <div class='faq-item'>
                            <button class='faq-question'>1. Tôi sẽ sử dụng tài khoản của mình hay của shop?</button>
                            <div class='faq-answer'><p>→ <strong>Gói chính chủ:</strong> bạn dùng tài khoản Gmail của mình. Shop chỉ gửi link mời vào Family.<br>→ <strong>Gói thuê:</strong> Shop cấp tài khoản riêng biệt.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>2. Sau khi thanh toán, tôi cần làm gì?</button>
                            <div class='faq-answer'><p>→ Shop sẽ gửi link mời vào Family qua Gmail. Bạn chỉ cần bấm vào link và đồng ý tham gia là dùng được ngay.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>3. Có thể gia hạn gói dịch vụ không?</button>
                            <div class='faq-answer'><p>→ Có. Shop sẽ nhắc bạn trước khi hết hạn qua email hoặc Zalo. Hoặc bạn có thể chủ động liên hệ để gia hạn.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>4. Nếu tôi vào nhầm tài khoản Google thì sao?</button>
                            <div class='faq-answer'><p>→ Liên hệ shop ngay để được hỗ trợ đổi lại tài khoản nếu link chưa dùng.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>5. Một tài khoản sử dụng được bao nhiêu thiết bị?</button>
                            <div class='faq-answer'><p>→ <strong>Gói chính chủ:</strong> Không giới hạn số lượng thiết bị.<br>→ <strong>Gói thuê tài khoản:</strong> Tối đa 3 thiết bị đồng thời.<br>→ <strong>Gói YouTube TV:</strong> Tối đa 3 TV đồng thời.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>6. Thông tin cá nhân có bị lộ khi vào Family không?</button>
                            <div class='faq-answer'><p>→ Tuyệt đối không. Các thành viên Family không thể nhìn thấy thông tin của nhau, theo đúng điều khoản bảo mật của Google.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>7. Tài khoản ở nước ngoài có tham gia được không?</button>
                            <div class='faq-answer'><p>→ Có thể, nhưng bạn cần liên hệ để shop hỗ trợ chuyển vùng phù hợp.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>8. Tôi có thể dùng email công ty, trường học (G-suite) không?</button>
                            <div class='faq-answer'><p>→ Không. Bạn nên sử dụng Gmail cá nhân vì tài khoản G-suite thường bị hạn chế, không thể tham gia Family.</p></div>
                        </div>
                        <div class='faq-item'>
                            <button class='faq-question'>9. Thời gian sử dụng dịch vụ được tính từ khi nào?</button>
                            <div class='faq-answer'><p>→ Thời gian bắt đầu được tính từ thời điểm bạn tham gia thành công vào Family, không phải lúc bạn thanh toán.</p></div>
                        </div>
                    </div>
                </div>
            </div>`
    },
    {
        id: 'netflix',
        title: 'Tài khoản Netflix Premium UHD 4K',
        headline: "Xem phim bom tấn không giới hạn",
        shortDescription: 'Xem phim và chương trình TV bản quyền.',
        image: 'https://i.ibb.co/L6v9v04/netflix-3.png',
        detailsHTML: `<p>Nội dung chi tiết cho Netflix đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.</p><div class='purchase-section'><a href='https://zalo.me/0978879931' class='btn-contact-buy'>Liên hệ để mua ngay</a></div>`
    },
    {
        id: 'spotify-premium',
        title: 'Spotify Premium Family',
        headline: "Thế giới âm nhạc trong tay bạn",
        shortDescription: 'Nghe nhạc chất lượng cao không giới hạn.',
        image: 'https://i.ibb.co/tYHk9cK/spotify-1.png',
        detailsHTML: `<p>Nội dung chi tiết cho Spotify đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.</p><div class='purchase-section'><a href='https://zalo.me/0978879931' class='btn-contact-buy'>Liên hệ để mua ngay</a></div>`
    },
    {
        id: 'service-4',
        title: 'Dịch vụ 4',
        headline: "Mô tả cho dịch vụ 4",
        shortDescription: 'Mô tả ngắn dịch vụ 4',
        image: 'https://images.unsplash.com/photo-1526726538640-74390e763b51?q=80&w=2070',
        detailsHTML: `<p>Nội dung chi tiết cho dịch vụ này đang được cập nhật.</p>`
    },
    {
        id: 'service-5',
        title: 'Dịch vụ 5',
        headline: "Mô tả cho dịch vụ 5",
        shortDescription: 'Mô tả ngắn dịch vụ 5',
        image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070',
        detailsHTML: `<p>Nội dung chi tiết cho dịch vụ này đang được cập nhật.</p>`
    },
    {
        id: 'service-6',
        title: 'Dịch vụ 6',
        headline: "Mô tả cho dịch vụ 6",
        shortDescription: 'Mô tả ngắn dịch vụ 6',
        image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1912',
        detailsHTML: `<p>Nội dung chi tiết cho dịch vụ này đang được cập nhật.</p>`
    }
];