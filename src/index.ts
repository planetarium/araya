import 'dotenv/config';
import { NCGTransferredMonitor } from './monitors/ncg-transferred-monitor';
import { HeadlessGraphQLClient } from './headless-graphql-client';
import { IMonitorStateStore } from './interfaces/monitor-state-store';
import { Sqlite3MonitorStateStore } from './sqlite3-monitor-state-store';
import { LockObserver } from './observers/lock-observer';
import { Minter } from './minter';
import { RawPrivateKey } from '@planetarium/account';

(async() => {
    const upstreamGQLClient = new HeadlessGraphQLClient(
        process.env.NC_UPSTREAM_GQL_ENDPOINT,
        3
    );
    const downstreamGQLClient = new HeadlessGraphQLClient(
        process.env.NC_DOWNSTREAM_GQL_ENDPOINT,
        3
    );
    const monitorStateStore: IMonitorStateStore = await Sqlite3MonitorStateStore.open(
        process.env.MONITOR_STATE_STORE_PATH
    );
    
    const nineChroniclesMonitor = new NCGTransferredMonitor(
        await monitorStateStore.load("nineChronicles"),
        upstreamGQLClient,
        process.env.NC_VAULT_ADDRESS
    );

    const upstreamAccount = RawPrivateKey.fromHex(
        process.env.NC_UPSTREAM_PRIVATE_KEY
    );
    const downstreamAccount = RawPrivateKey.fromHex(
        process.env.NC_DOWNSTREAM_PRIVATE_KEY
    );

    const minter = new Minter(
        downstreamAccount,
        downstreamGQLClient
    );
    
    nineChroniclesMonitor.attach(
        new LockObserver(
            monitorStateStore, 
            minter
        )
    );

    nineChroniclesMonitor.run();    
})().catch(error => {
    console.error(error);
    process.exit(-1);
});
