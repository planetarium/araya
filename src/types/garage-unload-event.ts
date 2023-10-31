import { Currency } from "@planetarium/tx";
import { FungibleItemId } from "./fungible-item-id";
import { TxId } from "./txid";
import Decimal from "decimal.js";

export interface GarageUnloadEvent {
    txId: TxId;
    fungibleAssets: [[Currency, Decimal]];
    fungibleItems: [[FungibleItemId, number]];
    memo: string | null;
}
