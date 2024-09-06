// Khởi tạo giỏ hàng trống
let cart = [];

// Thêm sự kiện cho các nút "Thêm vào giỏ hàng"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.parentElement;
        const id = product.getAttribute('data-id');
        const name = product.getAttribute('data-name');
        const price = parseInt(product.getAttribute('data-price'));
        const quantity = parseInt(product.querySelector('.quantity').value);

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.find(item => item.id === id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }

        // Cập nhật giỏ hàng
        updateCart();
    });
});

// Hàm cập nhật giỏ hàng hiển thị
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.quantity} x ${item.price.toLocaleString()} VND`;
        cartItems.appendChild(li);
    });

    // Hiển thị giỏ hàng và nút mua hàng nếu có sản phẩm
    if (cart.length > 0) {
        document.querySelector('.cart').classList.remove('hidden');
        document.getElementById('checkout').classList.remove('hidden');
    }
}

// Xử lý khi nhấn nút "Mua Hàng"
document.getElementById('checkout').addEventListener('click', function() {
    alert('Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được ghi nhận.');
    cart = []; // Xóa giỏ hàng sau khi mua
    updateCart();
    document.querySelector('.cart').classList.add('hidden');
    this.classList.add('hidden');
});
