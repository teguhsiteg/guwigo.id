import crypto from "crypto";

export interface DanaConfig {
  baseUrl: string;
  merchantId: string;
  clientKey: string;
  privateKey: string;
}

export const defaultDanaConfig: DanaConfig = {
  baseUrl: process.env.DANA_BASE_URL || "https://api.sandbox.dana.id",
  merchantId: process.env.DANA_MERCHANT_ID || "216620090025052392875",
  clientKey: process.env.DANA_CLIENT_KEY || "2026092522010827450865",
  privateKey:
    process.env.DANA_PRIVATE_KEY ||
    `MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmFUti1nvF1YT+aMCdUupX5tzDeyavPM3Uob6DpMS+HavtM28zAYyrjcj+z2iEfeKDc+eekc1iXLvUcPEH6/IO3+sI/D5leZ3WAp07OKygPj1T969h+OzuKO4aBYdtwvH2jfBhOx1KKhvBnF21mcu/z8MqQruRZmAyJrxi56SAOwKrJkrSYBoawjDowYo4mkqYUxfUVM3rJ4pUBqlSgs0cPAypUU5IA2rUB/qVSnvHUCj/gY/tWWSm8rnCK+GOxTmeB7SFLONKdClr/nzG4YGwcSx8Hh9nqJtR9hyHLrCxt7OrZBKNAY8tdKwcAtbZ7E9tr1PmoznThorqJ6Xk/iYvAgMBAAECggEAK0BCaJPomcWYI9TNzGqqYofZmAK7OUmBZM1WWtwO7F+3xUbuv364znhXDpye4FoUIh2OBQp9TQ9PTuy2qFR2rg78G1PtP+njA7eckK6argRnXjWTc9Uqhn8cOqST9y6capPeNMP7RbQflFUPRlqt597IOXo1dJEPnh/eUXd3rHjFcUDpzNtyF92vmlTxnW6NSfa7XUjwfju+Xm9vCCqitmuuimd+/Vi+1HU5HvqhVUoySRvM5SNJ+ekxQ+LeTnyv0jn+iD1AvZxYrF+C1WGL/pJm9IUV7Tdy3xwYS+ns87ukuGdnIJAsPso89OlvzzZZEpJMx1dS2I50/lOZ8z0TuQKBgQC2mHU5KwpLcsuM3PbH1+OjkJyDtTwz21INzpbWito4LQnqJeKc1Hlnb0qDJsF3jEyuMrCWVvpBKzb6TvHU2MeDEw5o/HO4e3B4d2qOmV9yoFaxKMiYpzQ85ekNJ09xtbwjUY5gskAtvvuBo1Ggptp643tQ9e7gnhsvRQrawe9/9QKBgQDo2X4Rs7x7IhB6b8WZpd/n5WiXF1YxpXPUS/2rKByTid3tUrpQ1y+nAdx6LHcaKUp+oqp0pVqEWTOXxlK4pa+9bdUHhZtJwU2qX+2QxrWXmnwbX6Ibsb/NEQiGKDRubvn7awmdoqq/uGJ1zDg+RkwCg+H5C7uAInw1m+TLomOrEwKBgAaYRQuWiV2mPMHOrT8Uhg0/SNfc8NqynikPgBUpmK4Uulnxmlitt+DLfTZ1bOFjeNWF0Sjs5Ub7R5YMyeE1HyeVxZx3GbrdAnfnYDrcQT1Dmz30yiHxUAqvBxbJh64EsVHZPToy1eyRDEZnXqhdvmBX3PlUmJcWPscbSEQUYxENAoGAHOVovL+mY0196APY7NFl8PxKN33g53ZV4oGvsD7hFPol/V6n2oJp2nrjppHAEhIPuZlsN9+RVR1QxsQI3ftJzONFbZKKC+QeREd1TuMqA+9a+Xarwm4TlFpJyYRRxWamRSoqXlKih/pU1bOLQ0csBZ/iOirXkPY2ndyDzzWO0tsCgYEAtGz75EW/sgeEgDiBFXiVgjUgD24OCpHIL049i1ibaP6MMlHyiJW7MLjQBLgA0MXrtR2DQrtLoXWnw6jTL3KE3tWatYHdG45Xe3bSteGyBcv8HmbH5Rcpb1b61+DT5fEfo7NLV9MGq2kK0zqaEc+3PKAqiSB2UypS5LZKckQ7FbE=`,
};

function formatPemKey(rawKey: string): string {
  if (rawKey.includes("BEGIN PRIVATE KEY")) return rawKey;
  return `-----BEGIN PRIVATE KEY-----\n${rawKey.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;
}

function getWibTimestamp(): string {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const wib = new Date(utc + 7 * 3600000);

  const YYYY = wib.getFullYear();
  const MM = String(wib.getMonth() + 1).padStart(2, "0");
  const DD = String(wib.getDate()).padStart(2, "0");
  const hh = String(wib.getHours()).padStart(2, "0");
  const mm = String(wib.getMinutes()).padStart(2, "0");
  const ss = String(wib.getSeconds()).padStart(2, "0");

  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}+07:00`;
}

function generateRsaSignature(stringToSign: string, privateKeyPem: string): string {
  const sign = crypto.createSign("SHA256");
  sign.update(stringToSign);
  sign.end();
  return sign.sign(privateKeyPem, "base64");
}

function sha256Hex(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
}

/**
 * 1. Get DANA B2B Access Token
 */
export async function getDanaB2BAccessToken(config: DanaConfig = defaultDanaConfig): Promise<string> {
  const timestamp = getWibTimestamp();
  const pem = formatPemKey(config.privateKey);
  const sts = `${config.clientKey}|${timestamp}`;
  const signature = generateRsaSignature(sts, pem);

  const response = await fetch(`${config.baseUrl}/v1.0/access-token/b2b.htm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": signature,
      "X-CLIENT-KEY": config.clientKey,
    },
    body: JSON.stringify({ grantType: "client_credentials" }),
  });

  const data = await response.json();
  if (!response.ok || !data.accessToken) {
    throw new Error(`DANA Auth Failed: ${data.responseCode} - ${data.responseMessage}`);
  }

  return data.accessToken;
}

/**
 * 2. Consult Pay - Get available payment methods from DANA
 */
export async function consultPay(
  amountValue: string = "150000.00",
  currency: string = "IDR",
  config: DanaConfig = defaultDanaConfig
) {
  const timestamp = getWibTimestamp();
  const externalId = Date.now().toString().slice(0, 16);
  const token = await getDanaB2BAccessToken(config);
  const pem = formatPemKey(config.privateKey);

  const body = {
    partnerReferenceNo: externalId,
    merchantId: config.merchantId,
    amount: {
      value: amountValue,
      currency,
    },
    additionalInfo: {},
  };

  const bodyStr = JSON.stringify(body);
  const hexBody = sha256Hex(bodyStr);
  const sts = `POST:/v1.0/payment-gateway/consult-pay.htm:${hexBody}:${timestamp}`;
  const signature = generateRsaSignature(sts, pem);

  const response = await fetch(`${config.baseUrl}/v1.0/payment-gateway/consult-pay.htm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": signature,
      "X-PARTNER-ID": config.clientKey,
      "X-EXTERNAL-ID": externalId,
      "CHANNEL-ID": "95221",
    },
    body: bodyStr,
  });

  const data = await response.json();
  return data;
}

/**
 * 3. Create Order - Host-to-Host (Cashier / Direct Debit)
 */
export async function createOrderHostToHost(
  params: {
    partnerReferenceNo: string;
    amountValue: string;
    currency?: string;
    returnUrl?: string;
    notifyUrl?: string;
    orderTitle?: string;
    rawPayload?: Record<string, any>;
  },
  config: DanaConfig = defaultDanaConfig
) {
  const timestamp = getWibTimestamp();
  const token = await getDanaB2BAccessToken(config);
  const pem = formatPemKey(config.privateKey);

  const payload = params.rawPayload || {
    partnerReferenceNo: params.partnerReferenceNo,
    merchantId: config.merchantId,
    amount: {
      value: params.amountValue,
      currency: params.currency || "IDR",
    },
    urlParams: [
      {
        url: params.returnUrl || "https://guwigo.com/store/checkout/finish",
        type: "PAY_RETURN",
        isDeeplink: "N",
      },
      {
        url: params.notifyUrl || "https://guwigo.com/api/dana-webhook",
        type: "NOTIFICATION",
        isDeeplink: "N",
      },
    ],
    additionalInfo: {
      orderTitle: params.orderTitle || "Guwigo Service Order",
    },
  };

  const path = "/payment-gateway/v1.0/debit/payment-host-to-host.htm";
  const bodyStr = JSON.stringify(payload);
  const hexBody = sha256Hex(bodyStr);
  const sts = `POST:${path}:${hexBody}:${timestamp}`;
  const signature = generateRsaSignature(sts, pem);

  const response = await fetch(`${config.baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-TIMESTAMP": timestamp,
      "X-SIGNATURE": signature,
      "X-PARTNER-ID": config.clientKey,
      "X-EXTERNAL-ID": params.partnerReferenceNo,
      "CHANNEL-ID": "95221",
    },
    body: bodyStr,
  });

  const data = await response.json();
  return data;
}
