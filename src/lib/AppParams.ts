
export interface AppParams{
    targetUser:string;
    operatorUser:string;
    refDate:string;
}
export declare type DecodedArguments = {[key:string]:string|boolean};
export function convertDecodedArguments<R>(decodedArguments:DecodedArguments):R{
    return decodedArguments as unknown as R;
}