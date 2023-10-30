import { IHeadlessGraphQLClient } from "../interfaces/headless-graphql-client";
import { NCGTransferredEvent } from "../types/ncg-transferred-event";
import { TransactionLocation } from "../types/transaction-location";
import { NineChroniclesMonitor } from "./ninechronicles-block-monitor";

export class NCGTransferredMonitor extends NineChroniclesMonitor<NCGTransferredEvent> {
    private readonly _address: string;

    constructor(
        latestTransactionLocation: TransactionLocation | null,
        headlessGraphQLClient: IHeadlessGraphQLClient,
        address: string
    ) {
        super(latestTransactionLocation, headlessGraphQLClient);
        this._address = address;
    }

    protected async getEvents(
        blockIndex: number
    ): Promise<(NCGTransferredEvent & TransactionLocation)[]> {
        const blockHash = await this._headlessGraphQLClient.getBlockHash(
            blockIndex
        );
        return await this._headlessGraphQLClient.getNCGTransferredEvents(
            blockHash,
            this._address
        );
    }
}
