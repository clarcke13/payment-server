const CryptoJS = require("crypto-js");

// Примерный код для создания подписи для платежа
function generateOrderDetails(amount) {
  const secretKey = "cc1e6d503434237dddb3966c9cde442e3bd2b9d4"; // Ваш секретный ключ
  const merchantAccount = "taxstrangiii2_webflow_io";
  const merchantAuthType = "SimpleSignature";
  const merchantDomainName = "obigriyou.webflow.io";
  const currency = "UAH";

  const orderReference = "ORD" + Date.now() + Math.floor(Math.random() * 1000);
  const orderDate = Math.floor(Date.now() / 1000);

  const data = {
    merchantAccount,
    merchantAuthType,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    productName: [],
    productCount: [],
    productPrice: [],
  };

  const signatureString = [
    data.merchantAccount,
    data.merchantDomainName,
    data.orderReference,
    data.orderDate,
    data.amount,
    data.currency,
    ...data.productName,
    ...data.productCount,
    ...data.productPrice,
  ].join(";");

  const signature = CryptoJS.HmacMD5(signatureString, secretKey).toString(
    CryptoJS.enc.Hex
  );

  return { data, signature };
}

module.exports = { generateOrderDetails };
