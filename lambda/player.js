function Checkpoint(name,x,y){
    var Checkpoint = { name: name , x: x , y: y};
    
    return Checkpoint;
}

function Inventory(){
    
    var Inventory = [];
    
    return Inventory;
}




module.exports = {
    Checkpoint: Checkpoint,
    Inventory: Inventory
}