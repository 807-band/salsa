export const groupByProp = (xs, prop) => {
  const grouped = {};
  for (let i = 0; i < xs.length; i += 1) {
    const p = xs[i][prop];
    if (!grouped[p]) { grouped[p] = []; }
    grouped[p].push(xs[i]);
  }
  return grouped;
};

export const canEval = (clazz, level, evalStatus) => {
  if (clazz === 0) {
    if (level <= 1) {
      if (evalStatus !== 'eval' && evalStatus !== 'eval-1-2') {
        return false;
      }
    } else if (level >= 2 && level <= 5) {
      if (evalStatus !== 'eval' && evalStatus !== 'eval-3-6') {
        return false;
      }
    }
  } else if (clazz === 1) {
    if (evalStatus !== 'eval') {
      return false;
    }
  }
  return true;
};
