// Função para filtrar os itens do catálogo
const filterBtns = document.querySelectorAll('.filter-btn');
const cardItems = document.querySelectorAll('.card-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove a classe "active" de todos os botões
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active'); // Adiciona a classe "active" no botão clicado

        const filter = btn.getAttribute('data-filter');

        cardItems.forEach(item => {
            // Se a categoria for "all", exibe todos os itens
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = "block"; // Exibe o item
            } else {
                item.style.display = "none"; // Oculta o item
            }
        });
    });
});

let cart = []; // Array para armazenar produtos no carrinho

// Função para adicionar produtos ao carrinho
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCartItems();
    updateCartTotal();
}

// Função para remover produtos do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId); // Remove o produto completamente
    renderCartItems();
    updateCartTotal();
}

// Função para aumentar a quantidade do produto
function increaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity++;
        renderCartItems(); // Chama para renderizar novamente
        updateCartTotal(); // Atualiza o total
    }
}

// Função para diminuir a quantidade do produto
function decreaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity--;
        if (product.quantity <= 0) {
            removeFromCart(productId); // Remove o item se a quantidade chegar a zero
        } else {
            renderCartItems(); // Chama para renderizar novamente
            updateCartTotal(); // Atualiza o total
        }
    }
}

// Função para renderizar itens no carrinho
function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - R$${item.price.toFixed(2)} (Quantidade: ${item.quantity})`;

        // Criar botão de remover
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X'; // Botão para remover o item
        removeButton.classList.add('cart-button', 'remove'); // Adiciona as classes CSS
        removeButton.addEventListener('click', () => removeFromCart(item.id));

        // Criar botão para aumentar a quantidade
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+'; // Botão para aumentar a quantidade
        increaseButton.classList.add('cart-button', 'increase'); // Adiciona as classes CSS
        increaseButton.addEventListener('click', () => increaseQuantity(item.id));

        // Criar botão para diminuir a quantidade
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-'; // Botão para diminuir a quantidade
        decreaseButton.classList.add('cart-button', 'decrease'); // Adiciona as classes CSS
        decreaseButton.addEventListener('click', () => decreaseQuantity(item.id));

        li.appendChild(decreaseButton); // Adiciona botão de diminuir
        li.appendChild(increaseButton); // Adiciona botão de aumentar
        li.appendChild(removeButton); // Adiciona botão de remover
        cartItems.appendChild(li);
    });
}

// Função para atualizar o total do carrinho
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Função para alternar a exibição do carrinho
document.getElementById('toggle-cart').addEventListener('click', () => {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.style.display = cartContainer.style.display === 'none' || cartContainer.style.display === '' ? 'block' : 'none';
});

// Adicionando eventos para botões de adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const product = {
            id: button.getAttribute('data-product-id'),
            name: button.getAttribute('data-product-name'),
            price: parseFloat(button.getAttribute('data-product-price')),
        };
        addToCart(product);
    });
});

// Função para finalizar a compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
    const whatsappNumber = '5534992712745'; // Substitua pelo seu número do WhatsApp
    let message = `Olá! Eu gostaria de fazer o pedido:\n\n`;

    cart.forEach(item => {
        message += `${item.name} - R$${item.price.toFixed(2)} (Quantidade: ${item.quantity})\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: R$${total.toFixed(2)}\n\n`;

    // URL para redirecionar ao WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank'); // Abre o WhatsApp em uma nova aba
});

// Configuração inicial: oculta o carrinho ao carregar
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cart-container').style.display = 'none';
});
