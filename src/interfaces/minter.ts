import { Currency } from "@planetarium/tx";
import { TxId } from "../types/txid";
import { FungibleItemId } from "../types/fungible-item-id";
import { Address } from "@planetarium/account";
import Decimal from "decimal.js";

export interface IFungibleAssetValues
{
    recipient: string,
    amount: Decimal,
    currency: Currency,
}

export interface IFungibleItems
{
    recipient: string,
    fungibleItemId: FungibleItemId,
    count: number,
}

export interface IMinter {
    getMinterAddress(): Promise<Address>;

    mintAssets(assets: [IFungibleAssetValues | IFungibleItems]): Promise<TxId>;
}
