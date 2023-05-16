function getMergeSortAnimations(array) {
  let animations = [];
  if (array.length <= 1) return [];
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, start, end, auxiliaryArray, animations) {
  if (start === end) return;
  const middle = Math.floor((start + end) / 2);
  mergeSortHelper(mainArray, start, middle, auxiliaryArray, animations);
  mergeSortHelper(mainArray, middle + 1, end, auxiliaryArray, animations);
  merge(mainArray, start, middle, end, auxiliaryArray, animations);
}

function merge(mainArray, start, middle, end, auxiliaryArray, animations) {
  let i = start,
    j = middle + 1,
    k = start;
  while (i <= middle && j <= end) {
    animations.push([i, j]);
    animations.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  while (i <= middle) {
    animations.push([i, i]);
    animations.push([i, i]);
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }

  while (j <= end) {
    animations.push([j, j]);
    animations.push([j, j]);
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }

  for (let k = start; k <= end; k++) auxiliaryArray[k] = mainArray[k];
}

function getInsertionSortAnimations(array) {
  let animations = [];
  if (array.length <= 1) return [];
  for (let i = 1; i < array.length; i++) {
    let j = i - 1,
      x = array[i];
    animations.push([i, x]);
    while (j >= 0 && array[j] > x) {
      animations[i - 1].push(array[j]);
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = x;
  }
  return animations;
}

function getBubbleSortAnimations(array) {
  let animations = [];
  if (array.length <= 1) return [];

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      animations.push([j, j + 1]);
      if (array[j] > array[j + 1]) {
        animations[animations.length - 1].push(array[j]);
        animations[animations.length - 1].push(array[j + 1]);
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return animations;
}

function getQuickSortAnimations(array) {
  let animations = [];
  if (array.length <= 1) return [];

  array.push(100000);

  quickSortHelper(array, 0, array.length - 1, animations);

  array.pop();

  return animations;
}

function quickSortHelper(array, start, end, animations) {
  if (start < end) {
    const middle = partition(array, start, end, animations);
    quickSortHelper(array, start, middle, animations);
    quickSortHelper(array, middle + 1, end, animations);
  }
}

function partition(array, start, end, animations) {
  if (start >= end) return;

  let pivot = array[start],
    i = start,
    j = end;

  animations.push([start, pivot, []]);

  do {
    do {
      i++;
    } while (array[i] <= pivot);
    do {
      j--;
    } while (array[j] > pivot);
    if (i <= j) {
      animations[animations.length - 1][2].push([i, j, array[i], array[j]]);
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  } while (i < j);
  animations[animations.length - 1].push(j);
  animations[animations.length - 1].push(array[j]);

  array[start] = array[j];
  array[j] = pivot;

  return j;
}

export default {
  getMergeSortAnimations,
  getInsertionSortAnimations,
  getBubbleSortAnimations,
  getQuickSortAnimations,
};
