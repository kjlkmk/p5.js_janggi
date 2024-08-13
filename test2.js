function isValidMove(piece, from, to, first) {
  let choSaGungPositions, hanSaGungPositions;

  if (first === 'w') {
    choSaGungPositions = [
      {i: 3, j: 0}, {i: 4, j: 0}, {i: 5, j: 0},
      {i: 3, j: 1}, {i: 4, j: 1}, {i: 5, j: 1},
      {i: 3, j: 2}, {i: 4, j: 2}, {i: 5, j: 2}
    ];

    hanSaGungPositions = [
      {i: 3, j: 7}, {i: 4, j: 7}, {i: 5, j: 7},
      {i: 3, j: 8}, {i: 4, j: 8}, {i: 5, j: 8},
      {i: 3, j: 9}, {i: 4, j: 9}, {i: 5, j: 9}
    ];
  } else if (first === 'b') {
    hanSaGungPositions = [
      {i: 3, j: 0}, {i: 4, j: 0}, {i: 5, j: 0},
      {i: 3, j: 1}, {i: 4, j: 1}, {i: 5, j: 1},
      {i: 3, j: 2}, {i: 4, j: 2}, {i: 5, j: 2}
    ];

    choSaGungPositions = [
      {i: 3, j: 7}, {i: 4, j: 7}, {i: 5, j: 7},
      {i: 3, j: 8}, {i: 4, j: 8}, {i: 5, j: 8},
      {i: 3, j: 9}, {i: 4, j: 9}, {i: 5, j: 9}
    ];
  } else {
    console.error("Invalid value for 'first':", first);
    return false;
  }

  const isInChoSaGung = choSaGungPositions.some(pos => pos.i === to.i && pos.j === to.j);
  const isInHanSaGung = hanSaGungPositions.some(pos => pos.i === to.i && pos.j === to.j);

  if (piece === 'a' || piece === 'k') {
    return isInChoSaGung &&
           Math.abs(to.i - from.i) <= 1 && Math.abs(to.j - from.j) <= 1 &&
           (to.i === from.i || to.j === from.j || (Math.abs(to.i - from.i) === 1 && Math.abs(to.j - from.j) === 1));
  } else if (piece === 'A' || piece === 'K') {
    return isInHanSaGung &&
           Math.abs(to.i - from.i) <= 1 && Math.abs(to.j - from.j) <= 1 &&
           (to.i === from.i || to.j === from.j || (Math.abs(to.i - from.i) === 1 && Math.abs(to.j - from.j) === 1));
  } else if (piece === 'p') {
    return (to.j === from.j + 1 && to.i === from.i) ||
           (to.j === from.j && Math.abs(to.i - from.i) === 1);
  } else if (piece === 'P') {
    return (to.j === from.j - 1 && to.i === from.i) ||
           (to.j === from.j && Math.abs(to.i - from.i) === 1);
  }

  return true;
}



function isValidMove(piece, from, to) {
  let choSaGungPositions, hanSaGungPositions;

  if (first === 'w') {
    choSaGungPositions = [
      {i: 3, j: 0}, {i: 4, j: 0}, {i: 5, j: 0},
      {i: 3, j: 1}, {i: 4, j: 1}, {i: 5, j: 1},
      {i: 3, j: 2}, {i: 4, j: 2}, {i: 5, j: 2}
    ];

    hanSaGungPositions = [
      {i: 3, j: 7}, {i: 4, j: 7}, {i: 5, j: 7},
      {i: 3, j: 8}, {i: 4, j: 8}, {i: 5, j: 8},
      {i: 3, j: 9}, {i: 4, j: 9}, {i: 5, j: 9}
    ];
  } else if (first === 'b') {
    hanSaGungPositions = [
      {i: 3, j: 0}, {i: 4, j: 0}, {i: 5, j: 0},
      {i: 3, j: 1}, {i: 4, j: 1}, {i: 5, j: 1},
      {i: 3, j: 2}, {i: 4, j: 2}, {i: 5, j: 2}
    ];

    choSaGungPositions = [
      {i: 3, j: 7}, {i: 4, j: 7}, {i: 5, j: 7},
      {i: 3, j: 8}, {i: 4, j: 8}, {i: 5, j: 8},
      {i: 3, j: 9}, {i: 4, j: 9}, {i: 5, j: 9}
    ];
  }

  if (piece === 'a' || piece === 'k') {
    return choSaGungPositions.some(pos => pos.i === to.i && pos.j === to.j) &&
           Math.abs(to.i - from.i) <= 1 && Math.abs(to.j - from.j) <= 1 &&
           (to.i === from.i || to.j === from.j || Math.abs(to.i - from.i) === Math.abs(to.j - from.j));
  } else if (piece === 'A' || piece === 'K') {
    return hanSaGungPositions.some(pos => pos.i === to.i && pos.j === to.j) &&
           Math.abs(to.i - from.i) <= 1 && Math.abs(to.j - from.j) <= 1 &&
           (to.i === from.i || to.j === from.j || Math.abs(to.i - from.i) === Math.abs(to.j - from.j));
  } else if (piece === 'p') {
    return (to.j === from.j + 1 && to.i === from.i) ||
           (to.j === from.j && Math.abs(to.i - from.i) === 1);
  } else if (piece === 'P') {
    return (to.j === from.j - 1 && to.i === from.i) ||
           (to.j === from.j && Math.abs(to.i - from.i) === 1);
  }

  return true;
}
