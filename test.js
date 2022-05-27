var arr = [{id:1},{id:2},{id:2}]
var newArr = []
for(var i =0; i<arr.length; i++){
    for(var j = i+1;j<arr.length;j++){
        if(arr[i].id !== arr[j].id){
        newArr.push(arr[j])
            j--
    }
}
}
console.log(newArr)