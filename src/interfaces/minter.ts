import { Currency } from "@planetarium/tx";
import { TxId } from "../types/txid";
import { FungibleItemId } from "../types/fungible-item-id";
import { Address } from "@planetarium/account";
import Decimal from "decimal.js";

export interface IMinter {
    getMinterAddress(): Promise<Address>;
    
    mintFungibleAssets(
        recipient: string,
        amount: Decimal,
        currency: Currency,
    ): Promise<TxId>;

    mintFungibleItem(
        recipient: string,
        fungibleItemId: FungibleItemId,
        count: number,
    ): Promise<TxId>;
}
