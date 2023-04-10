import * as web3 from "@solana/web3.js";
import { createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

(async () => {

    //create connection to devnet
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");

    //generate payer and airdrop 1 SOL
    let payer = web3.Keypair.generate();
    console.log(payer.publicKey)
    let airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        web3.LAMPORTS_PER_SOL * 1,
    );
    await connection.confirmTransaction({ signature: airdropSignature });
    
    // Get the balance of the account after the airdrop
    let balance = await connection.getBalance(payer.publicKey);
    console.log(`Account balance: ${balance} SOL`);

    console.log('solana public address: ' + payer.publicKey.toBase58());

    //set timeout to account for airdrop finalization
    const mintAuthority = web3.Keypair.generate();
    const freezeAuthority = web3.Keypair.generate();
    let mint;
    var tokenAccount
    setTimeout(async function(){ 
        //create mint
        mint = await createMint(connection, payer, mintAuthority.publicKey, freezeAuthority.publicKey, 9)
        console.log(mint.toBase58());
        const mintInfo = await getMint(
            connection,
            mint
        )
        console.log(mintInfo.supply);
        console.log('mint public address: ' + mint);

        //get the token accuont of this solana address, if it does not exist, create it
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        )
        
        console.log(tokenAccount.address.toBase58());

        //minting 100 new tokens to the token address we just created
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            mintAuthority,
            100000000000 // because decimals for the mint are set to 9 
        )

        console.log('done');

    }, 5000);

})();