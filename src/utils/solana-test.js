const { Keypair } = require("@solana/web3.js");
const {ed25519 } = require('@noble/curves/ed25519');
const bs58 = require("bs58").default;

// Generate account
// const keypair = Keypair.generate();
// const publicKey = keypair.publicKey.toBase58();
// const secretKey = keypair.secretKey;
// const secretKeyBase58 = bs58.encode(secretKey)

// console.log('publicKey:',publicKey); // BxzzKq1JwgGUdKWF3HifSETpS5UAQ2Sc7Uuj5umVYUWS
// console.log('secretKeyBase58=', secretKeyBase58); // 5wPa5TqhDf3AzMvaVdm3atmkm9FciRaxLu6goXpTkcD3Jyc3fLekEtmQxjKigpN6GGy3caDGPzBvujiMdveSbrZk
// console.log('secretKey-Array=', JSON.stringify(Array.from(secretKey))); // [246,248,155,180,158,221,4,108,48,136,243,110,180,133,174,234,98,173,232,142,54,112,136,125,32,217,66,152,45,162,7,43,162,237,97,163,196,247,62,190,96,228,207,31,177,43,115,5,148,200,153,62,100,189,65,95,205,21,183,17,107,3,70,143]

// Restore account
// const userInputBase58 = '5wPa5TqhDf3AzMvaVdm3atmkm9FciRaxLu6goXpTkcD3Jyc3fLekEtmQxjKigpN6GGy3caDGPzBvujiMdveSbrZk';
// const secretKeyArray = new Uint8Array(bs58.decode(userInputBase58));
// const keypair2 = Keypair.fromSecretKey(secretKeyArray);

// console.log("Recovered Account:", {
//   publicKey: keypair2.publicKey.toBase58(),
//   secretKey: keypair2.secretKey,
// });

// solana signMessage
function signMessage (secretKeyBase58, message){
  try {
    // Decode the Base58 encoded private key
    const secretKey = bs58.decode(secretKeyBase58);
    // use @noble/curves/ed25519 sign methond
    const signature = ed25519.sign(new TextEncoder().encode(message), secretKey.slice(0, 32));
    console.log('bs58.encode-signature=', bs58.encode(signature));
    // Returns the Base58 encoded signature
    return bs58.encode(signature);
  } catch (error) {
    console.error("error:", error.message);
    throw new Error("Signature failed, please check the private key or input content");
  }
};

// solana verifySignature
function verifySignature (publicKeyBase58, message, signatureBase58){
  try {
    const publicKey = bs58.decode(publicKeyBase58);
    const messageBuffer = new TextEncoder().encode(message);
    const signature = bs58.decode(signatureBase58);

    // Signature verification using @noble/curves/ed25519
    console.log('verifySignature=', ed25519.verify(signature, messageBuffer, publicKey));
    return ed25519.verify(signature, messageBuffer, publicKey);
  } catch (error) {
    console.error("error:", error.message);
    return false;
  }
};
 verifySignature('9y8KCWq4wpRXNRNZ6GSVfnPetQz3Sjkurd2PCqA6fBAh','123','66SVy4AEo75kQsBrtsxUxVtc3riEzqPE3VdQyayNrgEAqpd8R1R5s9SFQ3adLpEKWYxC5N7MrsL5q3xpc88yDj1V')

//signMessage('zjmQb3igKic4NpUpFRtMNbpHTh9z8Un3D294zUo7XrT65cxHoRVRziDwJojcMAUugriYhJvykFvzhVkTD1vy4a5','666')