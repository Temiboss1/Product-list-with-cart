document.addEventListener("DOMContentLoaded", () => { 
    const cart = {};
    const cartItemsContainer = document.getElementById("cart-items");
    const cartQuantityElement = document.querySelector(".cart-quantity");
    const totalPriceElement = document.querySelector(".total-price");
    const confirmOrderButton = document.querySelector(".confirm-order");
    const cartFooter = document.querySelector(".cart-footer");
    const orderPopup = document.querySelector("#order-confirmation");
    const orderSummary = document.querySelector("#order-summary");
    const orderTotalSpan = document.querySelector("#order-total");
    const startNewOrderBtn = document.querySelector("#start-new-order");

    document.querySelectorAll(".grid-item").forEach((product) => {
        const addToCartButton = product.querySelector(".add-to-cart");
        const quantityControls = product.querySelector(".quantity-controls");
        const increaseButton = product.querySelector(".increase");
        const decreaseButton = product.querySelector(".decrease");
        const quantityElement = product.querySelector(".quantity");
        const figure = product.querySelector(".img-container"); 

        addToCartButton.addEventListener("click", () => {
            const productId = product.getAttribute("data-id");
            const productName = product.getAttribute("data-name");
            const productPrice = parseFloat(product.getAttribute("data-price"));

            cart[productId] = { name: productName, price: productPrice, quantity: 1 };

            addToCartButton.classList.add("hidden");
            quantityControls.classList.remove("hidden");
            quantityElement.textContent = "1"; // Reset quantity to 1

            figure.style.border = "2px solid brown"; 

            updateCart();
        });

        increaseButton.addEventListener("click", () => {
            const productId = product.getAttribute("data-id");
            if (cart[productId]) {
                cart[productId].quantity++;
                quantityElement.textContent = cart[productId].quantity;
                updateCart();
            }
        });

        decreaseButton.addEventListener("click", () => {
            const productId = product.getAttribute("data-id");

            if (cart[productId] && cart[productId].quantity > 1) {
                cart[productId].quantity--;
                quantityElement.textContent = cart[productId].quantity;
            } else {
                removeItemFromCart(productId, product, addToCartButton, quantityControls, quantityElement, figure);
            }
            updateCart();
        });
    });

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let totalItems = 0;
        let totalPrice = 0;

        if (Object.keys(cart).length === 0) {
            // Show empty cart message when no items are in the cart
            cartItemsContainer.innerHTML = `
                <img src="assets/images/illustration-empty-cart.svg" alt="Empty Cart" class="empty-cart-image">
                <span class="add-item-msg">Your added items will appear here</span>
            `;
        }

        Object.keys(cart).forEach((productId) => {
            const item = cart[productId];

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <h4 class="cart-item-name">
                    <span>${item.name}</span>
                </h4>
                <div class="flex-row">
                    <p class="cart-item-price">
                        <span>${item.quantity}x</span>
                        <span> @ $${item.price.toFixed(2)}</span>
                        <span>$${(item.quantity * item.price).toFixed(2)}</span>
                    </p>
                    <figure class="remove-item-container">
                        <img src="assets/images/icon-remove-item.svg" alt="Remove Item" class="remove-item" data-id="${productId}">
                    </figure>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);

            totalItems += item.quantity;
            totalPrice += item.quantity * item.price;
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        cartQuantityElement.textContent = totalItems;

        cartFooter.style.display = totalItems > 0 ? "flex" : "none";

        document.querySelectorAll(".remove-item").forEach((icon) => {
            icon.addEventListener("click", () => {
                const productId = icon.getAttribute("data-id");
                const product = document.querySelector(`.grid-item[data-id="${productId}"]`);
                const addToCartButton = product.querySelector(".add-to-cart");
                const quantityControls = product.querySelector(".quantity-controls");
                const quantityElement = product.querySelector(".quantity");
                const figure = product.querySelector(".img-container");

                removeItemFromCart(productId, product, addToCartButton, quantityControls, quantityElement, figure);
                updateCart();
            });
        });
    }

    function removeItemFromCart(productId, product, addToCartButton, quantityControls, quantityElement, figure) {
        delete cart[productId];
        addToCartButton.classList.remove("hidden");
        quantityControls.classList.add("hidden");
        quantityElement.textContent = "1";

        figure.style.border = "none";
    }

    confirmOrderButton.addEventListener("click", () => {
        orderSummary.innerHTML = ""; 

        const cartTotal = document.querySelector(".total-price").textContent;
        orderTotalSpan.textContent = cartTotal; 

        Object.keys(cart).forEach(productId => {
            const item = cart[productId];

            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");

            orderItem.innerHTML = ` 
                <h4 class="cart-item-name">
                    <span>${item.name}</span>
                </h4>
                <div class="flex-row">
                    <div class="cart-item-price">
                        <span>${item.quantity}x</span>
                        <span> @ $${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-total">
                    <span>$${(item.quantity * item.price).toFixed(2)}</span></div>
                </div>
            `;

            orderSummary.appendChild(orderItem);
        });

        orderPopup.classList.remove("hidden");
    });

    startNewOrderBtn.addEventListener("click", () => {
        Object.keys(cart).forEach((productId) => {
            delete cart[productId];
        });

        document.querySelectorAll(".add-to-cart").forEach((btn) => btn.classList.remove("hidden"));
        document.querySelectorAll(".quantity-controls").forEach((ctrl) => {
            ctrl.classList.add("hidden");
            ctrl.querySelector(".quantity").textContent = "1";
        });

        document.querySelectorAll(".img-container").forEach((figure) => {
            figure.style.border = "none";
        });

        cartFooter.style.display = "none";
        cartQuantityElement.textContent = "0"; 

        updateCart();
        orderPopup.classList.add("hidden");
    });
});
