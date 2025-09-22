export declare class HashService {
    hashPassword(password: string): Promise<string>;
    verifyPassword(hash: string, password: string): Promise<boolean>;
}
