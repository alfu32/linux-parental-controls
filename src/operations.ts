

export function throttle(processName:string,trace:object,applicableRules:object){
    console.log("throttle",processName,trace,applicableRules)
    return false;
}
export function notify(processName:string,trace:object,applicableRules:object){
    return false;
}
export function shutdownProcess(processName:string,trace:object,applicableRules:object){
    return false;
}
export function logoffUser(processName:string,trace:object,applicableRules:object){
    return false;
}