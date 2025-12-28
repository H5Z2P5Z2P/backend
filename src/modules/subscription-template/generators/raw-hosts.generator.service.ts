import { Injectable, Logger } from '@nestjs/common';

import { IFormattedHost } from './interfaces/formatted-hosts.interface';
import { IRawHost } from './interfaces';
import { adaptSSPassword, combineSSPassword } from '@common/helpers/xray-config';

@Injectable()
export class RawHostsGeneratorService {
    private readonly logger = new Logger(RawHostsGeneratorService.name);

    constructor() { }

    public async generateConfig(hosts: IFormattedHost[]): Promise<IRawHost[]> {
        const rawHosts: IRawHost[] = [];
        try {
            for (const host of hosts) {
                if (!host) {
                    continue;
                }

                const rawHost: IRawHost = {
                    ...host,
                };

                if (host.protocol === 'shadowsocks') {
                    const method = host.encryption || '2022-blake3-aes-256-gcm';
                    rawHost.password.ssPassword = combineSSPassword(
                        host.password.ssPassword,
                        host.ssServerPassword,
                        method,
                    );
                    rawHost.protocolOptions = {
                        ss: {
                            method: method,
                        },
                    };
                }

                rawHosts.push(rawHost);
            }
        } catch (error) {
            this.logger.error('Error generating raw-hosts config:', error);
            return [];
        }

        return rawHosts;
    }
}
