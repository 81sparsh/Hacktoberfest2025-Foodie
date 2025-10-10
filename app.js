var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: ".fa-arrow-right",
        prevEl: ".fa-arrow-left",
    },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamberger = document.querySelector('.hamberger')
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');
const backToTop = document.querySelector('.back-to-top');
const themeToggles = document.querySelectorAll('.theme-toggle');



cartIcon.addEventListener('click', () => cartTab.classList.add("cart-tab-active"));
closeBtn.addEventListener('click', () => cartTab.classList.remove("cart-tab-active"));
hamberger.addEventListener('click', () => mobileMenu.classList.toggle("mobile-menu-active"));
hamberger.addEventListener('click', () => { bars.classList.toggle("fa-xmark"); bars.classList.toggle("fa-bars") });

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTop && backToTop.classList.add('visible');
    } else {
        backToTop && backToTop.classList.remove('visible');
    }
});

backToTop && backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Theme toggle functionality
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
};

const updateThemeIcons = (theme) => {
    themeToggles.forEach(toggle => {
        const icon = toggle.querySelector('i');
        const label = toggle.querySelector('span'); // Get span if exists

        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            toggle.classList.add('dark');
            if (label) label.textContent = 'Light Mode'; // <-- change label
        } else {
            icon.className = 'fa-solid fa-moon';
            toggle.classList.remove('dark');
            if (label) label.textContent = 'Dark Mode'; // <-- reset label
        }
    });
};


const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
};

// Add event listeners to all theme toggle buttons
themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
});

// Initialize theme on page load
initTheme();

let productList = [];
let AddProduct = [];

const updateTotalPrice = () => {

    let totalPrice = 0;
    let totalQualtity = 0;

    document.querySelectorAll('.item').forEach(item => {

        const quantity = parseInt(item.querySelector('.quatity-value').textContent);
        const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));

        totalPrice += price;
        totalQualtity += quantity;

    })

    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQualtity;

}

// === Show Cards ===
const showCards = () => {
    cardList.innerHTML = "";
    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
          <div class="card-image">
            <img src="${product.image}" alt="">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">${product.price}</h4>
            <a href="#" class="btn card-btn">Add to Cart</a>
        `;

        // Open modal on click
        orderCard.addEventListener("click", (e) => {
        if (!e.target.classList.contains('card-btn')) {
            
        openFoodModal(product);
    }
});
        
        // Add to cart directly
        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);      
        });
        cardList.appendChild(orderCard);
    });
}

const addToCart = (product) => {

    let quantity = 1;
    let price = parseFloat(product.price.replace('$', ''));

    const existProduct = AddProduct.find(item => item.id === product.id);
    if (existProduct) {
        alert("Product is Already in the cart you can increase the quantity form cart");
        return;
    }

    AddProduct.push(product);

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
     <div class="images-container">
    <img src="${product.image}">
    </div>

    <div class="detail">
    <h4>${product.name}</h4>
    <h4 class="item-total">${product.price}</h4>
    </div>

    <div class="flex">
    <a href="#" class="quatity-btn minus"><i class="fa-solid fa-minus"></i></a>
    <h4 class="quatity-value">1</h4>
    <a href="#" class="quatity-btn plus"><i class="fa-solid fa-plus"></i></a>
    </div>
    `;

    cartList.appendChild(cartItem);
    updateTotalPrice();

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');
    const quantityValue = cartItem.querySelector('.quatity-value');
    const itemTotal = cartItem.querySelector('.item-total');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();

        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `$${(quantity * price).toFixed(2)}`;
        updateTotalPrice();
    })

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `$${(price / quantity).toFixed(2)}`;
            updateTotalPrice();
        } else {
            cartItem.classList.add('slide-out');

            setTimeout(() => {
                cartItem.remove();
                updateTotalPrice();
                AddProduct = AddProduct.filter(item => item.id !== product.id);
            }, 200);
        }
    })
}

const checkoutBtn = document.querySelector('.check-out');

// Add click event to checkout button
checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Check if cart is empty
    if (AddProduct.length === 0) {
        alert('Your cart is empty! Please add some items before checkout.');
        return;
    }
    
    // Prepare cart data for checkout page
    const checkoutData = AddProduct.map(product => {
        // Find the quantity from the cart display
        const cartItems = document.querySelectorAll('.item');
        let quantity = 1;
        
        cartItems.forEach(item => {
            const itemName = item.querySelector('.detail h4').textContent;
            if (itemName === product.name) {
                quantity = parseInt(item.querySelector('.quatity-value').textContent);
            }
        });
        
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        };
    });
    
    // Store in sessionStorage to pass to checkout page
    sessionStorage.setItem('checkoutCart', JSON.stringify(checkoutData));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
});

const initApp = () => {

    fetch('products.json').then
        (response => response.json()).then
        (data => {
            productList = data;
            showCards();
        })
}

initApp();

// ===== Custom Dropdown =====
const priceSelector = document.getElementById('priceSelector');
const selected = priceSelector.querySelector('.selected');
const options = priceSelector.querySelectorAll('.options li');

// Optional hidden <select> (only if you have one in HTML)
const hiddenPriceFilter = document.getElementById('price-filter');

// Set default selected value
let currentPriceFilter = 'all';

selected.addEventListener('click', () => {
  priceSelector.classList.toggle('open');
});

options.forEach(opt => {
  opt.addEventListener('click', e => {
    currentPriceFilter = e.target.dataset.value;  // store current value
    selected.textContent = e.target.textContent + ' ▾';
    priceSelector.classList.remove('open');

    if (hiddenPriceFilter) hiddenPriceFilter.value = currentPriceFilter;
    applyFilters();  // trigger filtering
  });
});

document.addEventListener('click', e => {
  if (!priceSelector.contains(e.target)) priceSelector.classList.remove('open');
});

const renderCards = (filteredList) => {
  cardList.innerHTML = ''; // Clear existing items

  if (!filteredList || filteredList.length === 0) {
    // Show friendly fallback when nothing matches
    const msg = document.createElement('div');
    msg.classList.add('no-items-message');
    msg.textContent = 'Opps No Items Available At The Moment!!';
    cardList.appendChild(msg);
    return; // nothing else to render
  }

  filteredList.forEach(product => {
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');
    orderCard.innerHTML = `
      <div class="card-image"><img src="${product.image}" alt=""></div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn">Add to Cart</a>`;
    cardList.appendChild(orderCard);
  });
};

// ===== Filter Logic =====
const searchInput = document.getElementById('search');

const applyFilters = () => {
  if (!productList || productList.length === 0) return; // Guard for data not loaded

  const searchTerm = searchInput.value.toLowerCase();
  const priceOption = currentPriceFilter; // use custom dropdown's value

  const filtered = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);

    const priceValue = parseFloat(product.price.replace('$', ''));
    let matchesPrice = true;

    if (priceOption === 'low') matchesPrice = priceValue < 10;
    else if (priceOption === 'mid') matchesPrice = priceValue >= 10 && priceValue <= 20;
    else if (priceOption === 'high') matchesPrice = priceValue > 20;

    return matchesSearch && matchesPrice;
  });

  renderCards(filtered); // fixed function name
};

// Listen for typing in search bar
searchInput.addEventListener('input', applyFilters);

// Modal Feature Implement
const modal = document.getElementById("foodModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalAddBtn = document.getElementById("addToCartBtn");
const modalViewBtn = document.getElementById("viewCartBtn");
const modalClose = document.querySelector(".modal .close");

function openFoodModal(product) {
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalPrice.textContent = product.price;
    modalDescription.textContent = product.description || "No description available.";
    modal.style.display = "flex";

    modalAddBtn.onclick = () => {
        addToCart(product);
        modal.style.display = "none";
    };

    modalViewBtn.onclick = () => {
        modal.style.display = "none";
        cartTab.classList.add("cart-tab-active");
    };
}

// Modal closing handlers
modalClose.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.style.display = "none"; });

// Theme toggle script
const themeToggle = document.querySelectorAll('.theme-toggle');
themeToggle.forEach(btn => {
  btn.addEventListener('click', () => {
    document.documentElement.toggleAttribute('data-theme', 'dark');
  });
});

themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load stored preference:
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// Handle toggle click:
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');

  // Update icon and save choice
  themeToggle.innerHTML = isDarkMode
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// initApp();
