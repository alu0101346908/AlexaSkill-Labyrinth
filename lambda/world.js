
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
    Cells[0][0] = ['J'];
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

function ManageDirection (AnswerValue, CurrentWorld, player_position_package){
    let SpeakOutput;
    let outofbounds_x = false;
    let outofbounds_y = false;
    let outofbounds_y_0 = false;
    let outofbounds_x_0 = false;
    if (player_position_package.player_pointer_y + 1 > CurrentWorld[0].length()){
        outofbounds_y = true;
    }
    if (player_position_package.player_pointer_x - 1 < 0){
        outofbounds_x_0 = true;
    }
    if (player_position_package.player_pointer_x + 1 > CurrentWorld.length()){
        outofbounds_x = true;
    }
    if (player_position_package.player_pointer_y - 1 < 0){
        outofbounds_y_0 = true;
    }
    switch (AnswerValue){
        case 'derecha':
            /*if (player_position_package.player_orientation == 'S' && outofbounds_y_0 == false && CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y - 1] != 'X'){
                CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y - 1].push('J');
                player_position_package.player_pointer_y += -1;
                player_position_package.player_orientation = 'O';
            }
            if (player_position_package.player_orientation == 'N' && outofbounds_y == false && CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y + 1] != 'X'){
                CurrentWorld[player_position_package.player_pointer_x][player_position_package.player_pointer_y + 1].push('J');
                player_position_package.player_pointer_y += 1;
                player_position_package.player_orientation = 'E';
            }*/
            if (player_position_package.player_orientation == 'E' && outofbounds_x == false && CurrentWorld[player_position_package.player_pointer_x + 1][player_position_package.player_pointer_y] != 'X'){
                CurrentWorld[player_position_package.player_pointer_x + 1][player_position_package.player_pointer_y].push('J');
                player_position_package.player_pointer_x += 1;
                player_position_package.player_orientation = 'S';
                SpeakOutput = "aaaa";
            }
            /*if (player_position_package.player_orientation == 'O' && outofbounds_x_0 == false && CurrentWorld[player_position_package.player_pointer_x - 1][player_position_package.player_pointer_y] != 'X'){
                CurrentWorld[player_position_package.player_pointer_x - 1][player_position_package.player_pointer_y].push('J');
                player_position_package.player_pointer_x += -1;
                player_position_package.player_orientation = 'N';
            }*/
            SpeakOutput = SpeakOutput + "eeeee";
            break;
        case 'izquierda':
        
        case 'adelante':
        case 'delante':
        case 'alante':
            
        case 'atras':
    } 
    return [CurrentWorld, player_position_package, SpeakOutput];
}
 
module.exports = {
    World: World,
    ManageDirection: ManageDirection
}