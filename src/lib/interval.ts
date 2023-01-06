declare type NamedNumber=number & {name:string}
export function cpi(a:CompactInterval,b:CompactInterval){
    const [a0,a1]:NamedNumber[]=[new Number(Math.min(a.start,a.end)) as NamedNumber,new Number(Math.max(a.start,a.end)) as NamedNumber]
    const [b0,b1]=[new Number(Math.min(b.start,b.end)) as NamedNumber,new Number(Math.max(b.start,b.end)) as NamedNumber]
    a0.name="a.start";
    a1.name="a.end";
    b0.name="b.start";
    b1.name="b.end";
    const limits=[a0,a1,b0,b1]
    // console.log(limits.map(a => a.name))
    limits.sort((x,y)=>x-y)
    return limits.reduce<NamedNumber[]>((s,v,i)=>{
            if(s.length>0 && s[s.length-1].valueOf() === v.valueOf()){
                //s.pop()
                s[s.length-1].name+="="
                v.name="="+v.name
            }else if(i>0){
                v.name="<"+v.name
            }
            s.push(v)
            return s;
        },[])
        .map(v => v.name)
        .join("")
}
export function cpi_test(){
    const cases:[CompactInterval,CompactInterval][]=[
        [CompactInterval.of({start:1,end:3}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:1,end:6}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:1,end:7}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:1,end:9}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:1,end:12}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:6,end:7}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:6,end:9}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:6,end:12}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:9,end:12}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:10,end:12}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:1,end:1}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:6,end:6}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:7,end:7}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:9,end:9}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:12,end:12}),CompactInterval.of({start:6,end:9})],
        [CompactInterval.of({start:1,end:12}),CompactInterval.of({start:-1,end:-1})],
        [CompactInterval.of({start:1,end:12}),CompactInterval.of({start:1,end:1})],
        [CompactInterval.of({start:1,end:12}),CompactInterval.of({start:5,end:5})],
        [CompactInterval.of({start:1,end:12}),CompactInterval.of({start:12,end:12})],
        [CompactInterval.of({start:1,end:12}),CompactInterval.of({start:14,end:14})],
    ]
    const distinctResults=cases.reduce<{[key:string]:[CompactInterval,CompactInterval,string]}>(
        (distinct,testCase) => {
            const key=`case "${cpi(testCase[0],testCase[1])}":`;
            distinct[key]=[(distinct[key]||[])[0],(distinct[key]||[])[1],JSON.stringify(testCase)];
            return distinct
    },{})
    return Object.keys(distinctResults).map(
        key => `/**
        * ${distinctResults[key].join("* \n")} */
        ${key}`
    )
}
export function intersectSingles(a:CompactInterval,b:CompactInterval){
    let result:CompactInterval[];
    const compareResult=cpi(a,b)
    //console.log("union singles",Object.values(a),Object.values(b),compareResult)
    switch(compareResult){
        /**
        * [{"start":1,"end":3},{"start":6,"end":9}] */
        case "a.start<a.end<b.start<b.end":
            result = []
        break;
            /**
        * [{"start":1,"end":6},{"start":6,"end":9}] */
        case "a.start<a.end==b.start<b.end":
            result = [CompactInterval.of({start:a.end,end:b.start})]
        break;
            /**
        * [{"start":1,"end":7},{"start":6,"end":9}] */
        case "a.start<b.start<a.end<b.end":
            result = [CompactInterval.of({start:b.start,end:a.end})]
        break;
            /**
        * [{"start":1,"end":9},{"start":6,"end":9}] */
        case "a.start<b.start<a.end==b.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":6,"end":9}] */
        case "a.start<b.start<b.end<a.end":
            result = [CompactInterval.of({start:b.start,end:a.end})]
        break;
            /**
        * [{"start":6,"end":7},{"start":6,"end":9}] */
        case "a.start==b.start<a.end<b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":6,"end":9},{"start":6,"end":9}] */
        case "a.start==b.start<a.end==b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":6,"end":12},{"start":6,"end":9}] */
        case "a.start==b.start<b.end<a.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":9,"end":12},{"start":6,"end":9}] */
        case "b.start<a.start==b.end<a.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":10,"end":12},{"start":6,"end":9}] */
        case "b.start<b.end<a.start<a.end":
            result = []
        break;
            /**
        * [{"start":1,"end":1},{"start":6,"end":9}] */
        case "a.start==a.end<b.start<b.end":
            result = []
        break;
            /**
        * [{"start":6,"end":6},{"start":6,"end":9}] */
        case "a.start==a.end==b.start<b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":7,"end":7},{"start":6,"end":9}] */
        case "b.start<a.start==a.end<b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":9,"end":9},{"start":6,"end":9}] */
        case "b.start<a.start==a.end==b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":12,"end":12},{"start":6,"end":9}] */
        case "b.start<b.end<a.start==a.end":
            result = []
        break;
            /**
        * [{"start":1,"end":12},{"start":-1,"end":-1}] */
        case "b.start==b.end<a.start<a.end":
            result = []
        break;
            /**
        * [{"start":1,"end":12},{"start":1,"end":1}] */
        case "a.start==b.start==b.end<a.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":5,"end":5}] */
        case "a.start<b.start==b.end<a.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":12,"end":12}] */
        case "a.start<a.end==b.start==b.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":14,"end":14}] */
        case "a.start<a.end<b.start==b.end":
            result = []
            break;
        case "b.start<a.start<b.end<a.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
            break;
        case "b.start<a.start<a.end==b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
        case "b.start<a.start<a.end<b.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
        default:
            throw new Error(`no return value for intersection of ${JSON.stringify(a)} and ${JSON.stringify(b)} [${compareResult}]`)
    }
    return result
}
export function unionSingles(a:CompactInterval,b:CompactInterval){
    let result:CompactInterval[];
    const compareResult=cpi(a,b)
    switch(compareResult){
        /**
        * [{"start":1,"end":3},{"start":6,"end":9}] */
        case "a.start<a.end<b.start<b.end":
            result = [
                CompactInterval.of({start:a.start,end:a.end}),
                CompactInterval.of({start:b.start,end:b.end})
            ]
        break;
            /**
        * [{"start":1,"end":6},{"start":6,"end":9}] */
        case "a.start<a.end==b.start<b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":7},{"start":6,"end":9}] */
        case "a.start<b.start<a.end<b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":9},{"start":6,"end":9}] */
        case "a.start<b.start<a.end==b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":6,"end":9}] */
        case "a.start<b.start<b.end<a.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":6,"end":7},{"start":6,"end":9}] */
        case "a.start==b.start<a.end<b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":6,"end":9},{"start":6,"end":9}] */
        case "a.start==b.start<a.end==b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":6,"end":12},{"start":6,"end":9}] */
        case "a.start==b.start<b.end<a.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":9,"end":12},{"start":6,"end":9}] */
        case "b.start<a.start==b.end<a.end":
            result = [CompactInterval.of({start:b.start,end:a.end})]
        break;
            /**
        * [{"start":10,"end":12},{"start":6,"end":9}] */
        case "b.start<b.end<a.start<a.end":
            result = [CompactInterval.of({start:b.start,end:b.end}),CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":1,"end":1},{"start":6,"end":9}] */
        case "a.start==a.end<b.start<b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":6,"end":6},{"start":6,"end":9}] */
        case "a.start==a.end==b.start<b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":7,"end":7},{"start":6,"end":9}] */
        case "b.start<a.start==a.end<b.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
            /**
        * [{"start":9,"end":9},{"start":6,"end":9}] */
        case "b.start<a.start==a.end==b.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
            /**
        * [{"start":12,"end":12},{"start":6,"end":9}] */
        case "b.start<b.end<a.start==a.end":
            result = [CompactInterval.of({start:b.start,end:a.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":-1,"end":-1}] */
        case "b.start==b.end<a.start<a.end":
            result = [
                CompactInterval.of({start:b.start,end:b.end}),
                CompactInterval.of({start:a.start,end:a.end})
            ]
        break;
            /**
        * [{"start":1,"end":12},{"start":1,"end":1}] */
        case "a.start==b.start==b.end<a.end":
            result = [CompactInterval.of({start:b.start,end:a.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":5,"end":5}] */
        case "a.start<b.start==b.end<a.end":
            result = [CompactInterval.of({start:a.start,end:a.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":12,"end":12}] */
        case "a.start<a.end==b.start==b.end":
            result = [CompactInterval.of({start:a.start,end:b.end})]
        break;
            /**
        * [{"start":1,"end":12},{"start":14,"end":14}] */
        case "a.start<a.end<b.start==b.end":
            result = [
                CompactInterval.of({start:a.start,end:a.end}),
                CompactInterval.of({start:b.start,end:b.end})
            ]
            break;
        case "b.start<a.start<b.end<a.end":
            result = [
                CompactInterval.of({start:b.start,end:a.end})
            ]
            break;
        case "b.start<a.start<a.end==b.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
        case "b.start<a.start<a.end<b.end":
            result = [CompactInterval.of({start:b.start,end:b.end})]
        break;
        default:
            throw new Error(`no return value for union of ${JSON.stringify(a)} and ${JSON.stringify(b)} [${compareResult}]`)
    }
    // console.log("union singles",Object.values(a),Object.values(b),result,compareResult)
    return result
}
export declare type IntervalInitializer={start:number;end:number}|number[]

export class CompactInterval{
    static of(json:IntervalInitializer){
        const [a,b]=Object.values(json)
        return new CompactInterval(a,b)
    }
    static openLeft(s:number){
        return new CompactInterval(s,Number.POSITIVE_INFINITY)
    }
    static openRight(s:number){
        return new CompactInterval(Number.NEGATIVE_INFINITY,s)
    }
    start;
    end;
    constructor(start=Number.NEGATIVE_INFINITY,end=Number.POSITIVE_INFINITY){
        this.start=Math.min(start,end);
        this.end=Math.max(start,end);
    }
    add(other:CompactInterval){
        this.start=Math.min(other.start,this.start)
        this.end=Math.min(other.end,this.end)
    }
    slice(n:number){
        const sliceLength=(this.end-this.start)/n
        return new Array(n).fill(0).map(
            (slice,index) => new CompactInterval(this.start+sliceLength*index,this.start+sliceLength*(index+1))
        )
    }
    contains(n:number):boolean{
        return this.start<=n && n<=this.end
    }
    hash():string{
        return `${this.start},${this.end}`
    }
    equals(other:CompactInterval):boolean{
        return this.hash() === other.hash()
    }
    union(other:CompactInterval):CompactInterval[]{
        return unionSingles(this,other)
    }
    toString():string{
        return this.hash()
    }
}
export class CompositeInterval{
    static of(intervals:IntervalInitializer[]){
        return new CompositeInterval((intervals||[]).map( t => CompactInterval.of(t)))
    }
    static intersect(a:CompactInterval[],b:CompactInterval[]):CompactInterval[]{
        //console.log("intersecting",a,b)
        let result=[]
        for(let i=0;i<a.length;i++){
            for(let j=0;j<b.length;j++){
                let u = intersectSingles(CompactInterval.of(a[i]),CompactInterval.of(b[j]))
                //console.log("intersection",a[i],b[j],u)
                if(u.length){
                    result.push(...u);
                }
            }
        }
        return result
    }
    static union(a:CompactInterval[],b:CompactInterval[]):CompactInterval[]{
        let nextResult=[]
        let elements=[...a,...b]
        let result=[...elements]
        //console.log("union",a,b)
        for(let i=0;i<elements.length;i++){
            //console.log("iteration",i,elements.length,result)
            for(let j=0;j<result.length;j++){
                nextResult.push(...unionSingles(CompactInterval.of(elements[i]),CompactInterval.of(result[j])))
            }
            result=Object.values(nextResult.reduce<{[key:string]:CompactInterval}>(
                (hash,interval) => {
                    hash[interval.hash()]=interval;
                    return hash;
                },{}
            ))
            nextResult=[]
        }
        result=Object.values(result.reduce<{[key:string]:CompactInterval}>(
            (hash,interval) => {
                hash[interval.hash()]=interval;
                return hash;
            },{}
        ))
        return result
    }
    intervals:CompactInterval[]=[];
    constructor(intervals:CompactInterval[]){
        this.intervals=(intervals||[])
    }
    unionSingle(single:CompactInterval){
        let result:CompactInterval[]=[...this.intervals]
        if(this.intervals.length===0){
            result=[single]
        }else{
            const k:{[k:string]:CompactInterval} = this.intervals.flatMap(
                (interval) => {
                    return unionSingles(CompactInterval.of(interval),CompactInterval.of(single))
                }
            ).reduce<{[k:string]:CompactInterval}>(
                (hash,interval) => {
                    hash[interval.hash()]=interval;
                    return hash;
                },{}
            )
            result=Object.values(k)
        }
        this.intervals=result
        return this
    }
    union(other:CompositeInterval,y=10){
        let result=CompositeInterval.union(this.intervals,other.intervals)
        for(let i=0;i<10;i++){
            result=CompositeInterval.union(result,[])
        }
        this.intervals=[...result]
        return this;
    }
    intersectSingle(single:CompactInterval){
        let result:CompactInterval[]=[...this.intervals]
        if(this.intervals.length===0){
            result=[]
        }else{
            const k=this.intervals.flatMap(
                (interval) => {
                    return intersectSingles(CompactInterval.of(interval),CompactInterval.of(single))
                }
            )
            result=Object.values(k)
        }
        this.intervals=result
        return this
    }
    intersect(other:CompositeInterval,y=10){
        let result:CompactInterval[]=CompositeInterval.intersect(this.intervals,other.intervals)
        this.intervals=[...result]
        return this;
    }
    toJson():string{
        return JSON.stringify(this.intervals.map(i => Object.values(i)))
    }
    toString():string{
        return this.intervals.map(i => i.toString()).join(";")
    }
}
function composite_test(y=10){
    const testCases=[
        {x:[[1,4],],y:[[2,7]]},
        {x:[[1,4],],y:[[4,7]]},
        {x:[[1,4],],y:[[5,7]]},
        {x:[[1,4],[14,18]],y:[[2,7],[9,19]]},
    ]
    testCases.forEach(
        ({x,y})=>{
            let a=CompositeInterval.of(x)
            let b=CompositeInterval.of(y)
            let u=CompositeInterval.union(a.intervals,b.intervals)
            u=CompositeInterval.union(u,[])
            u=CompositeInterval.union(u,[])
            u=CompositeInterval.union(u,[])
            let i=CompositeInterval.intersect(a.intervals,b.intervals)
            console.log(
                a.toString(),
                b.toString(),
                CompositeInterval.of(u).toString(),
                CompositeInterval.of(i).toString(),
            )
        }
    )
}
