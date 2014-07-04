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
                potentialMoves = potentialMoves.concat(potentialMoves, getKnightMoves([0, 0, 0, 0, 9, 9, 9, 9], this, columns));
                break;
            case 'rook':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([8, 8, 8, 8, 0, 0, 0, 0], this, columns));
                break;
            case 'pawn':
                potentialMoves = potentialMoves.concat(potentialMoves, getMoves([1, 0, 0, 0, 0, 0, 0, 0], this, columns));
                break
        }
        return potentialMoves;
    };

    function getKnightMoves(range, piece, columns) {
        var moves = [],
            newRow, newColumn, reciprocal, multiplier = 1,
            team = piece.team;
        if (team === 'black') multiplier = -1;

        newColumn = columns[columns.indexOf(piece.column) + 2 * multiplier];
        newRow = Number(piece.row) + 1 * multiplier;
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newColumn = columns[columns.indexOf(piece.column) - 2 * multiplier];
        newRow = Number(piece.row) - 1 * multiplier;
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newRow += 2 * multiplier;
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newRow -= 2 * multiplier;
        newColumn = columns[columns.indexOf(newColumn) + 4];
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newRow = Number(piece.row) + 2 * multiplier;
        newColumn = columns[columns.indexOf(piece.column) - 1 * multiplier];
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newColumn = columns[columns.indexOf(piece.column) + 1 * multiplier];
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newRow -= 4 * multiplier;
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        newColumn = columns[columns.indexOf(piece.column) - 1 * multiplier];
        if (knightCheck(newColumn, newRow, team, columns)) moves.push(newColumn + newRow);

        moves = collisionFilter(moves, piece);
        return moves;
    }

    function knightCheck(column, row, team, columns) {
        if (row <= 8 && row > 0 && columns.indexOf(column) != -1) return true;
        else return false;
    }

    function getMoves(range, piece, columns) {
        var moves = [],
            movesNorth = [],
            movesSouth = [],
            movesEast = [],
            movesWest = [],
            movesNE = [],
            movesSE = [],
            movesNW = [],
            movesSW = [],
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
            if (newRow < 9 && newRow > 0) movesNorth.push(piece.column + newRow);
            countNorth++;
        }

        //south
        while (countSouth < range[1]) {
            var newRow = (Number(piece.row) - 1 * multiplier - countSouth * multiplier);
            if (newRow > 0 && newRow < 9) movesSouth.push(piece.column + newRow);
            countSouth++;
        }
        //east
        while (countEast < range[2]) {
            var newColumn = columns[currentColumn + countEast + 1];
            if (columns.indexOf(newColumn) > 0) movesEast.push(newColumn + piece.row);
            countEast++;
        }
        //west
        while (countWest < range[3]) {
            var newColumn = columns[currentColumn - countWest - 1];
            if (columns.indexOf(newColumn) > 0) movesWest.push(newColumn + piece.row);
            countWest++;
        }

        // var newRow = Number(piece.row) + 1 * multiplier + countNorth * multiplier;
        // var newColumn = columns[currentColumn + countNE + 1];

        //north east
        while (countNE < range[5]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                movesNE.push(columns[newColumn] + newRow);
            }
            var newRow = Number(piece.row) + 1 * multiplier + countNE * multiplier;
            var newColumn = currentColumn + countNE * multiplier + 1 * multiplier;
            countNE++;
        }

        //south east
        while (countSE < range[5]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                movesSE.push(columns[newColumn] + newRow);
            }
            var newRow = (Number(piece.row) - 1 * multiplier - countSE * multiplier);
            var newColumn = currentColumn + countSE * multiplier + 1 * multiplier;
            countSE++;
        }

        //north west
        while (countNW < range[6]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                movesNW.push(columns[newColumn] + newRow);
            }
            var newRow = Number(piece.row) + 1 * multiplier + countNW * multiplier;
            var newColumn = currentColumn - countNW * multiplier - 1 * multiplier;
            countNW++;
        }

        //south west
        while (countSW < range[7]) {
            if (newRow < 9 && newRow >= 0 && newColumn >= 0 && newColumn < 9 && newRow !== undefined && newColumn !== undefined) {
                movesSW.push(columns[newColumn] + newRow);
            }
            var newRow = (Number(piece.row) - 1 * multiplier - countSW * multiplier);
            var newColumn = currentColumn - countSW * multiplier - 1 * multiplier;
            countSW++;
        }

        movesNorth = collisionFilter(movesNorth, piece);
        movesSouth = collisionFilter(movesSouth, piece);
        movesEast = collisionFilter(movesEast, piece);
        movesWest = collisionFilter(movesWest, piece);
        movesNE = collisionFilter(movesNE, piece);
        movesNW = collisionFilter(movesNW, piece);
        movesSE = collisionFilter(movesSE, piece);
        movesSW = collisionFilter(movesSW, piece);

        moves = moves.concat(movesNorth).concat(movesSouth).concat(movesEast).concat(movesWest).concat(movesNE).concat(movesNW).concat(movesSE).concat(movesSW);
        //pawn first move logic
        if (!piece.hasMoved && piece.type === 'pawn') {
            var newCell = piece.column + (Number(piece.row) + 2 * multiplier);
            console.log(newCell);
            moves.push(newCell);
            piece.hasMoved = true;
            console.log(piece.hasMoved);
        }
        return moves;
    }

    function collisionFilter(moves, piece) {
        var collisionIndex = moves.length;
        var take = null;
        moves = moves.filter(function(move) {
            var moveEle = document.getElementById(move);
            if (moveEle !== null) {
                var childNodes = moveEle.childNodes;
                if (childNodes.length > 0) {
                    console.log("children!");
                    var team = childNodes[0].id.split('-')[0];
                    var oppositeTeam = team !== piece.team;
                    if (piece.type != 'knight') {
                        if (collisionIndex >= moves.length) {
                            collisionIndex = moves.indexOf(move);
                        }
                        if (oppositeTeam) {
                            if (take == null) take = move;
                            return move;
                        }
                    } else {
                        if (oppositeTeam) return move;
                    }
                } else {
                    return move;
                }
            }
        });
        if (take != null) {
            moves = moves.concat(take);
            collisionIndex += 1;
        }
        moves = moves.slice(0, collisionIndex);
        return moves;
    }

})();