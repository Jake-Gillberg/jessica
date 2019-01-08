// This file is hand-written, to allow boostrapping the
// quasi-peg.mjs grammar.

// It is validated in boot-env.mjs by comparing its output to
// that of the parser generated by boot-peg.mjs.

const def = (rule, ...arms) => ['def', rule, or(...arms)];
const or = (...arms) => ['or', ...arms];
const seq = (...args) => ['seq', ...args];
const act = (hole, ...sa) => ['act', seq(...sa), hole];
const lit = (str) => ['lit', str];
const pred = (hole) => ['pred', hole];
const cls = (range) => ['cls', range];
const peekNot = (pri) => ['peekNot', pri];
const many = (pri) => ['+', pri];
const zeroOrOne = (pri) => ['?', pri];
const zeroOrMany = (pri) => ['*', pri];
const begin = ['begin'];
const end = ['end'];
const dot = ['dot'];
const separated = (patt, sep) => ['**', patt, sep];

export default harden([
  def('Grammar',
    act(0, 'Spacing', many('Definition'), 'EndOfFile')),
  def('Definition',
    act(2, 'Identifier', 'LEFTARROW', 'Expression', 'SEMI', pred(1))),
  def('Expression',
    act(3, separated('Sequence', 'SLASH'))),
  def('Sequence',
    act(5, or(act(4, zeroOrMany('Prefix'))), zeroOrOne('HOLE'))),
  def('Prefix',
    act(6, 'AND', 'HOLE'),
    act(7, 'AND', 'Suffix'),
    act(8, 'NOT', 'Suffix'),
    seq('Suffix')),
  def('Suffix',
    act(9, 'Primary', or(seq('STARSTAR'), seq('PLUSPLUS')), 'Primary'),
    act(10, 'Primary',
      or(seq('QUESTION'),
        seq('STAR'),
        seq('PLUS'))),
    seq('Primary')),
  def('Primary',
    act(11, 'Super'),
    seq('Identifier', peekNot('LEFTARROW')),
    seq('OPEN', 'Expression', 'CLOSE'),
    act(12, 'Literal'),
    act(13, 'Class'),
    act(14, 'DOT'),
    act(15, 'HOLE'),
    act(16, 'BEGIN'),
    act(17, 'END')),
  def('Identifier',
    seq(begin, 'IdentStart', zeroOrMany('IdentCont'), end, 'Spacing')),
  def('IdentStart',
    seq(cls('a-zA-Z_'))),
  def('IdentCont',
    seq('IdentStart'),
    seq(cls('0-9'))),
  def('Literal',
    seq(cls("'"), begin,
      zeroOrMany(or(seq(peekNot(cls("'")), 'Char'))),
      end, cls("'"), 'Spacing'),
    seq(cls('"'), begin,
      zeroOrMany(or(seq(peekNot(cls('"')), 'Char'))),
      end, cls("'"), 'Spacing')),
  def('Class',
    seq(lit('['), begin,
      zeroOrMany(or(seq(peekNot(lit(']')), 'Range'))),
      end, lit(']'), 'Spacing')),
  def('Range',
    seq('Char', lit('-'), 'Char'),
    seq('Char')),
  def('Char',
    seq(lit('\\\\'), cls("abefnrtv'" + '"\\[\\]\\\\')),
    seq(lit('\\\\'), cls('0-3'), cls('0-7'), cls('0-7')),
    seq(lit('\\\\'), cls('0-7'), zeroOrOne(cls('0-7'))),
    seq(lit('\\\\'), lit('-')),
    seq(peekNot(lit('\\\\')), dot)),
  def('LEFTARROW', seq(lit('<-'), 'Spacing')),
  def('SLASH', seq(lit('/'), 'Spacing')),
  def('SEMI', seq(lit(';'), 'Spacing')),
  def('AND', seq(lit('&'), 'Spacing')),
  def('NOT', seq(lit('~'), 'Spacing')),
  def('QUESTION', seq(lit('?'), 'Spacing')),
  def('STAR', seq(lit('*'), 'Spacing')),
  def('PLUS', seq(lit('+'), 'Spacing')),
  def('OPEN', seq(lit('('), 'Spacing')),
  def('CLOSE', seq(lit(')'), 'Spacing')),
  def('DOT', seq(lit('.'), 'Spacing')),
  def('Spacing',
    seq(zeroOrMany(or(seq('Space'), seq('Comment'))))),
  def('Space',
    seq(lit(' ')),
    seq(lit('\\t')),
    seq('EndOfLine')),
  def('Comment',
    seq(lit('#'),
      zeroOrMany(or(seq(peekNot('EndOfLine'), dot)),
      'EndOfLine'))),
  def('EndOfLine',
    seq(lit('\\r\\n')),
    seq(lit('\\n')),
    seq(lit('\\r'))),
  def('EndOfFile',
    seq(peekNot(dot))),
  def('HOLE',
    seq(pred(18), 'Spacing')),
  def('Super',
    seq(lit('super.'), begin, 'Identifier', end)),
  def('BEGIN',
    seq(lit('<'), 'Spacing')),
  def('END',
    seq(lit('>'), 'Spacing')),
  def('PLUSPLUS',
    seq(lit('++'), 'Spacing')),
  def('STARSTAR',
    seq(lit('**'), 'Spacing')),
]);