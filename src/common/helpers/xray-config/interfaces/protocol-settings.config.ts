// Shadowsocks Protocol Settings
export interface ShadowsocksSettings {
    password?: string; // Server master key (required for SS2022 multi-user)
    method?: string;
    network?: string;
    clients: ShadowsocksUser[];
}

export interface ShadowsocksUser extends UserObject {
    method: string;
    password: string;
    id: string; // !!! This field is not exist in XTLS config!
}

export interface TrojanFallback {
    alpn?: string;
    dest?: number | string;
    path?: string;
    xver?: number;
}

// Trojan Protocol Settings
export interface TrojanSettings {
    clients: TrojanUser[];
    fallbacks?: TrojanFallback[];
}

export interface TrojanUser extends UserObject {
    flow?: string;
    password: string;
    id: string; // !!! This field is not exist in XTLS config!
}

// Common interfaces
export interface UserObject {
    email?: string;
    level?: number;
}

export interface VLessFallback {
    alpn?: string;
    dest?: number | string;
    path?: string;
    xver?: number;
}

// VLess Protocol Settings
export interface VLessSettings {
    clients: VLessUser[];
    decryption: 'none' | string;
    fallbacks?: VLessFallback[];
    flow?: 'xtls-rprx-vision' | '' | 'none';
}

export interface VLessUser extends UserObject {
    encryption?: string;
    flow?: 'xtls-rprx-vision' | '';
    id: string;
}
