
import {parseArgs} from './lib/paresargs';
import fs from 'fs';
import {
    config,
    extractData,
    aggregate,
    ConfigData,
} from "./aggregate"
import {AppParams,convertDecodedArguments,DecodedArguments} from './lib/AppParams'

import * as ops from "./operations";


import {rules, Ruleset} from "./rules"

const args = process.argv.slice(2)
console.log({args})
console.log("".padStart)
const parsedArgs:DecodedArguments=parseArgs(args)
const cfg:ConfigData=config(convertDecodedArguments<AppParams>(parsedArgs));

switch(parsedArgs["cmd"]) {
    case "apply-rules":
        
        console.log("applying rules",rules);
        console.log("using config",cfg);
        const trace=require(cfg.traceJsonFilename)
        // console.log("on trace",trace);
        const opsList=Object.keys(trace).map(
            processName => {
                const matchedRulesKeys=Object.keys(rules).filter(ruleRegexString => processName.match(new RegExp(ruleRegexString))).filter(v => v !== null)
                const applicableRules=matchedRulesKeys.reduce<Ruleset>(
                    (app,ruleKey) => {
                        app[ruleKey]=rules[ruleKey]
                        return app
                    },{}
                )
                return {
                    matchedRulesKeys,
                    applicableRules,
                    processName,
                    trace:trace[processName],
                    operations:{
                        throttle:ops.throttle(processName,trace[processName],applicableRules),
                        notify:ops.notify(processName,trace[processName],applicableRules),
                        shutdownProcess:ops.shutdownProcess(processName,trace[processName],applicableRules),
                        logoffUser:ops.logoffUser(processName,trace[processName],applicableRules),
                    }
                }
            }
        )
        .filter(
            evaluation => evaluation.matchedRulesKeys.length > 0
        )
        fs.writeFileSync(cfg.opsJsonFilename,JSON.stringify(opsList,null," "))
        break;
    case "agg":
    default:
        aggregate(convertDecodedArguments<AppParams>(parsedArgs)).then(r => console.log({result:r}))
        break;
}