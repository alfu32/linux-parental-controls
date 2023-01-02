module.exports=dateToString


function dateToString(formatString,date){
    const cd = date || new Date();
    const fmt = formatString || "Y-m-d H:M:S";

    return fmt
        .replace("Y",cd.getFullYear())
        .replace("m",(cd.getMonth()+1).toString(10).padStart(2,"0") )
        .replace("d",cd.getDate().toString(10).padStart(2,"0") )
        .replace("H",cd.getHours().toString(10).padStart(2,"0") )
        .replace("M",cd.getMinutes().toString(10).padStart(2,"0") )
        .replace("S",cd.getSeconds().toString(10).padStart(2,"0") )
        .replace("FFFFFFFFF",cd.getMilliseconds().toString(10).padStart(9,"0") )
        .replace("FFFFFF",cd.getMilliseconds().toString(10).padStart(6,"0") )
        .replace("FFF",cd.getMilliseconds().toString(10).padStart(3,"0") )
}