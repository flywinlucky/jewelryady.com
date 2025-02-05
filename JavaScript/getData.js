let productsContainer = [];
const linkName = document.getElementsByClassName("categories_link");

document.addEventListener("DOMContentLoaded", () => {
    const savedCategory = localStorage.getItem("selectedCategory") || "";
    const categoryFromURL = new URLSearchParams(window.location.search).get("category") || savedCategory;
    markActiveCategory(categoryFromURL);
    getData(categoryFromURL);
});

async function getData(category = "") {
    try {
        const response = await fetch('Admin/Admin/json/products.json');
        const products = await response.json();
        const filteredProducts = category ? products.filter(product => product.category === category) : products;
        displayProducts(filteredProducts, category);
    } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
    }
}

function markActiveCategory(category) {
    const categoryLinks = document.querySelectorAll(".categories_link");
    categoryLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("productCategory") === category);
    });
}

function displayProducts(products, category = "") {
    const content = document.querySelector(".content");
    const currentCategoryElements = document.querySelectorAll("#currentCategory");
    const productCountSpan = document.getElementById("productCount");

    currentCategoryElements.forEach(element => {
        element.textContent = `> ${category || "Toate"}`;
    });

    productCountSpan.textContent = `x${products.length}`;
    content.innerHTML = products.length === 0 ? `<p>Niciun produs nu a fost găsit în această categorie.</p>` : generateProductCards(products);

    addCartEventListeners();
}

function generateProductCards(products) {
    return products.map(product => {
        const sizes = product.product_sizes || [];
        const sizeDropdown = sizes.length > 0 ? generateSizeDropdown(sizes) : generateDisabledDropdown();
        return generateProductCard(product, sizeDropdown);
    }).join('');
}

function generateSizeDropdown(sizes) {
    let dropdownOptions = `<option disabled selected>Alege mărimea</option>`;
    sizes.forEach(size => {
        dropdownOptions += `<option value="${size}">${size}</option>`;
    });
    return `<select class="size-dropdown">${dropdownOptions}</select>`;
}

function generateDisabledDropdown() {
    return `<select class="size-dropdown" disabled><option>Fără mărime disponibilă</option></select>`;
}

function generateProductCard(product, sizeDropdown) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="card-img">
                ${product.old_price ? `<div class="sale-flag">Reducere</div>` : ''}
                ${product.isNew ? `<div class="new-flag">NOU</div>` : ''}
                ${product.out_Off_stock ? `<div class="out-of-stock">Stoc epuizat</div>` : ''}
                <img src="${product.images[0]}" alt="${product.name}" onclick="displayDetails(${product.id});">
                <div class="card-watermark-logo">
                    <a href="link_catre_imagine.html">
                        <img src="images/logo_block.png" alt="Image description">
                    </a>
                </div>
                <a href="#" class="addToCart">
                    <ion-icon name="cart-outline" class="Cart"></ion-icon>
                </a>
            </div>
            <div class="card-info">
                <h4 class="product-name" onclick="displayDetails(${product.id});">${product.name}</h4>
                <h5 class="product-price">${product.price}</h5>
                ${product.old_price ? `<h5 class="old-price">${product.old_price}</h5>` : ''}
                ${sizeDropdown}
            </div>
        </div>`;
}

function addCartEventListeners() {
    const addToCartLinks = document.querySelectorAll('.addToCart');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const productCard = event.target.closest('.product-card');
            if (productCard && productCard.dataset.id) {
                const id_product = productCard.dataset.id;
                const selectedSize = productCard.querySelector('.size-dropdown').value;
                if (!productCard.querySelector('.size-dropdown').disabled && selectedSize === "Alege mărimea") {
                    alert("Te rugăm să alegi o mărime înainte de a adăuga produsul în coș!");
                    return;
                }
                addToCart(id_product, 1, selectedSize);
                showToast();
            }
        });
    });
}

function showToast() {
    setTimeout(showCart, 500);
}

function showCart() {
    document.querySelector('body').classList.add('showCart');
}

function getCategory(e) {
    const category = e.target.getAttribute('productCategory');
    setActiveLink(e.target);
    localStorage.setItem("selectedCategory", category);
    getData(category);
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function setActiveLink(activeLink) {
    Array.from(linkName).forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

Array.from(linkName).forEach(element => {
    element.addEventListener('click', getCategory);
});

function displayDetails(productId) {
    window.location.href = `ProductDetails.html?productId=${productId}`;
}

