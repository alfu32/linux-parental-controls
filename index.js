
const parseArgs=require('./lib/paresargs');
const fs=require('fs');
const {
    config,
    extractData,
    aggregate,
}=require("./aggregate")

const ops=require("./operations")


const {rules}=require("./config.json")
const args = process.argv.slice(2)
console.log({args})
console.log("".padStart)
const parsedArgs=parseArgs(args)
const cfg=config(parsedArgs);

switch(parsedArgs["cmd"]) {
    case "apply-rules":
        
        console.log("applying rules",rules);
        console.log("using config",cfg);
        const trace=require(cfg.traceJsonFilename)
        // console.log("on trace",trace);
        const opsList=Object.keys(trace).map(
            processName => {
                return {
                    processName,
                    trace:trace[processName],
                    operations:{
                        throttle:ops.throttle(processName,trace[processName],rules),
                        notify:ops.notify(processName,trace[processName],rules),
                        shutdownProcess:ops.shutdownProcess(processName,trace[processName],rules),
                        logoffUser:ops.logoffUser(processName,trace[processName],rules),
                    }
                }
            }
        )
        fs.writeFileSync(cfg.opsJsonFilename,JSON.stringify(opsList,null," "))
        break;
    case "agg":
    default:
        aggregate(parsedArgs).then(r => console.log({result:r}))
        break;
}