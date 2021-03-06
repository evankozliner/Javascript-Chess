/**
 * Board represents the chess board
 *
 * @param {string} style
 */
(function() {
  this.Board = function(team) {
    this.size = 8;
    this.team = team;
    this.dimension = 400;
  }

  /**
   * draw creates a new table
   *
   * @return {object} this
   */
  Board.prototype.draw = function() {
    var chessBoard = document.getElementById("chessBoard"),
        fragment = document.createDocumentFragment();
        cell = this.dimension / this.size,
        columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
        isTeamWhite = this.team === 'white';

    for (var i = 0; i < this.size; i++) {
      var row = document.createElement("tr"),
          rowNumber = isTeamWhite ? this.size - i : i + 1;
      fragment.appendChild(row);
      for (var j = 0; j < this.size; j++) {
        var cell = document.createElement("td"),
            columnLetter = isTeamWhite ? columns[j] : columns[this.size - j - 1];
        cell.className = "cell";
        if (i % 2 == 0) {
          if (j % 2 == 0) {
              cell.className += " light";
          } else {
              cell.className += " dark";
          }
        } else {
          if (j % 2 == 0) {
              cell.className += " dark";
          } else {
              cell.className += " light";
          }
        }
        cell.id = columnLetter+rowNumber;
        row.appendChild(cell);
      }
    }
    chessBoard.appendChild(fragment);
    return this;
  };

  /**
   * placePieces sets the pieces on the board in preparation for
   * the start of the game
   *
   * @param {object} pieces javascript object of all the pieces
   * @return {object} this
   */
  Board.prototype.placePieces = function(pieces) {
    var white = pieces.white,
        black = pieces.black;
    for (piece in white) {
      placePiece(piece, white);
    }
    for (piece in black) {
      placePiece(piece, black);
    }
    // test pieces
    //
    // var cell = document.getElementById('d3');
    // cell.className += ' hasPiece';
    // var testFigure = document.createElement('span');
    // testFigure.innerHTML = 'l';
    // testFigure.id = 'black-king';
    // cell.appendChild(testFigure);
    //
    // end test pieces
    return this;
  };

  /**
   * placePiece is a helper function for Board.prototype.placePieces
   *
   * @param {string} piece key value of piece
   * @param {object} side contains pieces of black or white team
   */
  function placePiece(piece, side) {
    var piece = side[piece],
        cell = document.getElementById(piece.position),
        figure = document.createElement('span');
    var team = piece.id.split('-')[0];
    figure.id = piece.id;
    figure.className = 'figure';
    figure.innerHTML = piece.figure;
    if (team === window.aGameOfChess.whoseTurn) {
      figure.setAttribute('draggable', 'true');
    }
    cell.appendChild(figure);
    cell.className += ' hasPiece';
  }
})();
