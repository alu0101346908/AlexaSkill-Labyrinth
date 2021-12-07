function World(i,j,size) {
    let Cells = [];
    for (let n = 0; n < i; n++) {
        Cells.push([]);
        for (let m = 0; m < j; m++) {
            Cells[n].push(['0']);
        }
    }
    this.cells = Cells;
/*    if (size === 'pequeño'){
        let obstacles_percentage = 0.30;
        let obstacles_number =
    }
    Math.random(0,16)
    void Board::create_random_obstacle(float& obstacles_percentage) {
        int row, col;
        int obstacle_counter = 0;
        srand(time(NULL));
        int obstacles = (get_rows() * get_cols()) * (obstacles_percentage / 100);
        int area = (get_rows() * get_cols());
        // If number of obstacles are greater than the area of the board, 
        // sets the maximum posible obstacles
        obstacles >= area - 2 ? obstacles = area - 2 : obstacles;
        while (obstacle_counter < obstacles) {
          row = rand() % get_rows();
          col = rand() % get_cols();
          if (create_obstacle(row, col))
            obstacle_counter++;
        }
    }
    */
}
 
// now we export the class, so other modules can create Cat objects
module.exports = {
    World: World
}