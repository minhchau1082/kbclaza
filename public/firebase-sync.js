// ============================================================
// firebase-sync.js - Đồng bộ dữ liệu giữa Admin và Landing Page
// Version: 8 - Fix: chặn ảnh base64 làm treo API
// ============================================================

// Lọc bỏ ảnh base64 khỏi danh sách (chỉ giữ URL thật)
function stripBase64Images(jsonStr) {
    try {
        const arr = JSON.parse(jsonStr);
        if (!Array.isArray(arr)) return jsonStr;
        const cleaned = arr.map(item => {
            const newItem = Object.assign({}, item);
            if (newItem.img && typeof newItem.img === 'string' && newItem.img.startsWith('data:image')) {
                newItem.img = ''; // Xóa base64 - chỉ lưu URL
            }
            return newItem;
        });
        return JSON.stringify(cleaned);
    } catch (e) {
        return jsonStr; // Trả về nguyên bản nếu parse lỗi
    }
}

// Hàm tải dữ liệu từ API về localStorage khi vào trang
async function loadDataFromFirebase() {
    try {
        const response = await fetch('/api/sync');
        if (!response.ok) {
            console.error('API sync failed:', response.status);
            // Vẫn render với dữ liệu localStorage cục bộ
            _callRenderFunctions();
            return;
        }
        
        const result = await response.json();
        const allData = result.data || {};
        
        const keys = ['kbclaza_custom_products', 'kbclaza_categories', 'kbclaza_enterprises', 'kbclaza_orders', 'kbclaza_deleted_products'];
        let needToPush = false;

        for (const key of keys) {
            const serverData = allData[key];
            const localData = localStorage.getItem(key);
            
            const isServerEmpty = !serverData || serverData === '[]' || serverData === '{}';
            const isLocalEmpty = !localData || localData === '[]' || localData === '{}';

            if (!isServerEmpty) {
                // Server có dữ liệu -> cập nhật local (dùng originalSetItem để không trigger lại POST)
                originalSetItem.call(localStorage, key, serverData);
            } else if (!isLocalEmpty) {
                // Server trống nhưng local có dữ liệu -> đẩy lên server
                needToPush = true;
            }
        }

        if (needToPush) {
            console.log('Pushing local data to server...');
            for (const key of keys) {
                const localVal = localStorage.getItem(key);
                if (localVal && localVal !== '[]' && localVal !== '{}') {
                    // Lọc base64 trước khi đẩy lên server
                    const cleanVal = (key === 'kbclaza_enterprises' || key === 'kbclaza_custom_products')
                        ? stripBase64Images(localVal)
                        : localVal;
                    
                    await fetch('/api/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ key, data: cleanVal })
                    }).catch(e => console.error('Error pushing ' + key + ':', e));
                }
            }
        }

        console.log('API sync complete.');
        _callRenderFunctions();
        
    } catch (e) {
        console.error('Loi dong bo API:', e);
        // Vẫn render với dữ liệu localStorage cục bộ dù API lỗi
        _callRenderFunctions();
    }
}

// Gọi tất cả các hàm render tùy theo trang
function _callRenderFunctions() {
    // Landing page
    if (typeof reloadProductsData === 'function') reloadProductsData();
    else if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderEnterprises === 'function') renderEnterprises();
    
    // Admin page
    if (typeof renderAdminProducts === 'function') renderAdminProducts();
    if (typeof renderAdminCategories === 'function') renderAdminCategories();
    if (typeof renderAdminOrders === 'function') renderAdminOrders();
}

// Chặn localStorage.setItem để đồng bộ ngược lên API
// QUAN TRỌNG: Phải khai báo trước khi trang dùng localStorage
const originalSetItem = localStorage.setItem.bind(localStorage);
localStorage.setItem = function(key, value) {
    // Vẫn lưu local bình thường
    originalSetItem(key, value);

    try {
        // Chỉ sync các key quan trọng, không sync base64 lớn
        const syncKeys = ['kbclaza_custom_products', 'kbclaza_categories', 'kbclaza_enterprises', 'kbclaza_orders', 'kbclaza_deleted_products'];
        if (syncKeys.includes(key)) {
            // Lọc bỏ base64 trước khi gửi lên server
            const cleanValue = (key === 'kbclaza_enterprises' || key === 'kbclaza_custom_products')
                ? stripBase64Images(value)
                : value;
            
            fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, data: cleanValue })
            }).catch(e => console.error('Loi POST API:', e));
        }
    } catch (e) {
        console.error('Loi goi API luu:', e);
    }
};

// Khi trang vừa load xong, tiến hành tải dữ liệu lần đầu
window.addEventListener('DOMContentLoaded', () => {
    loadDataFromFirebase();
    // Tự động tải lại mỗi 8 giây (đồng bộ thời gian thực)
    setInterval(loadDataFromFirebase, 8000);
});
