import { Address } from "@planetarium/account";
import { BlockHash } from "../types/block-hash";
import { GarageUnloadEvent } from "../types/garage-unload-event";
import { NCGTransferredEvent } from "../types/ncg-transferred-event";
import { AssetBurntEvent } from "../types/asset-burnt-event";

export interface IHeadlessGraphQLClient {
    readonly endpoint: string;

    getBlockIndex(blockHash: BlockHash): Promise<number>;
    getTipIndex(): Promise<number>;
    getBlockHash(index: number): Promise<BlockHash>;
    getNCGTransferredEvents(
        blockHash: BlockHash,
        recipient: Address,
    ): Promise<NCGTransferredEvent[]>;
    getGarageUnloadEvents(
        blockIndex: number,
        agentAddress: Address,
        avatarAddress: Address,
    ): Promise<GarageUnloadEvent[]>;
    getAssetBurntEvents(blockIndex: number): Promise<AssetBurntEvent[]>;
    getNextTxNonce(address: string): Promise<number>;
    getGenesisHash(): Promise<string>;
    stageTransaction(payload: string): Promise<string>;
}
