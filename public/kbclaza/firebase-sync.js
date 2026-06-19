// Hàm tải dữ liệu từ API về localStorage khi vào trang
async function loadDataFromFirebase() {
    try {
        console.log("Syncing from API...");
        
        const response = await fetch('/api/sync');
        if (response.ok) {
            const result = await response.json();
            const allData = result.data || {};
            
            const keys = ['kbclaza_custom_products', 'kbclaza_categories', 'kbclaza_enterprises', 'kbclaza_orders'];
            let needToPush = false;

            for (const key of keys) {
                if (allData[key]) {
                    // Cập nhật local nếu API có dữ liệu
                    originalSetItem.call(localStorage, key, allData[key]);
                } else if (localStorage.getItem(key)) {
                    // API trống nhưng local có dữ liệu -> Đẩy lên API
                    needToPush = true;
                }
            }

            if (needToPush) {
                console.log("Pushing local data to API...");
                for (const key of keys) {
                    if (localStorage.getItem(key)) {
                        await fetch('/api/sync', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key, data: localStorage.getItem(key) })
                        }).catch(e => console.error("Error pushing:", e));
                    }
                }
            }
        }

        // Gọi lại các hàm render của HTML nếu có để cập nhật giao diện
        if (typeof renderProducts === 'function') renderProducts();
        if (typeof renderCategories === 'function') renderCategories();
        if (typeof renderEnterprises === 'function') renderEnterprises();
        
        console.log("API sync complete.");
    } catch (e) {
        console.error("Lỗi đồng bộ API:", e);
    }
}

// Chặn localStorage.setItem để đồng bộ ngược lên API
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments); // Vẫn lưu local bình thường

    try {
        if (['kbclaza_custom_products', 'kbclaza_categories', 'kbclaza_enterprises', 'kbclaza_orders'].includes(key)) {
            fetch('/api/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ key, data: value })
            }).catch(e => console.error("Lỗi POST API:", e));
        }
    } catch (e) {
        console.error("Lỗi gọi API lưu:", e);
    }
};

// Khi trang vừa load xong, tiến hành tải dữ liệu
window.addEventListener('DOMContentLoaded', () => {
    loadDataFromFirebase();
});
