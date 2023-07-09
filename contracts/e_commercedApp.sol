// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract e_commercedApp {
    event NewUser(address userAddress, string username);
    event OrderPlaced(address userAddress, uint256 orderId);
    event OrderReturned(address userAddress, uint256 orderId);
    event OrderRefunded(address userAddress, uint256 orderId);
    event ProductSharedOnSocialMedia(address userAddress, string productUrl);
    event ProductReviewed(address userAddress, uint256 productId, string comment, uint256 rating);

    struct User {
        string username;
        uint256 age;
        address walletAddress;
    }

    struct Order {
        uint256 orderId;
        uint256 productId;
        uint256 quantity;
        bool isReturned;
        bool isRefunded;
    }

    struct Product {
        string name;
        string description;
        uint256 price;
    }

    mapping(address => User) public users;
    mapping(uint256 => Product) public products;
    mapping(address => mapping(uint256 => Order)) public userOrders;
    mapping(address => mapping(uint256 => uint256)) public userCart;
    mapping(address => mapping(uint256 => uint256)) public userDiscounts;
    mapping(address => mapping(uint256 => Review)) public productReviews;

    address public owner;
    uint256 public totalUsers;
    uint256 public maxUsers = 1000;
    uint256 public totalProducts;
    uint256 public maxProducts = 1000;

    modifier onlyOwner() {
        require(msg.sender == owner, "Yalnizca yoneticier erisebilir.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addUser(string memory _username, uint256 _age) public {
        require(users[msg.sender].walletAddress != msg.sender, "Kullanici zaten mevcut.");
        require(totalUsers < maxUsers, "Maksimum kullanici sayisina ulasildi.");

        User memory newUser = User({
            username: _username,
            age: _age,
            walletAddress: msg.sender
        });

        users[msg.sender] = newUser;
        totalUsers++;

        emit NewUser(msg.sender, _username);
    }

    function getUserInfo() public view returns (string memory, uint256, address) {
        require(users[msg.sender].walletAddress == msg.sender, "Kullanici bulunamadi.");

        User memory currentUser = users[msg.sender];
        return (currentUser.username, currentUser.age, currentUser.walletAddress);
    }

    function addProduct(string memory _name, string memory _description, uint256 _price) public onlyOwner {
        require(totalProducts < maxProducts, "Maksimum urun sayisina ulasildi.");

        Product memory newProduct = Product({
            name: _name,
            description: _description,
            price: _price
        });

        uint256 productId = totalProducts + 1;
        products[productId] = newProduct;
        totalProducts++;
    }

    function getProductInfo(uint256 _productId) public view returns (string memory, string memory, uint256) {
        require(_productId <= totalProducts, "Gecersiz urun ID'si.");

        Product memory currentProduct = products[_productId];
        return (currentProduct.name, currentProduct.description, currentProduct.price);
    }

    function addToCart(uint256 _productId, uint256 _quantity) public {
        require(_quantity > 0, "Gecersiz miktar.");
        require(_productId <= totalProducts, "Gecersiz urun ID'si.");

        userCart[msg.sender][_productId] += _quantity;
    }

    function removeFromCart(uint256 _productId, uint256 _quantity) public {
        require(_quantity > 0, "Gecersiz miktar.");

        uint256 currentQuantity = userCart[msg.sender][_productId];
        require(currentQuantity >= _quantity, "Sepette yeterli urun bulunmamaktadir.");

        userCart[msg.sender][_productId] -= _quantity;
    }

    function placeOrder() public {
        // Sepetin içeriğini kontrol et ve siparişi oluştur
        // Örneğin: Sipariş ID'si ve diğer sipariş bilgilerini kaydet
        // Sipariş oluşturulduğunda sepeti temizle

        uint256 orderId = 1; // Sipariş ID'sini örnek olarak 1 olarak kabul edelim

        // Sepetteki ürünleri dolaşarak siparişi oluştur
        for (uint256 i = 1; i <= totalProducts; i++) {
            uint256 quantity = userCart[msg.sender][i];
            if (quantity > 0) {
                Order memory newOrder = Order({
                    orderId: orderId,
                    productId: i,
                    quantity: quantity,
                    isReturned: false,
                    isRefunded: false
                });

                userOrders[msg.sender][orderId] = newOrder;
                orderId++;
            }
        }

        // Sepeti temizle
        for (uint256 i = 1; i <= totalProducts; i++) {
            userCart[msg.sender][i] = 0;
        }

        emit OrderPlaced(msg.sender, orderId - 1);
    }

    function returnOrder(uint256 _orderId) public {
        // Siparişi iade et
        // Örneğin: İade durumunu işaretle ve ilgili alanları güncelle

        require(_orderId > 0, "Gecersiz siparis ID'si.");
        require(userOrders[msg.sender][_orderId].orderId == _orderId, "Siparis bulunamadi.");
        require(!userOrders[msg.sender][_orderId].isReturned, "Siparis zaten iade edilmis.");

        userOrders[msg.sender][_orderId].isReturned = true;

        emit OrderReturned(msg.sender, _orderId);
    }

    function refundOrder(uint256 _orderId) public {
        // Siparişi iade et
        // Örneğin: İade durumunu işaretle, ödeme iadesi yap ve ilgili alanları güncelle

        require(_orderId > 0, "Gecersiz siparis ID'si.");
        require(userOrders[msg.sender][_orderId].orderId == _orderId, "Siparis bulunamadi.");
        require(!userOrders[msg.sender][_orderId].isRefunded, "Siparis zaten iade edilmis.");

        userOrders[msg.sender][_orderId].isRefunded = true;

        // Ödeme iadesi gerçekleştir
        // Örneğin: Kullanıcının ödeme sağlayıcısıyla entegre ederek ödeme iadesini gerçekleştir

        emit OrderRefunded(msg.sender, _orderId);
    }

    function shareProductOnSocialMedia(string memory _productUrl) public {
        // Ürünü sosyal medyada paylaş
        // Örneğin: Ürün URL'sini kullanarak paylaşımı gerçekleştir

        emit ProductSharedOnSocialMedia(msg.sender, _productUrl);
    }

    struct Review {
        string comment;
        uint256 rating;
    }

    function addProductReview(uint256 _productId, string memory _comment, uint256 _rating) public {
        require(_productId <= totalProducts, "Gecersiz urun ID'si.");
        require(_rating >= 1 && _rating <= 5, "Gecersiz degerlendirme.");

        Review memory newReview = Review({
            comment: _comment,
            rating: _rating
        });

        productReviews[msg.sender][_productId] = newReview;

        emit ProductReviewed(msg.sender, _productId, _comment, _rating);
    }
}
