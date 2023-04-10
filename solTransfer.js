import * as web3 from "@solana/web3.js";
import * as dotenv from 'dotenv'
dotenv.config()

// Creating a connection with devnet solana
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

// Generating a random account to transfer SOL from
let payer = web3.Keypair.generate();
console.log(payer.publicKey)

// Airdrop SOL for paying transactions
let airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL * 1,
);

await connection.confirmTransaction({ signature: airdropSignature });

// Get the balance of the account after the airdrop
let balance = await connection.getBalance(payer.publicKey);
console.log(`Account balance: ${balance} SOL`);

// Account to transfer the amount to. Wallet must be created beforehand in Backpack or any other alternative
const your_account_public_key = process.env.ACCOUNT_PUBLIC_KEY
const toAccount = new web3.PublicKey(your_account_public_key);
console.log(toAccount)

// Create Simple Transaction
let transaction = new web3.Transaction();

// Add an instruction to execute
transaction.add(
  web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount,
    lamports: 100,
  }),
);

// Send and confirm transaction
await web3.sendAndConfirmTransaction(connection, transaction, [payer]);