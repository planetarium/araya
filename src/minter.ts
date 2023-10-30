import { Account, Address } from "@planetarium/account";
import { Currency, encodeCurrency, encodeSignedTx, signTx } from "@planetarium/tx";
import { IMinter } from "./interfaces/minter";
import { HeadlessGraphQLClient } from "./headless-graphql-client";
import { RecordView, encode } from "@planetarium/bencodex";
import Decimal from "decimal.js";

const MEAD_CURRENCY = {
    ticker: "Mead",
    decimalPlaces: 18,
    minters: null,
    totalSupplyTrackable: false,
    maximumSupply: null,
};

const additionalGasTxProperties = {
    maxGasPrice: {
        currency: MEAD_CURRENCY,
        rawValue: 10n ** 18n,
    },
    gasLimit: 4n,
};


export class Minter implements IMinter {
    private readonly _account: Account;
    private readonly _client: HeadlessGraphQLClient;
    
    constructor(account: Account, client: HeadlessGraphQLClient) {
        this._account = account;
        this._client = client;
    }
    
    getMinterAddress(): Promise<Address> {
        return this._account.getAddress();
    }

    mintFungibleItems(recipient: string, items: [[string, number]]): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    async mintFungibleAssets(recipient: string, amount: Decimal, currency: Currency): Promise<string> {
        const genesisHash = Buffer.from(
            await this._client.getGenesisHash(),
            "hex"
        );
        const minter = await this._account.getAddress();
        const action = new RecordView(
            {
                type_id: "mint_assets",
                values: [
                    [
                        Address.fromHex(recipient, true).toBytes(),
                        [
                            encodeCurrency(currency),
                            BigInt(amount.toNumber()),
                        ],
                        null,
                    ],
                ],
            },
            "text"
        );
        const nonce = BigInt(await this._client.getNextTxNonce(minter.toHex()));
        
        const unsignedTx = {
            nonce,
            genesisHash,
            publicKey: (await this._account.getPublicKey()).toBytes("uncompressed"),
            signer: minter.toBytes(),
            timestamp: new Date(),
            updatedAddresses: new Set([]),
            actions: [action],
            ...additionalGasTxProperties,
        };
        
        const tx = await signTx(unsignedTx, this._account);
        return this._client.stageTransaction(Buffer.from(encode(encodeSignedTx(tx))).toString("hex"));
    }
}