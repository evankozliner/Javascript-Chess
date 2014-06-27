/**
 * Piece represents a piece on the board
 *
 * @param {array} properties
 */
(function() {
    this.Piece = function(properties) {
        this.team = properties[0];
        this.type = properties[1];
        this.number = properties[2];
        this.column = properties[3].charAt(0);
        this.row = properties[3].charAt(1);
        this.moves = [properties[3]];
        this.hasMoved = false;
    }

    /**
     * potentialMoves returns an array of cell IDs. Each cell ID represents a cell
     * that this piece can move to
     *
     * @return {array}
     */
    Piece.prototype.potentialMoves = function() {
        var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            potentialMoves = [];

        switch (this.type) {
            case 'king':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([1, 1, 1, 1, 1, 1, 1, 1], this, columns));
                break;
            case 'queen':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([8, 8, 8, 8, 8, 8, 8, 8], this, columns));
                break;
            case 'bishop':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([0, 0, 0, 0, 9, 9, 9, 9], this, columns));
                break;
            case 'knight':
                console.log(this);
                break;
            case 'rook':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([8, 8, 8, 8, 0, 0, 0, 0], this, columns));
                break;
            case 'pawn':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([1, 0, 0, 0, 0, 0, 0, 0], this, columns));
                // if (Number(this.row) === 2 || Number(this.row) === 7) {
                //     var upCell = document.getElementById(this.column + (Number(this.row) + 1));
                //     if (upCell.childNodes.length === 0) {
                //         potentialMoves.push(this.positionX + upTwo);
                //     }
                // }
                // console.log(potentialMoves);
                break
        }
        // console.log(potentialMoves);
        //["column + row", "column + row"]
        return potentialMoves;
    };

    function getMoves(range, piece, columns) {
        var moves = [],
            currentColumn = columns.indexOf(piece.column),
            multiplier = 1,
            countNorth = 0,
            countSouth = 0,
            countWest = 0,
            countEast = 0,
            countNE = 0,
            countSE = 0,
            countNW = 0,
            countSW = 0;

        if (piece.team === 'black') {
            multiplier = -1;
        }

        //north
        while (countNorth < range[0]) {
            var newRow = Number(piece.row) + 1 * multiplier + countNorth * multiplier;
            if (newRow < 9 && newRow > 0) moves.push(piece.column + newRow);
            countNorth++;
        }

        //south
        while (countSouth < range[1]) {
            var newRow = (Number(piece.row) - 1 * multiplier - countSouth * multiplier);
            if (newRow > 0 && newRow < 9) moves.push(piece.column + newRow);
            countSouth++;
        }
        //east
        while (countEast < range[2]) {
            var newColumn = columns[currentColumn + countEast + 1];
            if (columns.indexOf(newColumn) > 0) moves.push(newColumn + piece.row);
            countEast++;
        }
        //west
        while (countWest < range[3]) {
            var newColumn = columns[currentColumn - countWest - 1];
            if (columns.indexOf(newColumn) > 0) moves.push(newColumn + piece.row);
            countWest++;
        }

        var newRow = Number(piece.row) + 1 * multiplier + countNorth * multiplier;
        var newColumn = columns[currentColumn + countNE + 1];

        //north east
        while (countNE < range[5]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                // console.log(columns[newColumn] + newRow);
                moves.push(columns[newColumn] + newRow);
            }
            var newRow = Number(piece.row) + 1 * multiplier + countNE * multiplier;
            var newColumn = currentColumn + countNE * multiplier + 1 * multiplier;
            countNE++;
        }

        //south east
        while (countSE < range[5]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                // console.log(columns[newColumn] + newRow);
                moves.push(columns[newColumn] + newRow);
            }
            var newRow = (Number(piece.row) - 1 * multiplier - countSE * multiplier);
            var newColumn = currentColumn + countSE * multiplier + 1 * multiplier;
            countSE++;
        }

        //north west
        while (countNW < range[6]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                // console.log(columns[newColumn] + newRow);
                moves.push(columns[newColumn] + newRow);
            }
            var newRow = Number(piece.row) + 1 * multiplier + countNW * multiplier;
            var newColumn = currentColumn - countNW * multiplier - 1 * multiplier;
            countNW++;
        }

        //south west
        while (countSW < range[7]) {
            console.log(countSW)
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                console.log(columns[newColumn] + newRow);
                moves.push(columns[newColumn] + newRow);
            }
            var newRow = (Number(piece.row) - 1 * multiplier - countSW * multiplier);
            var newColumn = currentColumn - countSW * multiplier - 1 * multiplier;
            countSW++;
        }

        moves = moves.filter(function(move) {
            var moveEle = document.getElementById(move);
            if (moveEle !== null) {
                var childNodes = moveEle.childNodes;
                if (childNodes.length > 0) {
                    var team = childNodes[0].id.split('-')[0];
                    if (team !== piece.team) {
                        return move;
                    }
                } else {
                    return move;
                }
            }
        });
        return moves;
    }

})();
