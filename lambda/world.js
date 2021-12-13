
function World(i,j,size) {
    let Cells = [];
    for (let n = 0; n < i; n++) {
        Cells.push([]);
        for (let m = 0; m < j; m++) {
            Cells[n].push(['0']);
        }
    }
    let obstacle_proportion;
    let random_proportion;
    switch (size) {
        case 'pequeño':
            obstacle_proportion = 16;
            random_proportion = 3;
            break;
        case 'mediano':
            obstacle_proportion = 36;
            random_proportion = 5;
            break;
        case 'grande':
            obstacle_proportion = 64;
            random_proportion = 7;
            break;
        default:
            return;
    }
    let obstacles_percentage = 0.30;
    let obstacles_number = obstacle_proportion * obstacles_percentage;
    obstacles_number = Math.round(obstacles_number);
    let obstacle_counter = 0;
    while (obstacle_counter < obstacles_number){
        let row = Math.random()*random_proportion;
        row = Math.round(row);
        let col = Math.random()*random_proportion;
        col = Math.round(col);
        if ((Cells[row][col] != 'J') && (Cells[row][col] != 'X') && (Cells[row][col] != 'O')){
            Cells[row][col] = ['X'];
            obstacle_counter++;
        }
    }
    return Cells;
    
}
 
// now we export the class, so other modules can create Cat objects
module.exports = {
    World:World
}