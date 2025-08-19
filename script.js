
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const paymentForm = document.getElementById('paymentForm');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close-modal');
const receiptEmail = document.getElementById('receipt-email');

// Add to cart functionality
function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    
    updateCart();
    alert(`${name} added to cart!`);
}

// Update cart display
function updateCart() {
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    // Add each item to cart display
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
            <div class="item-total">
                $${itemTotal.toFixed(2)}
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Calculate totals
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + tax;
    
    // Update totals display
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', adjustQuantity);
    });
    
    // Update remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Adjust item quantity
function adjustQuantity(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const action = button.getAttribute('data-action');
    
    const item = cart.find(item => item.id === id);
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
    }
    
    updateCart();
}

// Remove item from cart
function removeItem(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Handle payment form submission
function handlePayment(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    // Simple validation
    if (!name || !email || !address || !cardNumber || !expiry || !cvv) {
        alert('Please fill out all fields');
        return;
    }
    
    // Validate card number (simple check for demo)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
    }
    
    // Show success modal
    receiptEmail.textContent = email;
    paymentModal.style.display = 'block';
    
    // Clear cart
    cart = [];
    updateCart();
    
    // Reset form
    paymentForm.reset();
}

// Close modal
function closePaymentModal() {
    paymentModal.style.display = 'none';
}

// Event Listeners
if (addToCartButtons) {
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

if (paymentForm) {
    paymentForm.addEventListener('submit', handlePayment);
}

if (closeModal) {
    closeModal.addEventListener('click', closePaymentModal);
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === paymentModal) {
        closePaymentModal();
    }
});

// ZIP code validation for contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const zipInput = document.getElementById('contact-zip');
        const zipRegex = /^\d{5}$/;
        
        if (!zipRegex.test(zipInput.value)) {
            e.preventDefault();
            alert('Please enter a valid 5-digit ZIP code');
            zipInput.focus();
        }
    });
}

// Product filtering
const categoryFilter = document.getElementById('category');
const sortFilter = document.getElementById('sort');
const productCards = document.querySelectorAll('.product-card');

if (categoryFilter && sortFilter && productCards) {
    categoryFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', filterProducts);
}

function filterProducts() {
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    
    // Filter by category
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Sort products
    const visibleProducts = Array.from(productCards).filter(card => 
        card.style.display !== 'none'
    );
    
    visibleProducts.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
        const nameA = a.querySelector('h3').textContent.toLowerCase();
        const nameB = b.querySelector('h3').textContent.toLowerCase();
        
        switch (sort) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name':
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });
    
    // Reorder products in DOM
    const productsGrid = document.querySelector('.products-grid');
    visibleProducts.forEach(product => {
        productsGrid.appendChild(product);
    });
}
