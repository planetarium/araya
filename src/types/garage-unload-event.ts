import { Currency } from "@planetarium/tx";
import { FungibleItemId } from "./fungible-item-id";
import { TxId } from "./txid";
import Decimal from "decimal.js";
import { Address } from "@planetarium/account";

export interface GarageUnloadEvent {
    txId: TxId;
    fungibleAssets: [[Address, Currency, Decimal]];
    fungibleItems: [[Address, FungibleItemId, number]];
    memo: string | null;
}
