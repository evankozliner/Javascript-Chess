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
    this.positionX = properties[3].charAt(0);
    this.positionY = properties[3].charAt(1);
    this.moves = [properties[3]];
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
        console.log(this);
        break;
      case 'queen':
        console.log(this);
        break;
      case 'bishop':
        console.log(this);
        break;
      case 'knight':
        console.log(this);
        break;
      case 'rook':
        console.log(this);
        break;
      case 'pawn':
        potentialMoves.push(this.positionX + String(Number(this.positionY) + 1));
        // check to see if piece has yet to be moved of starting square
        if (this.moves.length === 1) {
          potentialMoves.push(this.positionX + String(Number(this.positionY) + 2));
        }
        // check diagonals for enemy pieces
        var i = columns.indexOf(this.positionX);
        // if piece is at position 'a' then there is no left diagonal
        if (!(i === 0)) {
          var leftDiagonal = columns[i - 1] + String(Number(this.positionY) + 1);
          var leftCell = document.getElementById(leftDiagonal);
          if (pawnValidDiagonal(leftCell, this.team)) {
            potentialMoves.push(leftDiagonal);
          }
        }
        // if piece is at position 'h' then there is no right diagonal
        if (!(i === 7)) {
          var rightDiagonal = columns[i + 1] + String(Number(this.positionY) + 1);
          var rightCell = document.getElementById(rightDiagonal);
          if (pawnValidDiagonal(rightCell, this.team)) {
            potentialMoves.push(rightDiagonal);
          }
        }
        console.log(this, potentialMoves);
        break;
      default:
        console.log('invalid type');
        break;
    }
    return potentialMoves;
  };

  /**
   * pawnValidDiagonal is a helper function for Piece.prototype.potentialMoves.
   * It determines whether or not there is an enemy pawn in either the right or
   * left diagonal
   *
   * @param {element} diagonal
   * @param {string} team
   */
  function pawnValidDiagonal(diagonal, team) {
    var enemyTeam = team === 'white' ? 'black' : 'white';
    if (hasClass(diagonal, 'hasPiece')) {
      if (diagonal.childNodes[0].id.indexOf(enemyTeam) > -1) {
        return true;
      }
    }
    return false;
  }
})();
