const fs=require('fs');
const parseArgs=require('./lib/paresargs');
const dateToString=require('./lib/datefmt');

const args = process.argv.slice(2)
console.log({args})
console.log("".padStart)
const parsedArgs=parseArgs(args)

async function main(args){
    // const [a,targetUser,b,operatorUser] = args
    const {targetUser,operatorUser}=args
    const t=new Date()
    const baseDataDir=`/home/${operatorUser}/.parental-controls/data/${targetUser}`
    const currentDateFolder = dateToString("Y/m/d",t)
    const currentTime = dateToString("H:M",t)
    const currentDataDir=`${baseDataDir}/${currentDateFolder}`
    const contents = fs.readdirSync(currentDataDir).filter(
        filename => filename.match(/^\d\d:\d\d:\d\d\.psaux\.txt$/gi)
    ).flatMap(
        filename => {
            const text= fs.readFileSync(`${currentDataDir}/${filename}`).toString("utf8")
            
            if(text && text.split) return text.split("\n")
                .map(
                    line => {
                        const data=line.substring(0,67).split(/\s+/)
                        return {
                            user    : data[0],
                            pid     : data[1],
                            num1    : data[2],
                            num2    : data[3],
                            num3    : data[4], 
                            num4    : data[5],
                            ttyName : data[6],
                            opts    : data[7],
                            time    : data[8],
                            screen  : data[9],
                            cmd     : line.substring(68),
                        }
                    }
                )
            else return []
        }
    )
    return {targetUser,operatorUser,currentTime,currentDateFolder,currentDataDir,contents}
}

main(parsedArgs)
.then(result => {
    console.log({result})
    console.log(result.contents)
})
.catch(err => console.warn({err}))
