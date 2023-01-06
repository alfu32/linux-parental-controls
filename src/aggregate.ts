import fs from 'fs';
const {dateToString,stringToDate}=require('./lib/datefmt');
import {AppParams} from './lib/AppParams'
export interface ConfigData{
    targetUser:string;
    timestamp:Date;
    operatorUser:string;
    baseDataDir:string;
    currentDateFolder:string;
    currentDate:string;
    currentTime:string;
    currentDataDir:string;
    traceJsonFilename:string;
    aggJsonFilename:string;
    rawJsonFilename:string;
    opsJsonFilename:string;
}
export interface PsData{
    user:string;
    date:string;
    pid:string;
    cpu:string;
    mem:string;
    vsz:string;
    rss:string;
    tty:string;
    stat:string;
    start:string;
    time:string;
    command:string;
}
export function config(args: AppParams):ConfigData{
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
export declare type ConfigAndPsData = {contents:PsData[]} & ConfigData
export async function extractData(configData: ConfigData):Promise<ConfigAndPsData> {
    const {
        targetUser,
        timestamp,
        operatorUser,
        currentDateFolder,
        currentDate,
        currentTime,
        currentDataDir,
    } = configData;
    // const [a,targetUser,b,operatorUser] = args
    const contents:PsData[] = fs
        .readdirSync(currentDataDir)
        .filter(
            (filename: string) => /*filename.startsWith(currentTime) && */filename.match(/^\d\d:\d\d:\d\d\.psaux\.txt$/gi)
        )
        .flatMap(
            (filename: string):PsData[] => {
                const text= fs.readFileSync(`${currentDataDir}/${filename}`).toString("utf8")
                const time = filename.match(/^\d\d:\d\d:\d\d/gi)
                if(text && text.split) {
                    return text.split("\n")
                    .flatMap(
                        (line: string):(PsData[]) => {
                            if(line && line !=""){
                                const data=line.substring(0,66).split(/\s+/)
                                /* USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND */
                                return [{
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
                                }]
                            } else {
                                return []
                            }
                        }
                    )
                }else{
                    return []
                }
            }
        )
    return {...configData,contents}
}
export interface TraceData{
    pid:string,
    startTime:Date,
    endTime:Date,
    timestamp:string,
    totalOn:number,
    powerUsage:number,
}
export async function aggregate(parsedArgs:AppParams):Promise<{aggregated: { [key: string]: PsData[]; },traceGraph:{[key:string]:TraceData} }>{
    const cfg:ConfigData = config(parsedArgs);
    const {
        traceJsonFilename,
        aggJsonFilename,
        rawJsonFilename,
    } = cfg;
    const result = await extractData(cfg)
    console.log({result})
    console.log(result.contents)
    fs.writeFileSync(rawJsonFilename,JSON.stringify(result.contents,null," "))
    const aggregated: { [key: string]: PsData[]; } = result.contents.reduce( (agg: { [key: string]: PsData[]; },ps: PsData,ord: any) => {
        if(ps === null){
            return agg;
        }
        agg[ps.command]=agg[ps.command]||[]
        const abriged:PsData={...ps}
        agg[ps.command].push(abriged)
        return agg;
    },{})
    fs.writeFileSync(aggJsonFilename,JSON.stringify(aggregated,null," "))
    const traceGraph:{[key:string]:TraceData}=Object.keys(aggregated)
        .reduce<{[key:string]:TraceData}>( (graph,command) => {
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
                powerUsage:currentGraph.map(p => (parseFloat(p.cpu)*100+0.05)*60)
                .reduce( (s,v) => s+v*60)/1000
            }
            return graph
        },{})
    fs.writeFileSync(traceJsonFilename,JSON.stringify(traceGraph,null," "))
    return {aggregated,traceGraph}
}