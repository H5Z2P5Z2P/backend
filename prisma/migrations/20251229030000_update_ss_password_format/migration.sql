-- Migration: Update SS Password Format
-- Purpose: Convert old SS passwords (nanoid 32 chars) to new SS2022 format (Base64 32 bytes)
-- Note: Old passwords are alphanumeric (32 chars), new passwords are Base64 encoded 32 bytes (~44 chars with padding)

-- Update all users with SS passwords that are NOT in Base64 32-byte format
-- Detection logic: Base64 32-byte keys are typically 44 characters and end with '=' padding
-- Old nanoid passwords are exactly 32 characters and don't contain '=' or '/'

UPDATE users
SET ss_password = encode(gen_random_bytes(32), 'base64')
WHERE 
    -- Old format: exactly 32 chars (nanoid) or doesn't look like valid Base64 32 bytes
    LENGTH(ss_password) != 44 
    OR ss_password NOT LIKE '%=%'
    OR (
        -- Additional check: if it's 32 chars and all alphanumeric (typical nanoid)
        LENGTH(ss_password) = 32 
        AND ss_password ~ '^[A-Za-z0-9_-]+$'
    );
