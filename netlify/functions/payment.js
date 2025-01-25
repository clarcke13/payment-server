const CryptoJS = require("crypto-js");

exports.handler = async (event, context) => {
  // Разрешаем доступ с Webflow
  const headers = {
    "Access-Control-Allow-Origin": "*", // Разрешает запросы с любого источника
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Разрешает методы
    "Access-Control-Allow-Headers": "Content-Type", // Разрешает передавать Content-Type
  };

  // Проверяем метод запроса (если это не POST, то возвращаем ошибку)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Method Not Allowed
      headers,
      body: JSON.stringify({ message: "Only POST method is allowed." }),
    };
  }

  try {
    // Примерный код для создания подписи для платежа
    const secretKey = "cc1e6d503434237dddb3966c9cde442e3bd2b9d4"; // Ваш секретный ключ
    const merchantAccount = "taxstrangiii2_webflow_io";
    const merchantAuthType = "SimpleSignature";
    const merchantDomainName = "obigriyou.webflow.io";
    const currency = "UAH";

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ data, signature }),
    };
  } catch (error) {
    return {
      statusCode: 500, // Internal Server Error
      headers,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
