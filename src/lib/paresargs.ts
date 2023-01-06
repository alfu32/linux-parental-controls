
import {AppParams,DecodedArguments} from './AppParams'
export function parseArgs(processArgv:string[]):DecodedArguments{
    // const groupedSingleLetterOptions=/^(-)(\w+)/gi
    const singleLetterOption:RegExp=/^(-)(\w)(.*?)/gi
    const option:RegExp=/^(--)([a-z-]{2,})("*.+?"*)/gi
    const result:DecodedArguments={}
    let lastOption=""
    processArgv.forEach(item => {
        const matches = {
            text : item,
            // list : item.match(groupedSingleLetterOptions),
            flag : item.match(singleLetterOption),
            long : item.match(option),
        }
        console.log(matches)
        if(matches.flag) {
            lastOption=matches.flag[0].substr(1)
            result[lastOption]=(matches.flag[0].length>2)?matches.flag[0].substr(2):true
            lastOption=""
        } if(matches.long){
            lastOption=matches.long[0].substr(2).split("-").map((p,i) => {
                return (i==0?p[0]:p[0].toUpperCase())+p.substr(1).toLowerCase()
            }).join("")
        } else {
            result[lastOption]=item
            lastOption=""
        }
    });
    return result
}

export function testParseArgs(args:string[]){
    return parseArgs(args.concat([
        "-d",
        "-t1234",
        "-palfu64",
        "-xvfg",
        "--some-flag",
        "--some-value",
        "--user",
        "alfu32",
        "--host",
        "localhost",
    ]))
}