import { Injectable, Logger } from '@nestjs/common';

import { IFormattedHost } from './interfaces';
import { adaptSSPassword, combineSSPassword } from '@common/helpers/xray-config';

interface OutlineOutbound {
    method: string;
    password: string;
    server: string;
    server_port: number;
}

@Injectable()
export class OutlineGeneratorService {
    private readonly logger = new Logger(OutlineGeneratorService.name);

    generateConfig(hosts: IFormattedHost[], encodedTag: string): string {
        try {
            const decodedTag = Buffer.from(encodedTag, 'base64').toString('utf-8');

            const config: OutlineOutbound = {} as OutlineOutbound;

            for (const host of hosts) {
                if (!host || host.protocol !== 'shadowsocks') {
                    continue;
                }

                const outbound = this.makeOutbound(
                    host.address,
                    host.port,
                    combineSSPassword(
                        host.password.ssPassword,
                        host.ssServerPassword,
                        host.encryption || '2022-blake3-aes-256-gcm',
                    ),
                    host.encryption || '2022-blake3-aes-256-gcm',
                );

                if (!decodedTag) {
                    Object.assign(config, outbound);
                    break;
                }

                if (decodedTag && decodedTag === host.remark) {
                    Object.assign(config, outbound);
                    break;
                }
            }

            return this.render(config);
        } catch (error) {
            this.logger.error('Error generating outline config:', error);
            return '';
        }
    }

    private render(config: OutlineOutbound): string {
        return JSON.stringify(config, null, 0);
    }

    private makeOutbound(
        server: string,
        server_port: number,
        password: string,
        method: string,
    ): OutlineOutbound {
        return {
            method,
            password,
            server,
            server_port,
        };
    }
}
