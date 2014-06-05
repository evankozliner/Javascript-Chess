/**
 * Board represents the chess board
 *
 * @param {string} style
 */
function Board(style) {
  this.size = 8;
  this.style = style;
  this.dimension = 400;
}

/**
 * draw creates a new table
 *
 * @return {object} this
 */
Board.prototype.draw = function() {
  var chessBoard = document.getElementById("chessBoard");
  var cell = this.dimension / this.size;
  var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  for (var i = 0; i < this.size; i++) {
    var row = document.createElement("tr");
    var rowNumber = this.size - i;
    chessBoard.appendChild(row);
    for (var j = 0; j < this.size; j++) {
      var cell = document.createElement("td");
      var columnLetter = columns[j];
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
    };
  };
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
  var white = pieces.white;
  var black = pieces.black;
  for (piece in white) {
    placePiece(piece, white);
  }
  for (piece in black) {
    placePiece(piece, black);
  }
  return this;
};

/**
 * placePiece is a helper function for Board.prototype.placePieces
 *
 * @param {string} piece key value of piece
 * @param {object} side  black or white
 */
function placePiece(piece, side) {
  var piece = side[piece];
  var cell = document.getElementById(piece.position);
  var figure = document.createElement('span');
  figure.id = piece.id;
  figure.innerHTML = piece.figure;
  cell.appendChild(figure);
  cell.className += ' hasPiece';
}
