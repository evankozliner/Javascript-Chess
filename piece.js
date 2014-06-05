function Piece(properties) {
  this.team = properties[0];
  this.type = properties[1];
  this.number = null;
  if (this.type !== 'king' && this.type !== 'queen') {
    this.number = properties[2];
  }
}

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
