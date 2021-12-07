
function World(i,j,size) {
    let Cells = [];
    for (let n = 0; n < i; n++) {
        Cells.push([]);
        for (let m = 0; m < j; m++) {
            Cells[n].push(['0']);
        }
    }
        let obstacles_percentage = 0.30;
        let obstacles_number = 16 * obstacles_percentage;
        obstacles_number = Math.round(obstacles_number);
        let obstacle_counter = 0;
    while (obstacle_counter < obstacles_number){
        let row = Math.random()*3;
        row = Math.round(row);
        let col = Math.random()*3;
        col = Math.round(col);
        if ((Cells[row][col] !== 'J') && (Cells[row][col] !== 'X') && (Cells[row][col] !== 'O')){
            Cells[row][col] = ['X'];
            obstacle_counter++;
        }
    }
    return Cells;
    
}
 
// now we export the class, so other modules can create Cat objects
module.exports = {
    World
}