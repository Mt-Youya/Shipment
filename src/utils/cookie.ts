export default{
    get:(key: string)=>{
        return sessionStorage.getItem(key)
    },
    set:(key: string,value: string)=>{
         sessionStorage.setItem(key,value)
    },
    remove:(key: string)=>{
        return sessionStorage.removeItem(key)
    },
    clear:()=>{
        return sessionStorage.clear()
    },
}       