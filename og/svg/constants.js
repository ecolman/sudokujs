'use strict';

export const classes = {
  cell: 'sudokuCell',
  textCell: 'sudokuText',
  cellHighlight: 'highlightCell',
  cellSelected: 'selectedCell',
  cellIncorrect: 'incorrectCell',
  cellPrePopulated: 'prePopulatedCell',
  textPrePopulated: 'prePopulatedText',
  note: 'note',
  selector: 'numSelector',
  selectorText: 'numSelectorText',
  menu: 'menuItem',
  smallMenu: 'smallMenuItem',
  option: 'optionItem',
  subOption: 'subOptionItem'
}

export const sizes = {
  cell: {
    width: 60,
    height: 50
  }
}

export const menuCellsToShow = [0, 2, 16, 18, 26, 36, 43, 71, 75];

export const gameView = {
  menu: 'menu',
  board: 'board',
  options: 'options'
};

export const menuOptionType = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
  expert: 'expert',
  load: 'load',
  resume: 'resume',
  options: 'options'
};

export const optionType = {
  timer: 'timer',
  highlight: 'highlight',
  feedback: 'feedback',
  penalize: 'penalize',
  notesMode: 'notesMode',
  autoRemoveNotes: 'autoRemoveNotes',
  reverseSelector: 'reverseSelector'
};

export const boardLoadType = {
  fresh: 'fresh',
  resume: 'resume',
  load: 'load'
};

export const boardDifficulty = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert'
};

