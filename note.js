// Algorand Algod (v2) example 
// Send transaction on TestNet

const algosdk = require('algosdk');
const baseServer = "https://testnet-algorand.api.purestake.io/ps2";
const port = "";

const token = {
    'X-API-key': 'af4Dyq6Pxb8c7I0ddWtJDH8naWswPcM6P1IYuiXb',
}

let algodClient = new algosdk.Algodv2(token, baseServer, port);

(async () => {

    let params = await algodClient.getTransactionParams().do();

    const sk_b64 = '5Is32Gu+93CQjQMkUBs6eptcgdOd6v6QLOROiZ2f6Wz2Rh0tUsR2zZy7UW/xVp3Vzcyna4atOp7MY+h38/Knxg=='; // secret key as base64
    const sk_bytes = Buffer.from(sk_b64, 'base64'); // or for browsers, Uint8Array.from(atob(sk_b64), c => c.charCodeAt(0));
    const mnemonic = algosdk.secretKeyToMnemonic(sk_bytes);

    var recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);

    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    let note = `{"id":0,"type":"meteo-station","temperature":${getRandomArbitrary(20, 25)},"humidity":${getRandomArbitrary(0, 100)},"luminosity":${getRandomArbitrary(0, 10)}}`;

    var lastValid = params.lastRound;

    let txn = {
        "from": recoveredAccount.addr,
        "to": recoveredAccount.addr,
        "fee": 0,
        "amount": 0,
        "firstRound": lastValid - 1000,
        "lastRound": lastValid,
        "genesisID": params.genesisID,
        "genesisHash": params.genesisHash,
        "note": new TextEncoder().encode(note)
    };

    let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);

    let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();

    console.log("Transaction : " + sendTx.txId);

})().catch(e => {
    console.log(e);
});
