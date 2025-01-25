// netlify/functions/payment.js
const CryptoJS = require("crypto-js");

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Разрешает запросы с любого источника
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Разрешает методы
    "Access-Control-Allow-Headers": "Content-Type", // Разрешает передавать Content-Type
  };

  // Печатаем "Hello" для проверки выполнения функции
  console.log("Hello from payment function!");

  // Проверяем метод запроса (если это не POST, то возвращаем ошибку)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      headers,
      body: JSON.stringify({ message: "Only POST method is allowed." }),
    };
  }

  try {
    // Здесь используем переменные окружения из настроек Netlify (например, через конфигурацию сайта)
    const secretKey = process.env.SECRET_KEY;
    const merchantAccount = process.env.MERCHANT_ACCOUNT;
    const merchantAuthType = "SimpleSignature";
    const merchantDomainName = process.env.MERCHANT_DOMAIN_NAME;
    const currency = process.env.CURRENCY;

    const orderReference =
      "ORD" + Date.now() + Math.floor(Math.random() * 1000);
    const orderDate = Math.floor(Date.now() / 1000);

    const amount = JSON.parse(event.body).amount; // Получаем сумму из запроса

    const data = {
      merchantAccount,
      merchantAuthType,
      merchantDomainName,
      orderReference,
      orderDate,
      amount,
      currency,
      productName: [], // Продукты
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

    // Печатаем "Hello" перед возвратом успешного ответа
    console.log("Hello again, payment processing complete!");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data, signature }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
