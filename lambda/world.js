
function World(i,j,size) {
    let Cells = [];
    for (let n = 0; n < i; n++) {
        Cells.push([]);
        for (let m = 0; m < j; m++) {
            Cells[n].push(['0']);
        }
    }
        let obstacles_percentage = 0.30;
        let obstacles_number = size * obstacles_percentage;
        obstacles_number = toString(obstacles_number);
        obstacles_number = parseInt(obstacles_number);
        let obstacle_counter = 0;
    while (obstacle_counter < obstacles_number){
        let row = Math.random(0,3);
        let col = Math.random(0,3);
        if ((Cells[row][col] != 'J') && (Cells[row][col] != 'X') && (Cells[row][col] != 'O')){
            Cells[row][col] = 'X';
            obstacle_counter++;
        }
    }
    this.cells = Cells;
    
}
 
// now we export the class, so other modules can create Cat objects
module.exports = {
    World: World
}