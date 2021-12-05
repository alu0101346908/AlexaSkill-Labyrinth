function World(i,j) {
    let Cells = [];
    for (var n = 0; n < i; n++) {
        Cells.push([]);
        for (var m = 0; m < j; m++) {
            Cells[n].push(['0']);
        }
    }
    this.cells = Cells;
}
 
// now we export the class, so other modules can create Cat objects
module.exports = {
    World: World
}