import { pos2key, invRanks } from './util'
import * as cg from './types'

export const initial: cg.FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const roles: { [letter: string]: cg.Role } = { p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king' };

const letters = { pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k' };


export function read(fen: cg.FEN): cg.Pieces {
  if (fen === 'start') fen = initial;
  const pieces: cg.Pieces = {};
  let row: number = 8;
  let col: number = 0;
  for (const c of fen) {
    switch (c) {
      case ' ': return pieces;
      case '/':
        --row;
        if (row === 0) return pieces;
        col = 0;
        break;
      case '~':
        pieces[pos2key([col, row])].promoted = true;
        break;
      default:
        const nb = parseInt(c);
        if (nb) col += nb;
        else {
          ++col;
          const role = c.toLowerCase();
          pieces[pos2key([col, row])] = {
            role: roles[role],
            color: (c === role ? 'black' : 'white') as cg.Color,
            promoted: false
          };
        }
    }
  }
  return pieces;
}

export function write(pieces: cg.Pieces): cg.FEN {
  let piece: cg.Piece, letter: string;
  return [8, 7, 6, 5, 4, 3, 2].reduce(
    (str: string, nb: any) => str.replace(new RegExp(Array(nb + 1).join('1'), 'g'), nb),
    invRanks.map(y => {
      return cg.ranks.map(x => {
        piece = pieces[pos2key([x, y])];
        if (piece) {
          letter = letters[piece.role];
          return piece.color === 'white' ? letter.toUpperCase() : letter;
        } else return '1';
      }).join('');
    }).join('/'));
}
