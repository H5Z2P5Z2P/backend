/**
 * Adapts the Shadowsocks password length based on the encryption method.
 * Specifically handles SS2022-128 requirements by truncating 32-byte keys to 16 bytes.
 *
 * @param password The original password (typically 32 bytes, base64 encoded)
 * @param method The encryption method (e.g., '2022-blake3-aes-128-gcm')
 * @returns The adapted password
 */
export function adaptSSPassword(password: string, method: string): string {
    const is128 = method && method.includes('128');

    // Only process if method indicates 128-bit encryption
    if (is128) {
        try {
            const buffer = Buffer.from(password, 'base64');
            // If the key is long enough, take the first 16 bytes
            if (buffer.length >= 16) {
                return buffer.subarray(0, 16).toString('base64');
            }
            // If it's shorter than 16 bytes, we return it as is (or handle as error if strict)
            // For compatibility with legacy non-standard keys, we return as is.
        } catch {
            // If not valid base64, return original
            return password;
        }
    }

    // For 256-bit or other methods, return the original password
    return password;
}

/**
 * Combines server password and user password for SS2022 multi-user mode.
 * SS2022 client password format: "serverPsk:userPsk"
 * For legacy SS or when serverPassword is not available, returns only userPassword.
 *
 * @param userPassword The user's password (adapted to correct length)
 * @param serverPassword The server's master password (from inbound settings)
 * @param method The encryption method
 * @returns The combined password for client configuration
 */
export function combineSSPassword(
    userPassword: string,
    serverPassword: string | undefined,
    method: string,
): string {
    const isSS2022 = method && method.startsWith('2022-');

    // Adapt user password to correct length first
    const adaptedUserPassword = adaptSSPassword(userPassword, method);

    // For SS2022 with server password, combine as "serverPsk:userPsk"
    if (isSS2022 && serverPassword) {
        const adaptedServerPassword = adaptSSPassword(serverPassword, method);
        return `${adaptedServerPassword}:${adaptedUserPassword}`;
    }

    // For legacy SS or missing server password, return only user password
    return adaptedUserPassword;
}
