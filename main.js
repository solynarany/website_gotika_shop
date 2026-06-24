// ========== GOTIKA STORE ==========
// Главный JavaScript файл

console.log('=== GOTIKA STORE ===');

// ========== СТИЛИ ДЛЯ КАРТОЧЕК ТОВАРОВ ==========
const style = document.createElement('style');
style.textContent = `
  .product-card {
    background: rgba(30, 40, 50, 0.7);
    border: 1px solid #3a5566;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s;
    max-width: 300px;
    cursor: pointer;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    border-color: #4a9cad;
  }
  
  .product-image {
    height: 200px;
    overflow: hidden;
    position: relative;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .quick-view {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .product-card:hover .quick-view {
    opacity: 1;
  }
  
  .product-info {
    padding: 15px;
  }
  
  .product-info h3 {
    color: #c8e8f8;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  .description {
    color: #8bb0c0;
    font-size: 14px;
    margin-bottom: 15px;
    height: 40px;
    overflow: hidden;
  }
  
  .product-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .price {
    color: #4a9cad;
    font-size: 20px;
    font-weight: bold;
  }
  
  .category {
    background: rgba(74, 156, 173, 0.2);
    color: #6bb8ca;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 15px;
  }
  
  .tag {
    background: rgba(100, 150, 200, 0.15);
    color: #a8d0e0;
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 11px;
  }
  
  .add-to-cart-btn {
    width: 100%;
    padding: 10px;
    background: rgba(74, 156, 173, 0.3);
    border: 1px solid #4a9cad;
    color: #c8e8f8;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .add-to-cart-btn:hover {
    background: rgba(74, 156, 173, 0.5);
  }
`;
document.head.appendChild(style);

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let cart = JSON.parse(localStorage.getItem('gotika-cart')) || [];
let userProfile = JSON.parse(localStorage.getItem('gotika-profile')) || {
    name: '',
    email: '',
    phone: '',
    city: '',
    birthday: '',
    address: '',
    favorites: [],
    orders: []
};
let currentStep = 1;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function getCategoryName(category) {
    const categories = {
        'dresses': 'Платья',
        'corsets': 'Корсеты', 
        'coats': 'Плащи',
        'accessories': 'Аксессуары',
        'shoes': 'Обувь',
        'suits': 'Костюмы'
    };
    return categories[category] || category;
}

function getPaymentMethodName(method) {
    const methods = {
        'card': 'Банковская карта',
        'sbp': 'СБП (Сбербанк)',
        'cash': 'Наличные при получении'
    };
    return methods[method] || method || 'Не указано';
}

function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `GOT-${year}${month}${day}-${random}`;
}

// ========== УВЕДОМЛЕНИЯ ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 60, 75, 0.95);
        color: #c8e8f8;
        padding: 15px 25px;
        border-radius: 8px;
        border: 1px solid #4a9cad;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ТОВАРАМИ ==========
function createProductHTML(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x400/1a2b3c/ffffff?text=GOTIKA'">
                <div class="quick-view">👁️ Быстрый просмотр</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                
                <div class="product-details">
                    <span class="price">${product.price.toLocaleString()} ₽</span>
                    <span class="category">${getCategoryName(product.category)}</span>
                </div>
                
                <div class="product-tags">
                    ${product.tags ? product.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                
                <button class="add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-basket"></i> В корзину
                </button>
            </div>
        </div>
    `;
}

function renderProducts(productsArray = products) {
    const container = document.getElementById('products-container');
    if (!container || !productsArray) return;
    
    container.innerHTML = '';
    
    productsArray.forEach(product => {
        container.innerHTML += createProductHTML(product);
    });
    
    attachProductEventListeners();
}

function attachProductEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) return;
            const productId = parseInt(card.dataset.id);
            openProductModal(productId);
        });
    });
}

// ========== КОРЗИНА ==========
function addToCart(productId) {
    if (typeof products === 'undefined' || !Array.isArray(products)) {
        console.error('❌ Массив products не загружен!');
        showNotification('Ошибка: товары не загружены');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('❌ Товар с ID', productId, 'не найден');
        showNotification('Товар не найден');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('gotika-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showNotification(`"${product.name}" добавлен в корзину`);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cart-total-items');
    
    if (cartTotalElement) cartTotalElement.textContent = totalItems;
    if (cartElement) cartElement.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #8bb0c0;">
                <i class="fas fa-shopping-basket" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>Корзина пуста</p>
                <p style="font-size: 12px; margin-top: 10px;">Добавьте товары из каталога</p>
            </div>
        `;
        if (cartTotalElement) cartTotalElement.textContent = '0 ₽';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const imageUrl = item.image || 'https://via.placeholder.com/60x60/1a2b3c/ffffff?text=GOTIKA';
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}" style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid rgba(58, 102, 115, 0.3);">
                <img src="${imageUrl}" alt="${item.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;"
                     onerror="this.src='https://via.placeholder.com/60x60/1a2b3c/ffffff?text=GOTIKA'">
                <div style="flex: 1;">
                    <div style="color: #c8e8f8; font-weight: bold; margin-bottom: 5px;">${item.name}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="color: #4a9cad; font-weight: bold;">${item.price.toLocaleString()} ₽</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="cart-item-decrease" data-id="${item.id}" 
                                    style="background: rgba(74, 156, 173, 0.2); border: 1px solid #4a9cad; color: #c8e8f8; 
                                           width: 25px; height: 25px; border-radius: 4px; cursor: pointer;">
                                -
                            </button>
                            <span style="color: #c8e8f8; min-width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                            <button class="cart-item-increase" data-id="${item.id}" 
                                    style="background: rgba(74, 156, 173, 0.2); border: 1px solid #4a9cad; color: #c8e8f8; 
                                           width: 25px; height: 25px; border-radius: 4px; cursor: pointer;">
                                +
                            </button>
                            <button class="cart-item-remove" data-id="${item.id}" 
                                    style="background: rgba(200, 60, 60, 0.2); border: 1px solid #c86c6c; color: #e8a8a8; 
                                           padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 10px; font-size: 12px;
                                           display: flex; align-items: center; gap: 5px;">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    if (cartTotalElement) cartTotalElement.textContent = `${total.toLocaleString()} ₽`;
}

function increaseCartItem(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('gotika-cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showNotification(`Добавлен ещё один "${item.name}"`);
    }
}

function decreaseCartItem(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            showNotification(`Убран один "${item.name}" из корзины`);
        } else {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('gotika-cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && confirm(`Удалить "${item.name}" из корзины?`)) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('gotika-cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        showNotification(`"${item.name}" удален из корзины`);
    }
}

function toggleCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    if (sidebar && overlay) {
        const isActive = sidebar.classList.contains('active');
        
        if (isActive) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initCartEventDelegation() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        if (button.classList.contains('cart-item-increase')) {
            e.stopPropagation();
            const productId = parseInt(button.dataset.id);
            increaseCartItem(productId);
        }
        else if (button.classList.contains('cart-item-decrease')) {
            e.stopPropagation();
            const productId = parseInt(button.dataset.id);
            decreaseCartItem(productId);
        }
        else if (button.classList.contains('cart-item-remove')) {
            e.stopPropagation();
            const productId = parseInt(button.dataset.id);
            removeFromCart(productId);
        }
    });
}

function initCart() {
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Очистить всю корзину?')) {
                cart = [];
                localStorage.removeItem('gotika-cart');
                updateCartCount();
                updateCartDisplay();
                showNotification('Корзина очищена!');
            }
        });
    }
    
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCartSidebar);
    }
    
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartSidebar);
    }
    
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCartSidebar);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCartSidebar();
    });
    
    initCartEventDelegation();
    updateCartDisplay();
}

// ========== ФИЛЬТРЫ И НАВИГАЦИЯ ==========
function updateActiveNavLink(category) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    let targetLinkText = '';
    switch(category) {
        case 'dresses': targetLinkText = 'Платья'; break;
        case 'suits': targetLinkText = 'Костюмы'; break;
        case 'shoes': targetLinkText = 'Обувь'; break;
        case 'accessories': targetLinkText = 'Аксессуары'; break;
        case 'contacts': targetLinkText = 'Контакты'; break;
        case 'all':
        default: targetLinkText = 'Коллекции'; break;
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.style.color = '';
        link.style.textShadow = '';
        link.style.transform = '';
    });
    
    navLinks.forEach(link => {
        if (link.textContent.trim() === targetLinkText) {
            link.classList.add('active');
            link.style.color = '#c8e8f8';
            link.style.textShadow = '0 0 10px rgba(74, 156, 173, 0.5)';
            link.style.transform = 'translateY(-2px)';
        }
    });
}

function filterProductsByCategory(category) {
    if (!products || products.length === 0) return;
    
    const container = document.getElementById('products-container');
    if (!container) return;
    
    let filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-moon" style="font-size: 48px; color: #4a9cad; margin-bottom: 20px;"></i>
                <h3 style="color: #c8e8f8; margin-bottom: 10px;">Товары не найдены</h3>
                <p style="color: #8bb0c0;">В этой категории пока нет товаров</p>
            </div>
        `;
    } else {
        filteredProducts.forEach(product => {
            container.innerHTML += createProductHTML(product);
        });
        attachProductEventListeners();
    }
    
    updateActiveNavLink(category);
    
    const categoryNames = {
        'all': 'Все товары',
        'dresses': 'Платья',
        'corsets': 'Корсеты',
        'coats': 'Плащи',
        'suits': 'Костюмы',
        'shoes': 'Обувь',
        'accessories': 'Аксессуары'
    };
    
    showNotification(`Показано: ${categoryNames[category] || category} (${filteredProducts.length} товаров)`);
}

function updateCategoryCounts() {
    if (!products || products.length === 0) return;
    
    const categoryCounts = {
        'all': products.length,
        'dresses': products.filter(p => p.category === 'dresses').length,
        'corsets': products.filter(p => p.category === 'corsets').length,
        'coats': products.filter(p => p.category === 'coats').length,
        'suits': products.filter(p => p.category === 'suits').length,
        'shoes': products.filter(p => p.category === 'shoes').length,
        'accessories': products.filter(p => p.category === 'accessories').length
    };
    
    document.querySelectorAll('.category-filter-btn').forEach(button => {
        const category = button.dataset.category;
        const count = categoryCounts[category] || 0;
        
        let countBadge = button.querySelector('.count-badge');
        if (!countBadge) {
            countBadge = document.createElement('span');
            countBadge.className = 'count-badge';
            button.appendChild(countBadge);
        }
        
        countBadge.textContent = ` (${count})`;
        countBadge.style.cssText = `
            background: rgba(74, 156, 173, 0.2);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
            margin-left: 5px;
            color: #c8e8f8;
        `;
    });
}

function initCategoryFilters() {
    const categoryFilters = document.getElementById('category-filters');
    if (!categoryFilters) return;
    
    const filterButtons = categoryFilters.querySelectorAll('.category-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '';
                btn.style.border = '';
                btn.style.color = '';
                btn.style.boxShadow = '';
            });
            
            this.classList.add('active');
            this.style.background = 'linear-gradient(135deg, rgba(74, 156, 173, 0.8), rgba(58, 120, 140, 0.8))';
            this.style.border = '2px solid #4a9cad';
            this.style.color = '#e8f8ff';
            this.style.boxShadow = '0 0 15px rgba(74, 156, 173, 0.4)';
            
            filterProductsByCategory(category);
        });
    });
    
    updateCategoryCounts();
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collectionSection = document.getElementById('collection');
    
    if (!collectionSection) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterType = button.dataset.filter;
            
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = collectionSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            
            if (filterType === 'all') {
                showNotification('🖤 Вся готическая коллекция');
                collectionSection.style.transition = 'all 0.5s';
                collectionSection.style.boxShadow = '0 0 40px rgba(74, 156, 173, 0.4)';
                setTimeout(() => { collectionSection.style.boxShadow = ''; }, 1500);
            } else if (filterType === 'vampire') {
                showNotification('🧛‍♀️ Погружение в вампирскую эстетику...');
                setTimeout(() => { addVampireEffect(); }, 300);
            }
            
            collectionSection.classList.add('highlight-section');
            setTimeout(() => { collectionSection.classList.remove('highlight-section'); }, 1500);
        });
    });
}

function addVampireEffect() {
    const collectionSection = document.getElementById('collection');
    if (!collectionSection) return;
    
    collectionSection.style.transition = 'all 0.5s ease';
    collectionSection.style.boxShadow = '0 0 50px rgba(255, 0, 0, 0.4)';
    collectionSection.style.backgroundColor = 'rgba(139, 0, 0, 0.05)';
    
    const pulseEffect = document.createElement('div');
    pulseEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255,0,0,0.2) 0%, rgba(139,0,0,0) 70%);
        z-index: -1;
        pointer-events: none;
        animation: vampirePulse 2s ease-out;
        border-radius: 10px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes vampirePulse {
            0% { opacity: 0.8; transform: scale(0.8); }
            50% { opacity: 0.4; transform: scale(1.2); }
            100% { opacity: 0; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
    
    collectionSection.appendChild(pulseEffect);
    
    function createBloodDrop(x, y, delay = 0) {
        setTimeout(() => {
            const drop = document.createElement('div');
            const size = Math.random() * 15 + 10;
            const duration = Math.random() * 0.8 + 0.5;
            
            drop.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size * 1.5}px;
                background: linear-gradient(to bottom, #8b0000, #ff0000, #8b0000);
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                opacity: 0.8;
                z-index: 9999;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                filter: blur(1px);
            `;
            
            document.body.appendChild(drop);
            
            const animation = drop.animate([
                { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 0.8 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg) scale(0.5)`, opacity: 0 }
            ], { duration: duration * 1000, easing: 'cubic-bezier(0.4, 0, 1, 1)' });
            
            animation.onfinish = () => drop.remove();
        }, delay);
    }
    
    for (let i = 0; i < 8; i++) {
        createBloodDrop(Math.random() * window.innerWidth, Math.random() * 100, i * 200);
    }
    
    const title = collectionSection.querySelector('.section-title');
    if (title) {
        title.style.transition = 'all 0.5s';
        title.style.color = '#ff6666';
        title.style.textShadow = '0 0 15px rgba(255, 0, 0, 0.7)';
    }
    
    setTimeout(() => {
        collectionSection.style.boxShadow = '';
        collectionSection.style.backgroundColor = '';
        pulseEffect.remove();
        if (title) {
            title.style.color = '';
            title.style.textShadow = '';
        }
    }, 3000);
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#contacts') {
                e.preventDefault();
                scrollToContacts(e);
            } else if (href === '#collection') {
                e.preventDefault();
                
                let category = 'all';
                const linkText = this.textContent.trim();
                
                if (linkText === 'Платья') category = 'dresses';
                else if (linkText === 'Костюмы') category = 'suits';
                else if (linkText === 'Обувь') category = 'shoes';
                else if (linkText === 'Аксессуары') category = 'accessories';
                
                filterProductsByCategory(category);
                
                const collectionSection = document.getElementById('collection');
                if (collectionSection) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = collectionSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
            
            closeCartSidebar();
        });
    });
}

function initSmoothScrolling() {
    const toCollectionBtn = document.querySelector('.btn-primary[href="#collection"]');
    const catalogBtn = document.querySelector('.hero-actions .btn-secondary');
    const collectionSection = document.getElementById('collection');
    
    if (!collectionSection) return;
    
    function scrollToCollection(e) {
        if (e) e.preventDefault();
        
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = collectionSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        
        collectionSection.classList.add('highlight-section');
        setTimeout(() => { collectionSection.classList.remove('highlight-section'); }, 1500);
        
        showNotification('✨ Переход к коллекции');
        return false;
    }
    
    if (toCollectionBtn) toCollectionBtn.addEventListener('click', scrollToCollection);
    if (catalogBtn) {
        catalogBtn.addEventListener('click', function(e) {
            scrollToCollection(e);
            showNotification('📚 Открыт полный каталог готической одежды');
        });
    }
    
    document.querySelectorAll('.nav-link[href="#collection"]').forEach(link => {
        link.addEventListener('click', scrollToCollection);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchorLink => {
        const href = anchorLink.getAttribute('href');
        if (href === '#' || href === '' || href === '#collection' || href === '#contacts') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            anchorLink.addEventListener('click', function(e) {
                e.preventDefault();
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            });
        }
    });
}

function scrollToContacts(e) {
    if (e) e.preventDefault();
    
    const contactsSection = document.getElementById('contacts');
    if (!contactsSection) return false;
    
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 80;
    const targetPosition = contactsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    updateActiveNavLink('contacts');
    showNotification('📞 Переход к контактам');
    return false;
}

// ========== МОДАЛЬНОЕ ОКНО ТОВАРА ==========
function renderMoonsRating(rating) {
    const fullMoons = Math.floor(rating);
    const hasHalfMoon = rating % 1 >= 0.5;
    const emptyMoons = 5 - fullMoons - (hasHalfMoon ? 1 : 0);
    
    let moonsHTML = '';
    
    for (let i = 0; i < fullMoons; i++) moonsHTML += '<i class="fas fa-moon moon-full"></i>';
    if (hasHalfMoon) moonsHTML += '<i class="fas fa-moon moon-half"></i>';
    for (let i = 0; i < emptyMoons; i++) moonsHTML += '<i class="far fa-moon moon-empty"></i>';
    
    moonsHTML += `<span class="rating-number">${rating.toFixed(1)}</span>`;
    
    return moonsHTML;
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `${product.price.toLocaleString()} ₽`;
    document.getElementById('modal-full-description').textContent = product.detailedDescription || product.description;
    document.getElementById('modal-material').textContent = product.materialDetails || product.material || 'Не указано';
    document.getElementById('modal-care').textContent = product.care || 'Стандартный уход';
    document.getElementById('modal-sizes').textContent = product.sizes ? product.sizes.join(', ') : (product.size ? product.size.join(', ') : 'Не указаны');
    document.getElementById('modal-rating').innerHTML = renderMoonsRating(product.rating || 4.5);
    
    const mainImage = document.getElementById('modal-main-img');
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    const allImages = [product.image, ...(product.additionalImages || [])];
    
    mainImage.src = allImages[0];
    mainImage.alt = product.name;
    
    thumbnailsContainer.innerHTML = '';
    allImages.forEach((imgSrc, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = `Фото ${index + 1}`;
        thumb.addEventListener('click', () => {
            mainImage.src = imgSrc;
            thumbnailsContainer.querySelectorAll('img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        if (index === 0) thumb.classList.add('active');
        thumbnailsContainer.appendChild(thumb);
    });
    
    const reviewsContainer = document.getElementById('modal-reviews');
    if (product.reviews && product.reviews.length > 0) {
        let reviewsHTML = '';
        product.reviews.forEach(review => {
            reviewsHTML += `
                <div class="review-item">
                    <div class="review-header">
                        <span class="review-author">${review.name}</span>
                        <div class="review-rating">${renderMoonsRating(review.rating)}</div>
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
            `;
        });
        reviewsContainer.innerHTML = reviewsHTML;
    } else {
        reviewsContainer.innerHTML = '<p>Пока нет отзывов. Будьте первым!</p>';
    }
    
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    addToCartBtn.dataset.id = productId;
    
    addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
    const newAddToCartBtn = document.getElementById('modal-add-to-cart');
    
    newAddToCartBtn.addEventListener('click', () => {
        addToCart(productId);
        showNotification(`"${product.name}" добавлен в корзину!`);
        closeProductModal();
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function createProductModalHTML() {
    const modalHTML = `
        <div id="product-modal" class="product-modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                
                <div class="modal-body">
                    <div class="modal-gallery">
                        <div class="main-image">
                            <img id="modal-main-img" src="" alt="">
                        </div>
                        <div class="thumbnail-images" id="modal-thumbnails"></div>
                    </div>
                    
                    <div class="modal-info">
                        <h2 id="modal-title"></h2>
                        <div class="modal-rating" id="modal-rating"></div>
                        <div class="modal-price" id="modal-price"></div>
                        
                        <div class="modal-description">
                            <h3>Описание</h3>
                            <p id="modal-full-description"></p>
                        </div>
                        
                        <div class="modal-specs">
                            <h3>Характеристики</h3>
                            <div class="spec-item">
                                <span class="spec-label">Ткань:</span>
                                <span id="modal-material"></span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Уход:</span>
                                <span id="modal-care"></span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Размеры:</span>
                                <span id="modal-sizes"></span>
                            </div>
                        </div>
                        
                        <div class="modal-reviews" id="modal-reviews">
                            <h3>Отзывы</h3>
                        </div>
                        
                        <button class="modal-add-to-cart" id="modal-add-to-cart">
                            <i class="fas fa-shopping-basket"></i> Добавить в корзину
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.querySelector('.modal-overlay').addEventListener('click', closeProductModal);
    document.querySelector('.modal-close').addEventListener('click', closeProductModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProductModal(); });
}

function addModalStyles() {
    const modalStyles = `
        .product-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;
            display: none; align-items: center; justify-content: center; padding: 20px;
        }
        .product-modal.active { display: flex; }
        .modal-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 10, 20, 0.9); backdrop-filter: blur(10px);
        }
        .modal-content {
            position: relative; background: rgba(20, 35, 45, 0.95); border: 1px solid #3a6673;
            border-radius: 15px; max-width: 1000px; width: 100%; max-height: 90vh;
            overflow-y: auto; z-index: 2;
        }
        .modal-close {
            position: absolute; top: 20px; right: 20px; background: rgba(74, 156, 173, 0.2);
            border: 1px solid #4a9cad; color: #c8e8f8; width: 40px; height: 40px;
            border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 3;
            display: flex; align-items: center; justify-content: center;
        }
        .modal-close:hover { background: rgba(74, 156, 173, 0.4); }
        .modal-body { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 40px; }
        @media (max-width: 900px) { .modal-body { grid-template-columns: 1fr; } }
        .modal-gallery { display: flex; flex-direction: column; gap: 15px; }
        .main-image { height: 400px; border-radius: 10px; overflow: hidden; border: 1px solid #3a6673; }
        .main-image img { width: 100%; height: 100%; object-fit: cover; }
        .thumbnail-images { display: flex; gap: 10px; flex-wrap: wrap; }
        .thumbnail-images img {
            width: 80px; height: 80px; object-fit: cover; border-radius: 5px;
            cursor: pointer; border: 2px solid transparent; transition: all 0.3s;
        }
        .thumbnail-images img:hover, .thumbnail-images img.active { border-color: #4a9cad; transform: scale(1.05); }
        .modal-info h2 { color: #c8e8f8; font-size: 28px; margin-bottom: 15px; }
        .modal-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .modal-rating i { font-size: 20px; }
        .moon-full { color: #4a9cad; }
        .moon-half { color: #4a9cad; opacity: 0.7; }
        .moon-empty { color: #6b9cad; opacity: 0.4; }
        .rating-number { color: #8bb0c0; font-size: 18px; margin-left: 10px; }
        .modal-price { color: #4a9cad; font-size: 32px; font-weight: bold; margin-bottom: 25px; }
        .modal-description h3, .modal-specs h3, .modal-reviews h3 {
            color: #c8e8f8; font-size: 18px; margin-bottom: 10px; padding-bottom: 8px;
            border-bottom: 1px solid #3a6673;
        }
        .modal-description p { color: #8bb0c0; line-height: 1.6; margin-bottom: 25px; }
        .spec-item {
            display: flex; justify-content: space-between; margin-bottom: 10px;
            padding-bottom: 10px; border-bottom: 1px dashed rgba(58, 102, 115, 0.3);
        }
        .spec-label { color: #a8d0e0; font-weight: bold; }
        .modal-specs span:last-child { color: #8bb0c0; text-align: right; }
        .review-item {
            background: rgba(30, 50, 65, 0.3); padding: 15px; border-radius: 8px;
            margin-bottom: 15px; border: 1px solid rgba(58, 102, 115, 0.3);
        }
        .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .review-author { color: #c8e8f8; font-weight: bold; }
        .review-rating { display: flex; gap: 5px; }
        .review-rating i { font-size: 14px; }
        .review-text { color: #8bb0c0; font-size: 14px; }
        .modal-add-to-cart {
            width: 100%; padding: 15px; background: rgba(74, 156, 173, 0.3);
            border: 1px solid #4a9cad; color: #c8e8f8; border-radius: 8px;
            font-size: 16px; cursor: pointer; margin-top: 30px;
        }
        .modal-add-to-cart:hover { background: rgba(74, 156, 173, 0.5); }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.textContent = modalStyles;
    document.head.appendChild(styleEl);
}

// ========== ФОРМА КОНТАКТОВ ==========
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('❌ Заполните все поля формы');
            return;
        }
        
        console.log('📧 Отправка формы контактов:', formData);
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showNotification('📨 Сообщение отправлено! Мы свяжемся с вами в ближайшее тёмное время');
            
            const contactsSection = document.getElementById('contacts');
            if (contactsSection) {
                contactsSection.style.transition = 'all 0.5s';
                contactsSection.style.boxShadow = '0 0 30px rgba(74, 156, 173, 0.5)';
                setTimeout(() => { contactsSection.style.boxShadow = ''; }, 2000);
            }
        }, 1500);
    });
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
function openCheckout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста! Добавьте товары');
        return;
    }
    
    closeCartSidebar();
    currentStep = 1;
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCheckoutSteps();
        updateOrderSummary();
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCheckoutSteps() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        stepNum === currentStep ? step.classList.add('active') : step.classList.remove('active');
    });
    
    document.querySelectorAll('.checkout-step').forEach(step => {
        parseInt(step.dataset.step) === currentStep ? step.classList.add('active') : step.classList.remove('active');
    });
}

function goToPaymentStep() {
    const name = document.getElementById('customer-name')?.value;
    const email = document.getElementById('customer-email')?.value;
    const phone = document.getElementById('customer-phone')?.value;
    const city = document.getElementById('customer-city')?.value;
    const address = document.getElementById('customer-address')?.value;
    
    if (!name || !email || !phone || !city || !address) {
        showNotification('Заполните все обязательные поля');
        return;
    }
    
    currentStep = 2;
    updateCheckoutSteps();
}

function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateCheckoutSteps();
    }
}

function updateOrderSummary() {
    const itemsContainer = document.getElementById('checkout-items');
    const itemsTotalEl = document.getElementById('items-total');
    const grandTotalEl = document.getElementById('grand-total');
    
    if (!itemsContainer || !itemsTotalEl || !grandTotalEl) return;
    
    let itemsHTML = '';
    let itemsTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsTotal += itemTotal;
        
        itemsHTML += `
            <div class="summary-item">
                <img src="${item.image || 'https://via.placeholder.com/50x50/1a2b3c/ffffff?text=GOTIKA'}" 
                     alt="${item.name}">
                <div class="summary-item-info">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-details">
                        <span>${item.quantity} × ${item.price.toLocaleString()} ₽</span>
                        <span>${itemTotal.toLocaleString()} ₽</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    itemsContainer.innerHTML = itemsHTML;
    
    const deliveryPrice = 500;
    const grandTotal = itemsTotal + deliveryPrice;
    
    itemsTotalEl.textContent = itemsTotal.toLocaleString() + ' ₽';
    grandTotalEl.textContent = grandTotal.toLocaleString() + ' ₽';
    
    const qrAmount = document.getElementById('qr-amount');
    if (qrAmount) qrAmount.textContent = grandTotal.toLocaleString() + ' ₽';
}

function calculateOrderTotal() {
    const itemsTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return itemsTotal + 500;
}

function processPayment() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    if (!paymentMethod) {
        showNotification('Выберите способ оплаты');
        return;
    }
    
    const orderData = {
        number: generateOrderNumber(),
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        city: document.getElementById('customer-city').value,
        address: document.getElementById('customer-address').value,
        comment: document.getElementById('order-comment')?.value || '',
        paymentMethod: paymentMethod,
        items: [...cart],
        total: calculateOrderTotal(),
        date: new Date().toLocaleString()
    };
    
    saveOrderToHistory(orderData);
    
    if (paymentMethod === 'card') {
        processCardPayment(orderData);
    } else if (paymentMethod === 'sbp') {
        showQRModal(orderData);
    } else if (paymentMethod === 'cash') {
        completeOrder();
    }
}

function processCardPayment() {
    showProcessingAnimation();
    setTimeout(() => { completeOrder(); }, 2500);
}

function showQRModal(orderData) {
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.classList.add('active');
        const qrAmount = document.getElementById('qr-amount');
        if (qrAmount) qrAmount.textContent = orderData.total.toLocaleString() + ' ₽';
    }
}

function closeQRModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.remove('active');
}

function simulateSBPPayment() {
    closeQRModal();
    showProcessingAnimation();
    setTimeout(() => { completeOrder(); }, 3000);
}

function showProcessingAnimation() {
    const payBtn = document.getElementById('process-payment-btn');
    if (payBtn) {
        const originalHTML = payBtn.innerHTML;
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
        payBtn.disabled = true;
        setTimeout(() => {
            payBtn.innerHTML = originalHTML;
            payBtn.disabled = false;
        }, 3000);
    }
    showNotification('⏳ Обработка платежа...');
}

function saveOrderToHistory(orderData) {
    let orders = JSON.parse(localStorage.getItem('gotika-orders')) || [];
    orders.push(orderData);
    localStorage.setItem('gotika-orders', JSON.stringify(orders));
}

function completeOrder() {
    const orderNumber = generateOrderNumber();
    const customerName = document.getElementById('customer-name')?.value || 'Гость';
    const customerPhone = document.getElementById('customer-phone')?.value || 'Не указан';
    const orderTotal = calculateOrderTotal();
    
    currentStep = 3;
    updateCheckoutSteps();
    
    const successOrderNumber = document.getElementById('success-order-number');
    const successCustomerName = document.getElementById('success-customer-name');
    const successCustomerPhone = document.getElementById('success-customer-phone');
    const successOrderTotal = document.getElementById('success-order-total');
    
    if (successOrderNumber) successOrderNumber.textContent = orderNumber;
    if (successCustomerName) successCustomerName.textContent = customerName;
    if (successCustomerPhone) successCustomerPhone.textContent = customerPhone;
    if (successOrderTotal) successOrderTotal.textContent = orderTotal.toLocaleString() + ' ₽';
    
    cart = [];
    localStorage.removeItem('gotika-cart');
    updateCartCount();
    updateCartDisplay();
    
    setTimeout(() => { showNotification(`✅ Заказ ${orderNumber} успешно оформлен!`); }, 500);
}

function completeOrderAndReturn() {
    closeCheckoutModal();
    showNotification('Спасибо за покупку!');
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
    
    const closeBtn = document.querySelector('.checkout-close');
    if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);
    
    const qrCloseBtn = document.querySelector('.qr-close');
    if (qrCloseBtn) qrCloseBtn.addEventListener('click', closeQRModal);
    
    document.querySelector('.checkout-overlay')?.addEventListener('click', closeCheckoutModal);
    document.querySelector('.qr-overlay')?.addEventListener('click', closeQRModal);
    
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });
}

// ========== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ==========
function openProfile() {
    closeCartSidebar();
    
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    loadUserProfile();
    loadOrderHistory();
    loadFavorites();
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function loadUserProfile() {
    const profileEmail = document.getElementById('profile-email');
    if (profileEmail) {
        profileEmail.textContent = userProfile.email || 'Войдите или зарегистрируйтесь';
    }
    
    const fields = {
        'user-name': 'name',
        'user-email': 'email',
        'user-phone': 'phone',
        'user-city': 'city',
        'user-birthday': 'birthday',
        'user-address': 'address'
    };
    
    Object.keys(fields).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = userProfile[fields[id]] || '';
    });
}

function saveProfile() {
    const formData = {
        name: document.getElementById('user-name')?.value || '',
        email: document.getElementById('user-email')?.value || '',
        phone: document.getElementById('user-phone')?.value || '',
        city: document.getElementById('user-city')?.value || '',
        birthday: document.getElementById('user-birthday')?.value || '',
        address: document.getElementById('user-address')?.value || ''
    };
    
    userProfile = { ...userProfile, ...formData };
    localStorage.setItem('gotika-profile', JSON.stringify(userProfile));
    
    const profileEmail = document.getElementById('profile-email');
    if (profileEmail && formData.email) profileEmail.textContent = formData.email;
    
    showNotification('✅ Профиль сохранен');
}

function loadOrderHistory() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;
    
    let orders = JSON.parse(localStorage.getItem('gotika-orders')) || [];
    userProfile.orders = orders;
    localStorage.setItem('gotika-profile', JSON.stringify(userProfile));
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-box-open"></i>
                <p>У вас еще нет заказов</p>
                <p class="small-text">Совершите первую покупку!</p>
            </div>
        `;
        return;
    }
    
    orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    
    let ordersHTML = '';
    
    orders.forEach((order, index) => {
        let statusClass = 'status-processing';
        let statusText = 'В обработке';
        
        if (index === 0) {
            statusClass = 'status-completed';
            statusText = 'Завершен';
        } else if (index === orders.length - 1) {
            statusClass = 'status-cancelled';
            statusText = 'Отменен';
        }
        
        let itemsHTML = '';
        let orderTotal = 0;
        
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                orderTotal += itemTotal;
                
                itemsHTML += `
                    <div class="order-item">
                        <img src="${item.image || 'https://via.placeholder.com/50x50/1a2b3c/ffffff?text=GOTIKA'}" 
                             alt="${item.name}">
                        <div class="order-item-info">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-details">
                                <span>${item.quantity} × ${item.price.toLocaleString()} ₽</span>
                                <span>${itemTotal.toLocaleString()} ₽</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        const orderDate = order.date ? new Date(order.date).toLocaleDateString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }) : 'Дата не указана';
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-number">${order.number || 'Без номера'}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                </div>
                
                <div class="order-items">${itemsHTML || '<p style="color: #8bb0c0; text-align: center; padding: 20px;">Товары не указаны</p>'}</div>
                
                <div class="order-footer">
                    <div class="order-total">Итого: ${orderTotal.toLocaleString()} ₽</div>
                    <div class="order-actions">
                        <button class="order-action-btn" onclick="window.repeatOrder(${index})">
                            <i class="fas fa-redo"></i> Повторить
                        </button>
                        <button class="order-action-btn" onclick="window.viewOrderDetails(${index})">
                            <i class="fas fa-eye"></i> Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = ordersHTML;
}

window.repeatOrder = function(orderIndex) {
    const orders = JSON.parse(localStorage.getItem('gotika-orders')) || [];
    
    if (orders[orderIndex] && orders[orderIndex].items) {
        cart = [];
        orders[orderIndex].items.forEach(item => {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            });
        });
        
        localStorage.setItem('gotika-cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        closeProfileModal();
        setTimeout(() => toggleCartSidebar(), 500);
        showNotification('🛒 Товары из заказа добавлены в корзину');
    }
};

window.viewOrderDetails = function(orderIndex) {
    const orders = JSON.parse(localStorage.getItem('gotika-orders')) || [];
    
    if (orders[orderIndex]) {
        const order = orders[orderIndex];
        let detailsText = `Детали заказа ${order.number}\n\n`;
        detailsText += `Имя: ${order.name || 'Не указано'}\n`;
        detailsText += `Телефон: ${order.phone || 'Не указано'}\n`;
        detailsText += `Email: ${order.email || 'Не указано'}\n`;
        detailsText += `Адрес: ${order.address || 'Не указано'}\n`;
        detailsText += `Способ оплаты: ${getPaymentMethodName(order.paymentMethod)}\n`;
        detailsText += `Дата: ${order.date || 'Не указана'}\n`;
        if (order.comment) detailsText += `\nКомментарий: ${order.comment}\n`;
        alert(detailsText);
    }
};

function clearOrderHistory() {
    if (confirm('Вы уверены, что хотите очистить историю заказов?')) {
        localStorage.removeItem('gotika-orders');
        userProfile.orders = [];
        localStorage.setItem('gotika-profile', JSON.stringify(userProfile));
        loadOrderHistory();
        showNotification('🗑️ История заказов очищена');
    }
}

function loadFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;
    
    if (!userProfile.favorites || userProfile.favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="no-favorites">
                <i class="fas fa-heart-broken"></i>
                <p>В избранном пока пусто</p>
                <p class="small-text">Добавляйте товары, нажимая на сердечко</p>
            </div>
        `;
        return;
    }
    
    let favoritesHTML = '';
    
    userProfile.favorites.forEach(favId => {
        const product = products.find(p => p.id === favId);
        
        if (product) {
            favoritesHTML += `
                <div class="favorite-card">
                    <div class="favorite-image">
                        <img src="${product.image || 'https://via.placeholder.com/250x150/1a2b3c/ffffff?text=GOTIKA'}" 
                             alt="${product.name}">
                    </div>
                    <div class="favorite-info">
                        <div class="favorite-name">${product.name}</div>
                        <div class="favorite-price">${product.price.toLocaleString()} ₽</div>
                        <div class="favorite-actions">
                            <button class="favorite-remove" onclick="removeFromFavorites(${favId})">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                            <button class="favorite-add-to-cart" onclick="addToCart(${favId}); showNotification('Товар добавлен в корзину')">
                                <i class="fas fa-shopping-cart"></i> В корзину
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    favoritesList.innerHTML = favoritesHTML;
}

function addToFavorites(productId) {
    if (!userProfile.favorites.includes(productId)) {
        userProfile.favorites.push(productId);
        localStorage.setItem('gotika-profile', JSON.stringify(userProfile));
        loadFavorites();
        showNotification('💖 Товар добавлен в избранное');
    }
}

window.removeFromFavorites = function(productId) {
    userProfile.favorites = userProfile.favorites.filter(id => id !== productId);
    localStorage.setItem('gotika-profile', JSON.stringify(userProfile));
    loadFavorites();
    showNotification('🗑️ Товар удален из избранного');
};

function logout() {
    if (confirm('Вы уверены, что хотите выйти? Данные профиля будут сохранены.')) {
        closeProfileModal();
        showNotification('👋 До новых встреч!');
    }
}

function setupAutoFillFromProfile() {
    const fields = [
        { element: 'customer-name', profileField: 'name' },
        { element: 'customer-email', profileField: 'email' },
        { element: 'customer-phone', profileField: 'phone' },
        { element: 'customer-address', profileField: 'address' }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.element);
        if (element) {
            element.addEventListener('focus', function() {
                if (!this.value && userProfile[field.profileField]) {
                    this.value = userProfile[field.profileField];
                }
            });
        }
    });
}

function initProfile() {
    const profileBtn = document.getElementById('user-btn');
    if (profileBtn) profileBtn.addEventListener('click', openProfile);
    
    const closeBtn = document.querySelector('.profile-close');
    if (closeBtn) closeBtn.addEventListener('click', closeProfileModal);
    
    const profileOverlay = document.querySelector('.profile-overlay');
    if (profileOverlay) profileOverlay.addEventListener('click', closeProfileModal);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
            const targetTab = document.getElementById(`tab-${tabId}`);
            if (targetTab) targetTab.classList.add('active');
        });
    });
    
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    setupAutoFillFromProfile();
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 GOTIKA Store загружен!');
    
    createProductModalHTML();
    addModalStyles();
    
    renderProducts();
    updateCartCount();
    
    initCategoryFilters();
    initFilters();
    initCart();
    initSmoothScrolling();
    initNavigation();
    initContactForm();
    initCheckout();
    initProfile();
    
    console.log(`Товаров загружено: ${products.length}`);
    console.log(`Корзина: ${cart.length} товаров`);
});