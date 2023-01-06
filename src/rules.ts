export interface RuleDefinition{
    timeLimit:string;
    openHours:{start:string;end:string;}
}
export declare type Ruleset = {[key:string]:RuleDefinition}
export const rules:Ruleset={
    "^/usr/share/code/code.*$":{
        timeLimit:"7200",
        openHours:{
            start:"10:00",
            end:"22:00"
        }
    },
    "^gnome-mines$":{
        timeLimit:"7200",
        openHours:{
            start:"10:00",
            end:"22:00"
        }
    },
    "^sol$":{
        timeLimit:"7200",
        openHours:{
            start:"10:00",
            end:"22:00"
        }
    }
}