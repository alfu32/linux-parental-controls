const fs=require('fs');
const {dateToString,stringToDate}=require('./lib/datefmt');

module.exports={
    config,
    extractData,
    aggregate,
}
function config(args){
    const {targetUser,operatorUser,refDate}=args;
    console.log({targetUser,operatorUser,refDate})
    const timestamp=refDate?new Date(refDate):new Date();
    const baseDataDir=`/home/${operatorUser}/.parental-controls/data/${targetUser}`
    const currentDateFolder = dateToString("Y/m/d",timestamp)
    const currentDate = dateToString("Y-m-d",timestamp)
    const currentTime = dateToString("H:M",timestamp)
    const currentTimeSeconds = dateToString("H:M:S",timestamp)
    const currentDataDir=`${baseDataDir}/${currentDateFolder}`
    const traceJsonFilename = `${currentDataDir}/psaux.trace.json`
    const aggJsonFilename = `${currentDataDir}/psaux.agg.json`
    const rawJsonFilename = `${currentDataDir}/psaux.raw.json`
    const opsJsonFilename = `${currentDataDir}/psaux.ops.json`
    if(!fs.existsSync(currentDataDir)){
        fs.mkdirSync(currentDataDir)
    }
    return {
        targetUser,
        timestamp,
        operatorUser,
        baseDataDir,
        currentDateFolder,
        currentDate,
        currentTime,
        currentDataDir,
        traceJsonFilename,
        aggJsonFilename,
        rawJsonFilename,
        opsJsonFilename,
    }

}
async function extractData({
        targetUser,
        timestamp,
        operatorUser,
        currentDateFolder,
        currentDate,
        currentTime,
        currentDataDir,
    }){
    // const [a,targetUser,b,operatorUser] = args
    const contents = fs.readdirSync(currentDataDir).filter(
        filename => /*filename.startsWith(currentTime) && */filename.match(/^\d\d:\d\d:\d\d\.psaux\.txt$/gi)
    ).flatMap(
        filename => {
            const text= fs.readFileSync(`${currentDataDir}/${filename}`).toString("utf8")
            const time = filename.match(/^\d\d:\d\d:\d\d/gi)
            if(text && text.split) {
                return text.split("\n")
                .map(
                    line => {
                        if(line && line !=""){
                            const data=line.substring(0,66).split(/\s+/)
                            /* USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND */
                            return {
                                user    : data[0],
                                date    : `${currentDate} ${time}`,
                                pid     : data[1],
                                cpu     : data[2],
                                mem     : data[3],
                                vsz     : data[4], 
                                rss     : data[5],
                                tty     : data[6],
                                stat    : data[7],
                                start   : data[8],
                                time    : data[9],
                                command : line.substring(67),
                            }
                        } else {
                            return null
                        }
                    }
                )
            }else{
                return []
            }
        }
    )
    return {targetUser,operatorUser,currentDate,currentTime,currentDateFolder,currentDataDir,timestamp,contents}
}
async function aggregate(parsedArgs){
    const cfg = config(parsedArgs);
    const {
        traceJsonFilename,
        aggJsonFilename,
        rawJsonFilename,
    } = cfg;
    extractData(cfg)
    .then(result => {
        console.log({result})
        console.log(result.contents)
        fs.writeFileSync(rawJsonFilename,JSON.stringify(result.contents,null," "))
        const aggregated = result.contents.reduce( (agg,ps,ord) => {
            if(ps === null){
                return agg;
            }
            agg[ps.command]=agg[ps.command]||[]
            agg[ps.command].push({...ps,command:undefined})
            return agg;
        },{})
        fs.writeFileSync(aggJsonFilename,JSON.stringify(aggregated,null," "))
        const traceGraph=Object.keys(aggregated)
            .reduce( (graph,command) => {
                const currentGraph=aggregated[command];
                const startTime=new Date(currentGraph[0].date)
                const endTime=new Date(currentGraph[currentGraph.length-1].date)
                const totalOn=currentGraph.length*60
                graph[command]={
                    pid:currentGraph[0].pid,
                    startTime,
                    endTime,
                    timestamp:dateToString("Y-m-d H:M:S",result.timestamp),
                    totalOn,
                    "powerUsage[k%.s]":currentGraph.map(p => (parseFloat(p.cpu)*100+0.05)*60)
                    .reduce( (s,v) => s+v*60)/1000
                }
                return graph
            },{})
        fs.writeFileSync(traceJsonFilename,JSON.stringify(traceGraph,null," "))
    })
    .catch(err => console.warn({err}))
}