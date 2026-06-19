import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, limit } from 'firebase/firestore';

async function getFeaturedVendors() {
  try {
    const vendorsRef = collection(db, 'vendors');
    const q = query(vendorsRef, limit(4));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const vendors = await getFeaturedVendors();

  return (
    <>
      {/* Announcement Bar */}
      <div className="announce-bar">
        <div className="announce-track" id="annTrack">
          <span><i className="fa-solid fa-shield-halved"></i> 100% Hàng Chính Hãng — Cam Kết Hoàn Tiền</span>
          <span><i className="fa-solid fa-truck-fast"></i> Giao Hàng Toàn Quốc Trong 24–48h</span>
          <span><i className="fa-solid fa-star"></i> 50.000+ Khách Hàng Hài Lòng Trên Toàn Quốc</span>
          <span><i className="fa-solid fa-handshake"></i> Hơn 120 Thương Hiệu Uy Tín Được Xác Thực</span>
          <span><i className="fa-solid fa-shield-halved"></i> 100% Hàng Chính Hãng — Cam Kết Hoàn Tiền</span>
          <span><i className="fa-solid fa-truck-fast"></i> Giao Hàng Toàn Quốc Trong 24–48h</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <img src="/logo_kimbao.png" alt="Kim Bảo" style={{ height: '44px', width: 'auto', display: 'block', objectFit: 'contain' }} />
            KBC<span>LAZA</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/products">Sản Phẩm <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i></Link></li>
            <li><Link href="#how">Cách Thức</Link></li>
            <li><Link href="/products" style={{ color: 'var(--accent)' }}>Flash Sale <i className="fa-solid fa-bolt" style={{ fontSize: '11px' }}></i></Link></li>
            <li><Link href="#footer">Về Chúng Tôi</Link></li>
          </ul>
          <div className="nav-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm thương hiệu, sản phẩm..." />
          </div>
          <div className="nav-actions">
            <Link href="#" title="Yêu thích"><i className="fa-regular fa-heart"></i></Link>
            <Link href="/login" title="Đăng nhập tài khoản">
                <i className="fa-regular fa-user"></i>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-label"><i className="fa-solid fa-certificate"></i> Nền Tảng Xác Thực Hàng Việt</div>
          <h1>KBC<span>LAZA</span></h1>
          <p className="hero-desc">Sàn thương mại tập hợp những thương hiệu Việt Nam uy tín nhất — từ lụa tơ tằm thủ công đến thực phẩm hữu cơ, mỹ phẩm thiên nhiên và thủ công mỹ nghệ truyền thống. Mua hàng chuẩn gốc, không lo hàng giả.</p>
          <div className="hero-cta-row">
            <Link href="#dynamic-vendors" className="btn-primary">
              <i className="fa-solid fa-cart-shopping"></i> Khám Phá Cửa Hàng
            </Link>
            <Link href="#how" className="btn-outline">Tìm Hiểu Cách Thức</Link>
          </div>
          <div className="hero-trust">
            <div className="trust-pill"><i className="fa-solid fa-check-circle"></i> 120+ Thương hiệu</div>
            <div className="trust-pill"><i className="fa-solid fa-check-circle"></i> Hoàn tiền 30 ngày</div>
            <div className="trust-pill"><i className="fa-solid fa-check-circle"></i> Giao hàng nhanh</div>
          </div>
        </div>
      </section>

      {/* Dynamic Vendors Section (Firebase Integration) */}
      <section id="dynamic-vendors" className="why-section" style={{ background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header">
            <div className="section-label">Thương Hiệu Nổi Bật</div>
            <h2 className="section-title">Khám Phá Các Cửa Hàng <em>Tuyệt Vời Nhất</em></h2>
            <p className="section-subtitle">Dữ liệu được tự động tải trực tiếp từ cơ sở dữ liệu Firebase của KBCLaza.</p>
          </div>
          
          {vendors.length > 0 ? (
            <div className="why-grid">
              {vendors.map((vendor) => (
                <Link href={`/${vendor.id}`} key={vendor.id} className="why-card block group">
                  <div className="why-icon" style={{ backgroundImage: `url(${vendor.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '150px', borderRadius: '12px' }}></div>
                  <h3 className="group-hover:text-[#1a6b3a] transition-colors">{vendor.name}</h3>
                  <p>{vendor.description || 'Cửa hàng chính hãng trên hệ thống KBCLaza.'}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">Chưa có cửa hàng nào trên hệ thống.</p>
              <Link href="/api/seed" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                Tạo Dữ Liệu Mẫu Tự Động
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Strip */}
      <div className="proof-strip">
        <div className="proof-inner">
          <div className="proof-stat"><span className="num">50K+</span><div className="label">Khách Hàng Tin Tưởng</div></div>
          <div className="proof-divider"></div>
          <div className="proof-stat"><span className="num">120+</span><div className="label">Thương Hiệu Xác Thực</div></div>
          <div className="proof-divider"></div>
          <div className="proof-stat"><span className="num">98%</span><div className="label">Tỉ Lệ Hài Lòng</div></div>
          <div className="proof-divider"></div>
          <div className="proof-stat"><span className="num">24h</span><div className="label">Giao Hàng Nội Thành</div></div>
          <div className="proof-divider"></div>
          <div className="proof-stat"><span className="num">30</span><div className="label">Ngày Hoàn Tiền</div></div>
        </div>
      </div>

      {/* Why Us */}
      <section className="why-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header">
            <div className="section-label">Cam Kết Của Chúng Tôi</div>
            <h2 className="section-title">67% Sàn TMĐT Không Kiểm Tra Nguồn Gốc.<br /><em>KBCLAZA Thì Khác.</em></h2>
            <p className="section-subtitle">Mỗi thương hiệu trên KBCLAZA đều trải qua quy trình xác thực nghiêm ngặt trước khi được niêm yết.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
              <h3>Xác Thực Nguồn Gốc</h3>
              <p>Mỗi sản phẩm đều có chứng nhận xuất xứ rõ ràng. Không hàng nhái, không hàng kém chất lượng.</p>
            </div>
            <div className="why-card">
              <div className="why-icon"><i className="fa-solid fa-hands-holding"></i></div>
              <h3>Hỗ Trợ Thương Hiệu Việt</h3>
              <p>Chúng tôi ưu tiên và phát triển các thương hiệu thủ công, truyền thống Việt Nam.</p>
            </div>
            <div className="why-card">
              <div className="why-icon"><i className="fa-solid fa-rotate-left"></i></div>
              <h3>Đổi Trả Miễn Phí</h3>
              <p>30 ngày đổi trả không cần lý do. Mua hàng an tâm, không rủi ro tài chính.</p>
            </div>
            <div className="why-card">
              <div className="why-icon"><i className="fa-solid fa-headset"></i></div>
              <h3>Hỗ Trợ 24/7</h3>
              <p>Đội ngũ tư vấn chuyên sâu luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-wave-container">
          <svg className="footer-wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(255, 255, 255, 0.4)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(148, 163, 184, 0.15)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(13, 21, 39, 0.25)" />
              <use href="#gentle-wave" x="48" y="7" fill="#0d1527" />
            </g>
          </svg>
        </div>
        
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-col brand-col">
              <div style={{ marginBottom: '12px' }}>
                <img src="/logo_kimbao.png" alt="Kim Bảo" style={{ width: '100px', height: '100px', objectFit: 'contain', display: 'block' }} />
              </div>
              <div className="kbc-brand-title">KIM BẢO</div>
              <p className="kbc-tagline">Tinh Hoa Bản Sắc<br />Nâng Tầm Trải Nghiệm</p>
            </div>
            
            {/* Contact Column */}
            <div className="footer-col">
              <h4>Thông tin liên hệ</h4>
              <ul className="contact-list">
                <li><i className="fa-solid fa-phone icon-contact"></i> <span>0975937976</span></li>
                <li><i className="fa-solid fa-envelope icon-contact"></i> <span>services.kimbaokbc@gmail.com</span></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copy">&copy; 2026 KBCLAZA. Tất cả quyền được bảo lưu.</div>
          </div>
        </div>
      </footer>
    </>
  );
}
