const params = new URL(location.href).searchParams;
const productId = params.get('productId');
const quantity = document.getElementById("productCount");
let currentImageIndex = 0;
let productImages = [];

getData();

async function getData() {
    try {
        const response = await fetch('Admin/Admin/json/products.json');
        const json = await response.json();
        const product = json.find(item => item.id == productId);
        if (product) {
            displayDetails(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching the data', error);
    }
}

function updateImageNavigation() {
    if (currentImageIndex >= 0 && currentImageIndex < productImages.length) {
        document.getElementById("product_image").src = productImages[currentImageIndex];
    }
    document.getElementById("prevImage").disabled = currentImageIndex === 0;
    document.getElementById("nextImage").disabled = currentImageIndex === productImages.length - 1;
}

document.getElementById("prevImage").addEventListener("click", () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImageNavigation();
    }
});

document.getElementById("nextImage").addEventListener("click", () => {
    if (currentImageIndex < productImages.length - 1) {
        currentImageIndex++;
        updateImageNavigation();
    }
});

function displayDetails(product) {
    const productDetails = document.getElementsByClassName('productDetails')[0];
    productDetails.setAttribute("data-id", product.id);

    productImages = product.images || [];
    currentImageIndex = 0;
    updateImageNavigation();

    document.querySelector(".category_name").innerHTML = product.category;
    document.querySelector(".product_name").innerHTML = product.name;
    document.querySelector(".product_price").innerHTML = product.price;
    document.querySelector(".product_des").innerHTML = product.description;

    if (product.old_price) {
        const oldPriceElement = document.createElement('p');
        oldPriceElement.className = 'old-price';
        oldPriceElement.textContent = product.old_price;
        document.querySelector(".product_price").insertAdjacentElement('afterend', oldPriceElement);
    }

    const sizeDropdownContainer = document.getElementById('sizeDropdownContainer');
    sizeDropdownContainer.innerHTML = product.product_sizes && product.product_sizes.length > 0 ? generateSizeDropdown(product.product_sizes) : generateDisabledDropdown();

    loadProductImages(product.images);
    addAddToCartEvent(product.id);
}

function generateSizeDropdown(sizes) {
    let dropdownOptions = `<select class="size-dropdown"><option disabled selected>Alege mărimea</option>`;
    sizes.forEach(size => {
        dropdownOptions += `<option value="${size}">${size}</option>`;
    });
    return dropdownOptions + `</select>`;
}

function generateDisabledDropdown() {
    return `<select class="size-dropdown" disabled><option>Fără mărime disponibilă</option></select>`;
}

function loadProductImages(images) {
    const previewContainer = document.querySelector('.prewiev-image-navigation');
    if (images.length <= 1) {
        previewContainer.style.display = 'none';
    } else {
        previewContainer.style.display = 'flex';
        previewContainer.innerHTML = '';
        images.forEach(image => {
            const previewSquare = document.createElement('div');
            previewSquare.className = 'preview-square';
            previewSquare.style.backgroundImage = `url(${image})`;
            previewSquare.style.backgroundSize = 'cover';
            previewSquare.style.backgroundPosition = 'center';
            previewSquare.addEventListener('click', () => {
                currentImageIndex = images.indexOf(image);
                updateImageNavigation();
            });
            previewContainer.appendChild(previewSquare);
        });
    }
}

function addAddToCartEvent(productId) {
    const linkAdd = document.getElementById("btn_add");
    linkAdd.addEventListener("click", event => {
        event.preventDefault();
        const sizeSelect = document.querySelector('.size-dropdown');
        const selectedSize = sizeSelect ? sizeSelect.value : null;
        if (selectedSize === "Alege mărimea" || selectedSize === null) {
            alert("Te rugăm să alegi o mărime înainte de a adăuga produsul în coș!");
            return;
        }
        addToCart(productId, parseInt(quantity.value) || 1, selectedSize);
        showToast();
    });
}

function showToast() {
    setTimeout(showCart, 500);
}

function showCart() {
    document.querySelector('body').classList.add('showCart');
}

document.getElementById("minus").addEventListener("click", () => {
    let value = parseInt(quantity.value) || 1;
    if (value > 1) {
        quantity.value = value - 1;
    }
});

document.getElementById("plus").addEventListener("click", () => {
    let value = parseInt(quantity.value) || 1;
    if (value < 999) {
        quantity.value = value + 1;
    }
});

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    try {
        const response = await fetch('Admin/Admin/json/products.json');
        const products = await response.json();
        const product = products.find(prod => prod.id == productId);

        if (product) {
            document.getElementById('product_image').src = product.images[0];
            document.querySelector('.category_name').textContent = product.category;
            document.querySelector('.product_name').textContent = product.name;
            document.querySelector('.product_price').textContent = product.price;

            if (product.old_price) {
                document.querySelector('.product_des').textContent = product.description;
                document.getElementById('saleFlag').style.display = 'block';
            } else {
                document.getElementById('saleFlag').style.display = 'none';
            }

            if (product.isNew) {
                document.getElementById('newFlag').style.display = 'block';
            } else {
                document.getElementById('newFlag').style.display = 'none';
            }

            if (product.out_Off_stock) {
                document.getElementById('outOfStock').style.display = 'flex';
            } else {
                document.getElementById('outOfStock').style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Eroare la încărcarea detaliilor produsului:", error);
    }
}

loadProductDetails();