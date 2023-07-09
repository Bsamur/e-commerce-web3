const Web3 = require('web3');

// Web3.js kullanımı için gerekli ayarlamalar
const web3 = new Web3(Web3.givenProvider || 'https://bsc-dataseed1.binance.org:443'); // Binance Smart Chain RPC endpointi

// Akıllı sözleşme adresi ve ABI
const contractAddress = '0xD64F85be8C648e1480a11a2820969951Fd25CC24'; // Akıllı sözleşme adresini buraya yerleştirin
const contractABI = require('/Users/bahadirsamur/Desktop/e-commerce-web3/build/contracts/e_commercedApp.json');

// ABI'yi kullanarak sözleşme nesnesini oluşturma veya etkileşimde bulunma
const contract = new web3.eth.Contract(contractABI, contractAddress);


// Akıllı sözleşme örneğini oluşturma
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// Yeni bir kullanıcı ekleme işlemi
function addUser(username, age) {
  contractInstance.methods.addUser(username, age).send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}

// Kullanıcı bilgilerini alma işlemi
function getUserInfo() {
  contractInstance.methods.getUserInfo().call({ from: web3.eth.defaultAccount }, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      console.log('Kullanıcı Bilgileri:', result);
    }
  });
}

// Ürün ekleme işlemi
function addProduct(name, description, price) {
  contractInstance.methods.addProduct(name, description, web3.utils.toWei(price.toString(), 'ether')).send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}

// Ürün bilgilerini alma işlemi
function getProductInfo(productId) {
  contractInstance.methods.getProductInfo(productId).call({ from: web3.eth.defaultAccount }, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      const priceInEther = web3.utils.fromWei(result[2].toString(), 'ether');
      console.log('Ürün Bilgileri:', result[0], result[1], priceInEther);
    }
  });
}

// Kullanıcıya ait sepete ürün ekleme işlemi
function addToCart(productId, quantity) {
  contractInstance.methods.addToCart(productId, quantity).send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}

// Kullanıcıya ait sepetteki ürünü çıkarma işlemi
function removeFromCart(productId, quantity) {
  contractInstance.methods.removeFromCart(productId, quantity).send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}

// Sipariş verme işlemi
function placeOrder() {
  contractInstance.methods.placeOrder().send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}

// Sipariş iade etme işlemi
function returnOrder(orderId) {
  contractInstance.methods.returnOrder(orderId).send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}

// Siparişi iade etme işlemi
function refundOrder(orderId) {
  contractInstance.methods.refundOrder(orderId).send({ from: web3.eth.defaultAccount })
    .on('transactionHash', function(hash) {
      console.log('İşlem hash:', hash);
    })
    .on('receipt', function(receipt) {
      console.log('İşlem onaylandı:', receipt);
    })
    .on('error', function(error) {
      console.error(error);
    });
}
