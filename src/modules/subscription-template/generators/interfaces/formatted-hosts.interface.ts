import { StreamSettingsObject } from '@common/helpers/xray-config/interfaces/transport.config';

import { IDbHostData } from './raw-host.interface';

export interface IFormattedHost {
    address: string;
    alpn: string;
    fingerprint: string;
    host: string;
    network: StreamSettingsObject['network'];
    password: {
        ssPassword: string;
        trojanPassword: string;
        vlessPassword: string;
    };
    path: string;
    publicKey: string;
    port: number;
    protocol: string;
    remark: string;
    shortId: string;
    sni: string;
    spiderX: string;
    tls: string;
    additionalParams?: {
        mode?: string;
        heartbeatPeriod?: number;
        grpcMultiMode?: boolean;
    };
    xHttpExtraParams?: null | object;
    muxParams?: null | object;
    sockoptParams?: null | object;
    serverDescription?: string;
    allowInsecure?: boolean;
    shuffleHost?: boolean;
    mihomoX25519?: boolean;
    dbData?: IDbHostData;
    mldsa65Verify?: string;
    encryption?: string;
    ssServerPassword?: string; // Server PSK for SS2022 multi-user mode
    flow?: 'xtls-rprx-vision' | '';
    xrayJsonTemplate?: object | null;
    rawSettings?: {
        headerType?: string;
        request?: object;
    };
    socksCredentials?: {
        username?: string;
        password?: string;
        auth?: string;
        udp?: boolean;
    };
}
