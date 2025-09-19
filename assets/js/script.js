
// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        oldPrice: 99.99,
        image: "./assets/images/headphones.jpg",
        sale: true,
        rating: 4.5
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        oldPrice: null,
        image: "./assets/images/watch.jpg",
        sale: false,
        rating: 4.8
    },
    {
        id: 3,
        name: "Premium Coffee Maker",
        price: 149.99,
        oldPrice: null,
        image: "./assets/images/coffee.jpg",
        rating: 4.2
    },
    {
        id: 4,
        name: "Ergonomic Office Chair",
        price: 299.99,
        oldPrice: null,
        image: "./assets/images/chair.webp",
        sale: false,
        rating: 4.6
    },
    {
        id: 5,
        name: "True Wireless Earbuds",
        price: 179.99,
        oldPrice: 209.99,
        image: "./assets/images/tws.jpg",
        sale: true,
        rating: 4.8
    },
    {
        id: 6,
        name: "Smart Phone",
        price: 249.99,
        oldPrice: 299.99,
        image: "./assets/images/phone.webp",
        sale: true,
        rating: 4.5
    },
    {
        id: 7,
        name: "Laptop",
        price: 2499.99,
        oldPrice: 2999.99,
        image: "./assets/images/laptop.jpg",
        sale: true,
        rating: 4.7
    },
    {
        id: 8,
        name: "Wireless Charger",
        price: 149.99,
        oldPrice: null,
        image: "./assets/images/wirelesscharger.jpg",
        sale: false,
        rating: 4.6
    },
    {
        id: 9,
        name: "Laptop Table",
        price: 149.99,
        oldPrice: 200.00,
        image: "./assets/images/table.webp",
        sale: true,
        rating: 4.6
    }


];

let cart = [];
let displayedProducts = 0;
const productsPerLoad = 6;

// --- LocalStorage Functions ---
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}
// --- End LocalStorage Functions ---

// Load products
function loadProducts(productsToDisplay = products, count = productsPerLoad) {
    const productGrid = document.getElementById('productGrid');
    const loadMoreButton = document.querySelector('.btn[onclick="loadMoreProducts()"]');

    // If a search is active, clear the grid and display the filtered products
    if (productsToDisplay !== products) {
        productGrid.innerHTML = '';
        productsToDisplay.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
        if (loadMoreButton) {
            loadMoreButton.style.display = 'none';
        }
        return;
    }

    // Normal loading logic
    const endIndex = Math.min(displayedProducts + count, productsToDisplay.length);

    for (let i = displayedProducts; i < endIndex; i++) {
        const product = productsToDisplay[i];
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    }

    displayedProducts = endIndex;

    if (displayedProducts >= productsToDisplay.length) {
        if (loadMoreButton) {
            loadMoreButton.style.display = 'none';
        }
    } else {
        if (loadMoreButton) {
            loadMoreButton.style.display = 'block';
        }
    }
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';

    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    col.innerHTML = `
            <div class="card product-card">
                ${product.sale ? '<div class="badge-sale">Sale</div>' : ''}
                <div class="product-image" style="background-image: url('${product.image}');">
                    <div class="product-overlay">
                        <button class="btn btn-primary me-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline-light">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="stars mb-2">${stars}</div>
                    <div class="price">
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
                        $${product.price}
                    </div>
                </div>
            </div>
        `;
    return col;
}

function loadMoreProducts() {
    loadProducts();
}

function addToCart(productId) {
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
        showToast(`Quantity of ${cart[existingProductIndex].name} updated!`);
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({ ...product, quantity: 1, image: product.image });
            showToast(`${product.name} added to cart!`);
        }
    }
    updateCartCount();
    updateOffcanvasCartContent();
    saveCart();
}

function updateCartCount() {
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    document.getElementById('cartCount').textContent = totalItems;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 p-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
            <div class="toast show" role="alert">
                <div class="toast-header">
                    <i class="fas fa-check-circle text-success me-2"></i>
                    <strong class="me-auto">Success</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// --- NEW filterProducts FUNCTION ---
function filterProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    if (lowercaseQuery === '') {
        // If query is empty, show all products
        displayedProducts = 0;
        loadProducts(products);
    } else {
        // Filter products based on the query
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(lowercaseQuery)
        );
        loadProducts(filtered);
    }
}
// --- END NEW filterProducts FUNCTION ---


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'white';
        navbar.style.backdropFilter = 'none';
    }
});

function animateOnScroll() {
    const elements = document.querySelectorAll('.category-card, .product-card, .feature-box');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

function initAnimations() {
    const elements = document.querySelectorAll('.category-card, .product-card, .feature-box');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

document.querySelector('.newsletter .btn').addEventListener('click', function () {
    const emailInput = document.querySelector('.newsletter input[type="email"]');
    const email = emailInput.value;

    if (email && validateEmail(email)) {
        showToast('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
    } else {
        showToast('Please enter a valid email address.');
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function addCategoryEffects() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.background = '#f8f9fa';
        });
    });
}

function updateOffcanvasCartContent() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            total += item.price * item.quantity;
            return `
                    <div class="d-flex justify-content-between align-items-center mb-3 cart-item">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                        <div class="cart-item-details">
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
        }).join('');

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].quantity--;
        if (cart[index].quantity === 0) {
            cart.splice(index, 1);
            showToast('Item removed from cart');
        } else {
            showToast('Item quantity decremented');
        }
        updateCartCount();
        updateOffcanvasCartContent();
        saveCart();
    }
}

function checkout() {
    if (cart.length > 0) {
        showToast('Redirecting to checkout...');
        setTimeout(() => {
            cart = [];
            updateCartCount();
            updateOffcanvasCartContent();
            saveCart();
            showToast('Thank you for your order!');
        }, 2000);
    } else {
        showToast('Your cart is empty');
    }
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

    loader.innerHTML = `
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
    document.body.appendChild(loader);

    setTimeout(() => {
        loader.remove();
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
    showLoading();
    loadCart();
    updateCartCount();
    loadProducts();
    initAnimations();
    addCategoryEffects();

    const cartOffcanvas = document.getElementById('cartOffcanvas');
    if (cartOffcanvas) {
        cartOffcanvas.addEventListener('show.bs.offcanvas', function () {
            updateOffcanvasCartContent();
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    setTimeout(animateOnScroll, 500);

    // --- UPDATED Event Listener for Search Input ---
    document.getElementById('searchInput').addEventListener('keyup', function (e) {
        filterProducts(e.target.value);
    });
    // --- END UPDATED Event Listener ---
});
