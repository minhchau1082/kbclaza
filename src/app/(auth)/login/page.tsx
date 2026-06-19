'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('develop.kimbaokbc@gmail.com');
    const [password, setPassword] = useState('develop.kimbaokbc');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    // Typewriter state
    const [headingText, setHeadingText] = useState('');
    const [descText, setDescText] = useState('');
    const [isCursorVisible, setIsCursorVisible] = useState(true);

    const headingWords = ["chính hãng.", "uy tín.", "độc bản.", "chất lượng."];
    const fullDescText = "Chúng tôi kết nối trực tiếp người tiêu dùng tới các thương hiệu, làng nghề truyền thống uy tín nhất Việt Nam, mang đến trải nghiệm mua sắm an tâm tuyệt đối với sản phẩm xác thực nguồn gốc.";

    useEffect(() => {
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;
        let headingTimeout: NodeJS.Timeout;

        const typeHeading = () => {
            const currentWord = headingWords[wordIndex];
            
            if (isDeleting) {
                setHeadingText(currentWord.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setHeadingText(currentWord.substring(0, charIndex + 1));
                charIndex++;
            }
            
            typeSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % headingWords.length;
                typeSpeed = 400;
            }
            headingTimeout = setTimeout(typeHeading, typeSpeed);
        };

        headingTimeout = setTimeout(typeHeading, 500);

        return () => clearTimeout(headingTimeout);
    }, []);

    useEffect(() => {
        let descCharIndex = 0;
        let descTimeout: NodeJS.Timeout;

        const typeDescription = () => {
            if (descCharIndex < fullDescText.length) {
                setDescText(fullDescText.substring(0, descCharIndex + 1));
                descCharIndex++;
                descTimeout = setTimeout(typeDescription, 35);
            } else {
                setTimeout(() => {
                    setIsCursorVisible(false);
                }, 5000);
            }
        };

        descTimeout = setTimeout(typeDescription, 1000);
        return () => clearTimeout(descTimeout);
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const emailStr = email.trim().toLowerCase();
        
        try {
            if (isRegistering) {
                // Register logic
                const userCredential = await createUserWithEmailAndPassword(auth, emailStr, password);
                const user = userCredential.user;
                
                // Save to Firestore 'users' collection
                await setDoc(doc(db, 'users', user.uid), {
                    email: emailStr,
                    role: 'Khách hàng',
                    status: 'Đang hoạt động',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('justLoggedIn', 'true');
                window.location.href = '/products.html';
                
            } else {
                // Mock logic from original HTML
                if (emailStr === 'admin@kbclaza.com' && password === '123456') {
                    localStorage.setItem('isAdminLoggedIn', 'true');
                    localStorage.removeItem('currentEnterpriseId');
                    window.location.href = '/admin.html';
                    return;
                } else if (password === '123456') { // Mock enterprise
                    localStorage.setItem('isAdminLoggedIn', 'enterprise');
                    localStorage.setItem('currentEnterpriseId', emailStr);
                    window.location.href = '/admin.html';
                    return;
                }
                
                // Firebase Auth Login
                try {
                    await signInWithEmailAndPassword(auth, emailStr, password);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('justLoggedIn', 'true');
                    window.location.href = '/products.html';
                } catch (fbError: any) {
                    // If firebase auth fails but it's mock login
                    if (emailStr && password) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('justLoggedIn', 'true');
                        window.location.href = '/products.html';
                    }
                }
            }
            
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email này đã được đăng ký. Vui lòng đăng nhập.');
            } else if (err.code === 'auth/weak-password') {
                setError('Mật khẩu quá yếu, vui lòng chọn mật khẩu từ 6 ký tự.');
            } else {
                setError(isRegistering ? 'Đăng ký thất bại. Vui lòng thử lại.' : 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Save to Firestore 'users' collection
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: user.displayName,
                role: 'Khách hàng',
                status: 'Đang hoạt động',
                updatedAt: new Date().toISOString()
            }, { merge: true });
            
            // DEMO: Lưu vào localStorage để Admin Dashboard đọc được (vì admin mock không có quyền đọc Firestore)
            const mockUser = {
                id: user.uid,
                email: user.email,
                name: user.displayName,
                role: 'Khách hàng',
                status: 'Đang hoạt động',
                phone: user.phoneNumber || ''
            };
            const existingUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const userIndex = existingUsers.findIndex((u: any) => u.email === user.email);
            if (userIndex >= 0) {
                existingUsers[userIndex] = mockUser;
            } else {
                existingUsers.push(mockUser);
            }
            localStorage.setItem('mock_users', JSON.stringify(existingUsers));
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('justLoggedIn', 'true');
            window.location.href = '/products.html';
        } catch (err: any) {
            console.error(err);
            setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
            <div className="login-fullscreen-container">
                {/* Left Panel */}
                <div className="login-left-panel">
                    <a href="/" className="back-to-home">
                        <i className="fa-solid fa-arrow-left"></i> Quay lại cửa hàng
                    </a>
                    
                    <div className="kbc-logo-header">
                        <div className="kbc-logo-img">
                            <img src="/logo_kimbao.png" alt="Kim Bảo" style={{height: '56px', width: 'auto', display: 'block', objectFit: 'contain'}} />
                        </div>
                        <div className="kbc-logo-text">
                            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--primary)'}}>Việt<span style={{color: 'var(--accent)'}}>Shop</span></h3>
                            <p>Nền tảng xác thực hàng Việt</p>
                        </div>
                    </div>
                    
                    <h1 className="kbc-heading">Nơi hội tụ sản phẩm Việt <span className="typing-highlight">{headingText}</span><span className="cursor-blink">|</span></h1>
                    <p className="kbc-description"><span id="desc-typewriter">{descText}</span><span className="cursor-blink desc-cursor" style={{display: isCursorVisible ? 'inline' : 'none'}}>|</span></p>
                    
                    <div className="kbc-stats-grid">
                        <div className="kbc-stat-card">
                            <div className="kbc-stat-icon"><i className="fa-solid fa-shield-halved"></i></div>
                            <div>
                                <span className="kbc-stat-label">Thương Hiệu Việt</span>
                                <span className="kbc-stat-value">120+</span>
                            </div>
                        </div>
                        <div className="kbc-stat-card">
                            <div className="kbc-stat-icon"><i className="fa-solid fa-users"></i></div>
                            <div>
                                <span className="kbc-stat-label">Khách Hàng Tin Dùng</span>
                                <span className="kbc-stat-value">50K+</span>
                            </div>
                        </div>
                        <div className="kbc-stat-card">
                            <div className="kbc-stat-icon"><i className="fa-solid fa-star"></i></div>
                            <div>
                                <span className="kbc-stat-label">Tỉ Lệ Hài Lòng</span>
                                <span className="kbc-stat-value">98%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="kbc-features-list">
                        <div className="kbc-feature-item">
                            <div className="kbc-feat-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
                            <div>
                                <h4>Sản Phẩm Độc Bản & Truyền Thống</h4>
                                <p>Tìm kiếm, tuyển chọn và giới thiệu những mặt hàng đậm đà bản sắc địa phương, có giá trị văn hóa cao.</p>
                            </div>
                        </div>
                        <div className="kbc-feature-item">
                            <div className="kbc-feat-icon"><i className="fa-solid fa-circle-check"></i></div>
                            <div>
                                <h4>Cam Kết Chính Hãng & Xác Thực</h4>
                                <p>Mỗi sản phẩm, gian hàng xuất hiện trên KBCLAZA đều được xác minh rõ ràng về nguồn gốc xuất xứ và kiểm định chất lượng.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Panel */}
                <div className="login-right-panel">
                    <div className="login-card">
                        <h2>{isRegistering ? 'Tạo tài khoản mới' : 'Chào mừng trở lại'}</h2>
                        <p className="login-subtext">{isRegistering ? 'Đăng ký tài khoản để mua sắm và bán hàng' : 'Đăng nhập để tiếp tục khám phá tinh hoa hàng Việt'}</p>
                        
                        {error && <div style={{color: 'red', marginBottom: '15px', fontSize: '13px', textAlign: 'center'}}>{error}</div>}
                        
                        <form onSubmit={handleLoginSubmit}>
                            <div className="input-group">
                                <label>Tài khoản / Email <span className="required">*</span></label>
                                <div className="input-wrapper">
                                    <i className="fa-regular fa-envelope icon-left"></i>
                                    <input 
                                        type="email" 
                                        placeholder="admin@kbclaza.com hoặc email..." 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Mật khẩu <span className="required">*</span></label>
                                <div className="input-wrapper">
                                    <i className="fa-solid fa-lock icon-left"></i>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••" 
                                        required 
                                    />
                                    <i 
                                        className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} icon-right`} 
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>
                            {!isRegistering && <div className="forgot-pw"><a href="#" onClick={(e) => {e.preventDefault(); alert('Tính năng khôi phục mật khẩu đang được phát triển!');}}>Quên mật khẩu?</a></div>}
                            
                            <button type="submit" className="btn-signin" disabled={isLoading} style={{marginTop: isRegistering ? '20px' : '0'}}>
                                {isLoading ? 'Đang xử lý...' : (isRegistering ? 'Đăng Ký Ngay' : 'Đăng Nhập')}
                            </button>
                            
                            <div className="login-divider"><span>hoặc</span></div>
                            
                            <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={isLoading}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" /> Đăng nhập với Google
                            </button>
                        </form>
                        <div className="signup-link">
                            {isRegistering ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
                            <a href="#" onClick={(e) => {e.preventDefault(); setIsRegistering(!isRegistering); setError('');}}>
                                {isRegistering ? 'Đăng nhập' : 'Đăng ký miễn phí'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    );
}
