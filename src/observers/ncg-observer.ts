import { IObserver } from ".";
import { IMonitorStateStore } from "../interfaces/monitor-state-store";
import { IMinter } from "../interfaces/minter";
import { BlockHash } from "../types/block-hash";
import { NCGTransferredEvent } from "../types/ncg-transferred-event";
import { TransactionLocation } from "../types/transaction-location";
import { Currency } from "@planetarium/tx";
import Decimal from "decimal.js";

export const NCG: Currency = {
    decimalPlaces: 0x02,
    minters: null,
    ticker: "NCG",
    totalSupplyTrackable: false,
    maximumSupply: null
};

export class NCGObserver implements IObserver<{
    blockHash: BlockHash,
    events: (NCGTransferredEvent & TransactionLocation)[];
}>
{
    private readonly _monitorStateStore: IMonitorStateStore;
    private readonly _minter: IMinter;
    
    constructor(monitorStateStore: IMonitorStateStore, minter: IMinter) {
        this._monitorStateStore = monitorStateStore;
        this._minter = minter;
    }

    async notify(data: { blockHash: BlockHash; events: (NCGTransferredEvent & TransactionLocation)[]; }): Promise<void> {
        const { events } = data;

        for ( const {blockHash, txId, amount, memo: recipient} of events)
        {
            await this._monitorStateStore.store("nine-chronicles", {
                blockHash,
                txId,
            });

            const rawValue = BigInt(new Decimal(amount).mul(100).floor().toNumber());
            await this._minter.mintAssets([{ recipient, amount: {currency: NCG, rawValue } }]);
        }
    }
}