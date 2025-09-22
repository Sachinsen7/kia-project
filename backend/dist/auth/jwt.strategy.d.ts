declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
<<<<<<< HEAD
    validate(payload: any): Promise<{
        userId: any;
        username: any;
    }>;
=======
    validate(payload: any): Promise<any>;
>>>>>>> cbef98c8a99a9f1ee3f000af5f94e4f72c7da5f9
}
export {};
