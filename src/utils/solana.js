import {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import bs58 from "bs58";
import { ed25519 } from "@noble/curves/ed25519";
import { solanaNetwork } from "./network";

/**
 * 异步验证 Base58 私钥是否有效，并返回对应的公钥
 * @param {string} base58SecretKey - 用户输入的 Base58 编码的私钥
 * @returns {Promise<{ valid: boolean, publicKey?: string, error?: string }>}
 */
export const validatePrivateKey = async (base58SecretKey) => {
  try {
    // Base58 解码
    const secretKeyArray = bs58.decode(base58SecretKey);

    // 检查长度是否正确
    if (secretKeyArray.length !== 64) {
      throw new Error("Invalid private key length (must be 64 bytes)");
    }

    // 模拟异步操作（可以替换为真实的 API 调用）
    await new Promise((resolve) => setTimeout(resolve, 100));

    // 尝试创建 Keypair
    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
    const publicKey = keypair.publicKey.toBase58();
    if (!publicKey) {
      return false;
    } else {
      return true
    }
  } catch (error) {
    return false;
  }
};


/**
 * 根据 Base58 私钥异步获取公钥
 * @param {string} base58SecretKey - Base58 编码的私钥
 * @returns {Promise<string>} - 返回 Base58 编码的公钥
 */
export const getPublicKeyFromPrivateKey = async (base58SecretKey) => {
  return new Promise((resolve, reject) => {
    try {
      // 解码 Base58 私钥
      const secretKeyArray = bs58.decode(base58SecretKey);

      // 通过私钥生成 Keypair
      const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));

      // 返回公钥的 Base58 编码
      resolve(keypair.publicKey.toBase58());
    } catch (error) {
      console.error("error:", error.message);
      reject(new Error("The private key format is incorrect. Please check the input"));
    }
  });
};



/**
 * 获取 Solana 账户余额
 * @param {string} publicKeyStr - Solana 账户地址（Base58 格式）
 * @param {string} [rpcUrl="https://api.mainnet-beta.solana.com"] - Solana RPC URL，默认使用主网
 * @returns {Promise<{ success: boolean, balance?: number, error?: string }>}
 */
export const getSolanaBalance = async (publicKeyStr, rpcUrl = solanaNetwork) => {
  try {
    // 连接到 Solana 网络
    const connection = new Connection(rpcUrl, "confirmed");

    // 转换公钥
    const publicKey = new PublicKey(publicKeyStr);

    // 获取余额（单位是 lamports）
    const balanceLamports = await connection.getBalance(publicKey);

    // Solana 1 SOL = 1,000,000,000 lamports
    const balanceSol = balanceLamports / 1_000_000_000;

    return { success: true, balance: balanceSol };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


/**
 * 使用私钥签名消息
 * @param {string} secretKeyBase58 - Base58 编码的私钥
 * @param {string} message - 需要签名的消息
 * @returns {string} - Base58 编码的签名
 */
export const signMessage = (secretKeyBase58, message) => {
  try {
    // 解码 Base58 编码的私钥
    const secretKey = bs58.decode(secretKeyBase58);
    
    // 使用 @noble/curves/ed25519 的签名方法
    const signature = ed25519.sign(new TextEncoder().encode(message), secretKey.slice(0, 32));

    // 返回 Base58 编码的签名
    return bs58.encode(signature);
  } catch (error) {
    console.error("error:", error.message);
    throw new Error("Signature failed, please check the private key or input content");
  }
};

/**
 * 验证签名
 * @param {string} publicKeyBase58 - Base58 编码的公钥
 * @param {string} message - 原始消息
 * @param {string} signatureBase58 - Base58 编码的签名
 * @returns {boolean} - 验证是否成功
 */
export const verifySignature = (publicKeyBase58, message, signatureBase58) => {
  try {
    const publicKey = bs58.decode(publicKeyBase58);
    const messageBuffer = new TextEncoder().encode(message);
    const signature = bs58.decode(signatureBase58);

    // 使用 @noble/curves/ed25519 进行签名验证
    return ed25519.verify(signature, messageBuffer, publicKey);
  } catch (error) {
    console.error("error:", error.message);
    return false;
  }
};


/**
 * 使用 Solana 私钥进行转账交易
 * @param {string} base58SecretKey - 私钥的 Base58 编码
 * @param {string} toPubKeyBase58 - 转账目标的公钥（Base58 编码）
 * @param {number} amountInSol - 转账金额（单位为 SOL）
 * @returns {Promise<string>} - 返回交易的 ID
 */
export const transferSol = async (base58SecretKey, toPubKeyBase58, amountInSol, netWork) => {
  // 创建连接到 Solana 主网的对象
  const connection = new Connection(netWork, "confirmed");
  try {
    // 解码 Base58 私钥
    const secretKeyArray = bs58.decode(base58SecretKey);
    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));  // 通过私钥生成 Keypair

    // 将 SOL 转换为 lamports（1 SOL = 1,000,000,000 lamports）
    const lamports = amountInSol * 1_000_000_000;

    // 创建交易对象，转账操作
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(toPubKeyBase58),  // 转账目标公钥
        lamports: lamports,  // 转账金额
      })
    );
    // 获取最新的区块高度
    const latestBlockhash = await connection.getLatestBlockhash();
    // 设置交易的区块高度和费用支付者
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.feePayer = keypair.publicKey;

    // 使用私钥对交易进行签名
    transaction.sign(keypair);

    // 发送交易并确认
    const txid = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    console.log('solana-txid:', txid); //hPdfJE3MFvtrrHKiLHk9b5VaMf8Dw8dBNUoAMsJRWc2f95anjFBWmDAQJGJiwh16vqXAPk8HfVDpf9kurEWQdhR
    // 返回交易的 ID
    return txid;
  } catch (error) {
    console.error('error:', error.message);
    throw new Error(`error:: ${error.message}`);
  }
};



