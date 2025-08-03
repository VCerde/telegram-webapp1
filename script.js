// Данные меню
const MENU = {
    "Донер": 199,
    "Бургер": 249,
    "Хот-дог": 149
};

// Корзина
let cart = {};

// Загрузка данных пользователя и корзины
window.onload = () => {
    // Получение данных пользователя из Telegram Web App
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    document.getElementById('profile').innerHTML = user
        ? `<p>Имя: ${user.first_name}</p><p>ID: ${user.id}</p>`
        : '<p>Пользователь не авторизован</p>';

    // Отображение меню
    const menuDiv = document.getElementById('menu');
    for (const [item, price] of Object.entries(MENU)) {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `${item} - ${price} руб. <button onclick="addToCart('${item}')">Добавить</button>`;
        menuDiv.appendChild(div);
    }

    // Загрузка корзины
    updateCart();
};

// Добавление в корзину
function addToCart(item) {
    cart[item] = (cart[item] || 0) + 1;
    updateCart();
}

// Обновление корзины
function updateCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    let total = 0;
    for (const [item, qty] of Object.entries(cart)) {
        const price = MENU[item] * qty;
        total += price;
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `${item} x${qty} - ${price} руб. <button onclick="removeFromCart('${item}')">Убрать</button>`;
        cartDiv.appendChild(div);
    }
    cartDiv.innerHTML += `<p><b>Итого: ${total} руб.</b></p>`;
}

// Удаление из корзины
function removeFromCart(item) {
    if (cart[item] > 1) {
        cart[item]--;
    } else {
        delete cart[item];
    }
    updateCart();
}

// Отправка заказа
function submitOrder() {
    if (Object.keys(cart).length === 0) {
        alert('Корзина пуста!');
        return;
    }
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const orderData = {
        user_id: user.id,
        items: cart,
        total: Object.entries(cart).reduce((sum, [item, qty]) => sum + MENU[item] * qty, 0),
        date: new Date().toISOString()
    };
    window.Telegram.WebApp.sendData(JSON.stringify(orderData));
    window.Telegram.WebApp.close();
}