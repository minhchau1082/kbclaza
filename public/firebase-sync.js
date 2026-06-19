// Hàm tải dữ liệu từ API về localStorage khi vào trang
async function loadDataFromFirebase() {
    try {
        console.log("Syncing from API...");
        
        const response = await fetch('/api/sync');
        if (response.ok) {
            const result = await response.json();
            const allData = result.data || {};
            
            const keys = ['kbclaza_custom_products', 'kbclaza_categories', 'kbclaza_enterprises', 'kbclaza_orders', 'kbclaza_deleted_products'];
            let needToPush = false;

            for (const key of keys) {
                const serverData = allData[key];
                const localData = localStorage.getItem(key);
                
                let isServerEmpty = !serverData || serverData === '[]' || serverData === '{}';
                let isLocalEmpty = !localData || localData === '[]' || localData === '{}';

                if (!isServerEmpty) {
                    // Server has real data -> update local
                    originalSetItem.call(localStorage, key, serverData);
                } else if (!isLocalEmpty) {
                    // Server is empty but local has data -> push to server
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
        
        // Admin functions
        if (typeof renderAdminProducts === 'function') renderAdminProducts();
        if (typeof renderAdminCategories === 'function') renderAdminCategories();
        if (typeof renderAdminOrders === 'function') renderAdminOrders();
        
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
