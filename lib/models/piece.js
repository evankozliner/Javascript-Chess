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
        var upOne = null, upTwo = null, downOne = null;
        if (this.team === 'white') {
          upOne = String(Number(this.positionY) + 1);
          upTwo = String(Number(this.positionY) + 2);
          downOne = String(Number(this.positionY) - 1);
        } else {
          upOne = String(Number(this.positionY) - 1);
          upTwo = String(Number(this.positionY) - 2);
          downOne = String(Number(this.positionY) + 1);
        }
        potentialMoves.push(this.positionX + upOne);
        // check to see if piece has yet to be moved of starting square
        if (Number(this.positionY) === 2 || Number(this.positionY) === 7) {
          var upCell = document.getElementById(this.positionX + upOne);
          if (upCell.childNodes.length === 0) {
            potentialMoves.push(this.positionX + upTwo);
          }
        }
        // check diagonals for enemy pieces
        var i = columns.indexOf(this.positionX);
        // if piece is at position 'a' then there is no left diagonal
        if (!(i === 0)) {
          var leftDiagonal = columns[i - 1] + upOne;
          var leftCell = document.getElementById(leftDiagonal);
          if (pawnValidDiagonal(leftCell, this.team)) {
            potentialMoves.push(leftDiagonal);
          }
        }
        // if piece is at position 'h' then there is no right diagonal
        if (!(i === 7)) {
          var rightDiagonal = columns[i + 1] + upOne;
          var rightCell = document.getElementById(rightDiagonal);
          if (pawnValidDiagonal(rightCell, this.team)) {
            potentialMoves.push(rightDiagonal);
          }
        }
        potentialMoves = potentialMoves.filter(function(move) {
          var moveEle = document.getElementById(move);
          if (moveEle.childNodes.length > 0) {
            var team = moveEle.childNodes[0].id.split('-')[0];
          }
          if (team !== this.team) {
            return move;
          }
        }.bind(this));
        console.log(potentialMoves);
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
