import { Keypair, Connection, PublicKey, clusterApiUrl, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import { Wallet } from "@coral-xyz/anchor";
import { CollectionAuthorityRecord, Metadata  } from "@metaplex-foundation/mpl-token-metadata";
import bs58 from 'bs58';
import dotenv from "dotenv"
dotenv.config()

const secret = process.env.PRIVATE_KEY;

const secretKey = bs58.decode(secret);
const wallet = Keypair.fromSecretKey(secretKey);

// const secret2 = process.env.DELEGATE_ADDRESS;
// const secretKey2 = bs58.decode(secret2);
// const wallet2 = Keypair.fromSecretKey(secretKey2);

// const wallet = new Wallet(Keypair.fromSecretKey(secretKey));
console.log("PublicKey:", wallet.publicKey) // .toBase58()

const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
const metaplex = new Metaplex(connection);
metaplex.use(keypairIdentity(wallet));

if (!metaplex) {
    console.log('connection error')
}
console.log('get metaplex connection')

async function delegate() {
    const mint_address = new PublicKey('5hdP5k8iE95z5PG1S45snQHEHejzsPiVnbBQ13LEYv1B')

    const transaction = new Transaction().add(
        ...metaplex.nfts().builders().delegate({
            nftOrSft: {address:mint_address, tokenStandard:4}, // nft,
            authorizationDetails: {
                rules: new PublicKey('eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9'),
            },
            delegate: {
                type: "UtilityV1",//ProgrammableConfigV1
                delegate: wallet.publicKey,
                owner: wallet.publicKey, //new PublicKey('Gz75fy1hTYF1msvxtsNkZiF2gDkBRTXggZQek4q68yT9'),//owner,//updateAuthority
                data: {
                    amount: 1,
                },
            },
        }).getInstructions(),

        // ...metaplex.nfts().builders().freezeDelegatedNft({ // Invalid token standard
        //     mintAddress: mint_address,
        //     delegateAuthority: wallet,
        // }).getInstructions(),
    )

    const blockhash = await connection.getLatestBlockhash();
    if (!blockhash) {
        console.log("didn't get blockhash")
    }
    // console.log('get blockhash', blockhash)

    transaction.feePayer = metaplex.identity().publicKey;
    // transaction.feePayer = wallet2.publicKey;
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.lastValidBlockHeight = blockhash.lastValidBlockHeight;
    // console.log('transaction:', transaction)

    const confirmOption = { skipPreflight: true }

    try {
        const send = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
            // [wallet2],
            // confirmOption
        ); //skipPreflight:true
        console.log('Transaction complete.', send);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function lock() {
    const mint_address = new PublicKey('9S5RqgVP1PKoaFRjcx9mX4MP2dnoPxKVoicuuZqdmdFx')

    const transaction = new Transaction().add(
        ...metaplex.nfts().builders().lock({
            nftOrSft: {address:mint_address, tokenStandard:4}, // nft,
            authorizationDetails: {
                rules: new PublicKey('eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9'),
            },
            authority: {
                __kind: 'tokenDelegate',
                delegate: wallet,
                owner: wallet.publicKey,
                type: "UtilityV1", // authority_type
            },
        }).getInstructions(),
    )

    const blockhash = await connection.getLatestBlockhash();
    if (!blockhash) {
        console.log("didn't get blockhash")
    }
    // console.log('get blockhash', blockhash)

    transaction.feePayer = metaplex.identity().publicKey;
    // transaction.feePayer = wallet2.publicKey;
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.lastValidBlockHeight = blockhash.lastValidBlockHeight;
    // console.log('transaction:', transaction)

    const confirmOption = { skipPreflight: true }

    try {
        const send = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
            // [wallet2],
            // confirmOption
        ); //skipPreflight:true
        console.log('Transaction complete.', send);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function unlock() {
    const mint_address = new PublicKey('5hdP5k8iE95z5PG1S45snQHEHejzsPiVnbBQ13LEYv1B')

    const transaction = new Transaction().add(
        ...metaplex.nfts().builders().unlock({
            nftOrSft: {address:mint_address, tokenStandard:4}, // nft,
            authorizationDetails: {
                rules: new PublicKey('eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9'),
            },
            authority: {
                __kind: 'tokenDelegate',
                delegate: wallet,
                owner: wallet.publicKey,
                type: "UtilityV1",
            },
        }).getInstructions(),
    )

    const blockhash = await connection.getLatestBlockhash();
    if (!blockhash) {
        console.log("didn't get blockhash")
    }
    // console.log('get blockhash', blockhash)

    transaction.feePayer = metaplex.identity().publicKey;
    // transaction.feePayer = wallet2.publicKey;
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.lastValidBlockHeight = blockhash.lastValidBlockHeight;
    // console.log('transaction:', transaction)

    const confirmOption = { skipPreflight: true }

    try {
        const send = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
            // [wallet2],
            // confirmOption
        ); //skipPreflight:true
        console.log('Transaction complete.', send);
    } catch (error) {
        console.error('Error:', error);
    }
}

// delegate();
// lock();
unlock();

