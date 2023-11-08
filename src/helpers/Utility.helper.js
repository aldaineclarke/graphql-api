export const getKeyByValue = (map, value)=>{
    for(let [key, val] of map.entries()){
        if(value === val ){
            return key;
        }
    }
    return undefined;
}