const e_commercedApp = artifacts.require("e_commercedApp");

  contract("e_commercedApp", function (accounts) {
    let contractInstance;

    before(async function () {
  	contractInstance = await e_commercedApp.new();
    });


    it("should add a new user", async function () {
      const username = "JohnDoe";
      const age = 25;

      await contractInstance.addUser(username, age);

      const user = await contractInstance.getUserInfo({ from: accounts[0] });

      assert.equal(user[0], username, "Username does not match");
      assert.equal(user[1], age, "Age does not match");
      assert.equal(user[2], accounts[0], "Wallet address does not match");
    });

    it("should add a new product", async function () {
      const name = "Product 1";
      const description = "Description 1";
      const price = 100;

      await contractInstance.addProduct(name, description, price);

      const product = await contractInstance.getProductInfo(1);

      assert.equal(product[0], name, "Product name does not match");
      assert.equal(product[1], description, "Product description does not match");
      assert.equal(product[2], price, "Product price does not match");
    });

    it("should add product to cart", async function () {
      const productId = 1;
      const quantity = 2;

      await contractInstance.addToCart(productId, quantity);

      const cartQuantity = await contractInstance.userCart(accounts[0], productId);

      assert.equal(cartQuantity, quantity, "Product quantity in cart does not match");
    });

    it("should remove product from cart", async function () {
      const productId = 1;
      const quantity = 1;

      await contractInstance.removeFromCart(productId, quantity);

      const cartQuantity = await contractInstance.userCart(accounts[0], productId);

      assert.equal(cartQuantity, 1, "Product quantity in cart after removal does not match");
    });

    it("should place an order", async function () {
      await contractInstance.placeOrder();

      const order = await contractInstance.userOrders(accounts[0], 1);

      assert.equal(order.orderId, 1, "Order ID does not match");
      assert.equal(order.productId, 1, "Product ID does not match");
      assert.equal(order.quantity, 1, "Order quantity does not match");
      assert.equal(order.isReturned, false, "Order isReturned flag does not match");
      assert.equal(order.isRefunded, false, "Order isRefunded flag does not match");
    });

    it("should return an order", async function () {
      await contractInstance.returnOrder(1);

      const order = await contractInstance.userOrders(accounts[0], 1);

      assert.equal(order.isReturned, true, "Order isReturned flag after return does not match");
    });

    it("should refund an order", async function () {
      await contractInstance.refundOrder(1);

      const order = await contractInstance.userOrders(accounts[0], 1);

      assert.equal(order.isRefunded, true, "Order isRefunded flag after refund does not match");
    });

    it("should share a product on social media", async function () {
      const productUrl = "https://example.com/product1";

      await contractInstance.shareProductOnSocialMedia(productUrl);

      const events = await contractInstance.getPastEvents("ProductSharedOnSocialMedia");

      assert.equal(events.length, 1, "Number of ProductSharedOnSocialMedia events does not match");
      assert.equal(events[0].returnValues.userAddress, accounts[0], "User address in event does not match");
      assert.equal(events[0].returnValues.productUrl, productUrl, "Product URL in event does not match");
    });

    it("should add a product review", async function () {
      const productId = 1;
      const comment = "Great product!";
      const rating = 5;

      await contractInstance.addProductReview(productId, comment, rating);

      const review = await contractInstance.productReviews(accounts[0], productId);

      assert.equal(review.comment, comment, "Review comment does not match");
      assert.equal(review.rating, rating, "Review rating does not match");
    });
  });
