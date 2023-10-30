import { BlockHash } from "../types/block-hash";
import { NCGTransferredEvent } from "../types/ncg-transferred-event";

export interface IHeadlessGraphQLClient {
    readonly endpoint: string;

    getBlockIndex(blockHash: BlockHash): Promise<number>;
    getTipIndex(): Promise<number>;
    getBlockHash(index: number): Promise<BlockHash>;
    getNCGTransferredEvents(
        blockHash: BlockHash,
        recipient: string
    ): Promise<NCGTransferredEvent[]>;
    getNextTxNonce(address: string): Promise<number>;
    getGenesisHash(): Promise<string>;
    stageTransaction(payload: string): Promise<string>;
}
