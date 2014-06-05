/**
 * Piece represents a piece on the board
 *
 * @param {array} properties
 */
function Piece(properties) {
  this.team = properties[0];
  this.type = properties[1];
  this.number = null;
  if (this.type !== 'king' && this.type !== 'queen') {
    this.number = properties[2];
  }
}

/**
 * potentialMoves returns an array of cell IDs. Each cell ID represents a cell
 * that this piece can move to
 *
 * @return {array}
 */
Piece.prototype.potentialMoves = function() {
  switch (this.type) {
    case 'king':
      console.log('king');
      break;
    case 'queen':
      console.log('queen');
      break;
    case 'bishop':
      console.log('bishop');
      break;
    case 'knight':
      console.log('knight');
      break;
    case 'rook':
      console.log('rook');
      break;
    case 'pawn':
      console.log('pawn');
      break;
    default:
      console.log('invalid type');
      break;
  }
};
