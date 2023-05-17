import React, { useEffect, useState } from "react";
import "./SortingVisualizer.css";
import sortingAnimations from "../assets/sortingAlgos.js";
import sortingAlgos from "../assets/sortingAlgos.js";

const PRIMARY_COLOR = "turquoise",
  SECONDARY_COLOR = "red",
  TERTIARY_COLOR = "greenyellow",
  max = 1000,
  min = 10;

function SortingVisualizer(props) {
  const [array, setArray] = useState([]);
  const [count, setCount] = useState(getMaxCount());
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [selectedAlgo, setSelectedAlgo] = useState(0);
  const [animationOngoing, setAnimationOngoing] = useState(false);

  const resetArray = (count = 100) => {
    let arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(getRandomNumber(min, max));
    }
    setArray(arr);
  };

  useEffect(() => {
    resetArray(count);
  }, []);

  const setColorAnimation = async (arrayBar, color) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        arrayBar.style.backgroundColor = color;
        resolve();
      }, animationSpeed);
    });
  };

  const finalAnimation = async () => {
    const arrayBars = document.getElementsByClassName("array-bar");
    for (let i = 0; i < count; i++) {
      await setColorAnimation(arrayBars[i], SECONDARY_COLOR);
    }

    for (let i = 0; i < count; i++) {
      await setColorAnimation(arrayBars[i], PRIMARY_COLOR);
    }

    setArray(array.slice().sort((a, b) => a - b));
  };

  const changeColorAnimations = async (barIndex, arrayBars, i) => {
    const barStyle = arrayBars[barIndex].style;
    const color =
      i % 3 == 0
        ? SECONDARY_COLOR
        : i % 3 == 1
        ? PRIMARY_COLOR
        : TERTIARY_COLOR;
    return new Promise((resolve) => {
      setTimeout(() => {
        barStyle.backgroundColor = color;
        resolve();
      }, animationSpeed);
    });
  };

  const compareAnimation = async (animation, arrayBars, i) => {
    const [barOneIndex, barTwoIndex] = animation;
    const barOneStyle = arrayBars[barOneIndex].style;
    const barTwoStyle = arrayBars[barTwoIndex].style;
    const color =
      i % 3 == 0
        ? SECONDARY_COLOR
        : i % 3 == 1
        ? PRIMARY_COLOR
        : TERTIARY_COLOR;
    return new Promise((resolve) => {
      setTimeout(() => {
        barOneStyle.backgroundColor = color;
        barTwoStyle.backgroundColor = color;
        resolve();
      }, animationSpeed);
    });
  };

  const overrideHtAnimation = async (animation, arrayBars) => {
    const [barOneIndex, newHeight] = animation;
    const barOneStyle = arrayBars[barOneIndex].style;
    return new Promise((resolve) => {
      setTimeout(() => {
        barOneStyle.height = `${(newHeight / (max - min)) * 95}%`;
        resolve();
      }, animationSpeed);
    });
  };

  const mergeSort = async (array) => {
    const animations = sortingAnimations.getMergeSortAnimations(array.slice());
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const colorChange = i % 3 !== 2;
      if (colorChange) {
        await compareAnimation(animations[i], arrayBars, i);
      } else {
        await overrideHtAnimation(animations[i], arrayBars);
      }
    }
  };

  const insertionSort = async (array) => {
    const animations = sortingAnimations.getInsertionSortAnimations(
      array.slice()
    );
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      let barOneIndex = animations[i][0],
        barOneHeight = animations[i][1];
      await changeColorAnimations(barOneIndex, arrayBars, 0);
      for (let j = 2; j < animations[i].length; j++) {
        await changeColorAnimations(barOneIndex - 1, arrayBars, 0);

        await overrideHtAnimation([barOneIndex, animations[i][j]], arrayBars);
        await overrideHtAnimation([barOneIndex - 1, barOneHeight], arrayBars);

        await changeColorAnimations(barOneIndex, arrayBars, 1);
        barOneIndex--;
      }
      await changeColorAnimations(barOneIndex, arrayBars, 1);
    }
  };

  const bubbleSort = async (array) => {
    const animations = sortingAnimations.getBubbleSortAnimations(array.slice());

    const arrayBars = document.getElementsByClassName("array-bar");
    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      await compareAnimation([animation[0], animation[1]], arrayBars, 0);
      if (animation.length > 2) {
        await overrideHtAnimation([animation[0], animation[3]], arrayBars);
        await overrideHtAnimation([animation[1], animation[2]], arrayBars);
      }
      changeColorAnimations(animation[0], arrayBars, 1);
      changeColorAnimations(animation[1], arrayBars, 2);
    }
  };

  const quickSort = async () => {
    const animations = sortingAnimations.getQuickSortAnimations(array.slice());

    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const [pivotIndex, pivot, animation, finalPos, value] = animations[i];
      await changeColorAnimations(pivotIndex, arrayBars, 0);
      for (let i = 0; i < animation.length; i++) {
        await compareAnimation(
          [animation[i][0], animation[i][1]],
          arrayBars,
          0
        );
        await overrideHtAnimation(
          [animation[i][0], animation[i][3]],
          arrayBars
        );
        await overrideHtAnimation(
          [animation[i][1], animation[i][2]],
          arrayBars
        );
        await compareAnimation(
          [animation[i][0], animation[i][1]],
          arrayBars,
          1
        );
      }
      await compareAnimation([pivotIndex, finalPos], arrayBars, 0);
      await overrideHtAnimation([pivotIndex, value], arrayBars);
      await overrideHtAnimation([finalPos, pivot], arrayBars);
      // await compareAnimation([pivotIndex, finalPos], arrayBars, 1);
      await changeColorAnimations(pivotIndex, arrayBars, 1);
      await changeColorAnimations(finalPos, arrayBars, 2);
    }
  };

  const heapSort = async () => {
    const animations = sortingAlgos.getHeapSortAnimations(array.slice());
    const arrayBars = document.getElementsByClassName("array-bar");

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      await compareAnimation([animation[0], animation[1]], arrayBars, 0);
      await overrideHtAnimation([animation[0], animation[3]], arrayBars);
      await overrideHtAnimation([animation[1], animation[2]], arrayBars);
      if (animation.length === 5) {
        await changeColorAnimations(animation[0], arrayBars, 1);
        await changeColorAnimations(animation[1], arrayBars, 2);
      } else {
        await compareAnimation([animation[0], animation[1]], arrayBars, 1);
      }
    }
  };

  const testSort = () => {
    for (let i = 0; i < 100; i++) {
      const a1 = array.slice().sort((a, b) => a - b);
      const a2 = array.slice();
      sortingAnimations.getHeapSortAnimations(a2);
      console.log(JSON.stringify(a1) === JSON.stringify(a2));
      // console.log(array, a1, a2);
      resetArray(count);
    }
  };

  const CHOICES = [
    [0, "Select Sorting Algo", () => {}],
    [1, "MergeSort", mergeSort],
    [2, "InsertionSort", insertionSort],
    [3, "BubbleSort", bubbleSort],
    [4, "QuickSort", quickSort],
    [5, "HeapSort", heapSort],
  ];

  return (
    <div>
      <div className="array-container">
        {array.map((value, index) => (
          <div
            className="array-bar"
            key={index}
            style={{
              height: `${(value / (max - min)) * 95}%`,
              width: `${window.innerWidth / (1.5 * count)}px`,
            }}
          ></div>
        ))}
      </div>
      <div className="container">
        <button
          className="btn btn-primary"
          onClick={() => {
            if (animationOngoing) return;
            resetArray(count);
          }}
          disabled={animationOngoing}
        >
          Generate New Array
        </button>
        {/* <button
          onClick={() => {
            testSort();
          }}
        >
          Test Sort
        </button> */}
        <select
          id="algo"
          name="algo"
          defaultValue={selectedAlgo}
          onChange={(e) => setSelectedAlgo(Number(e.currentTarget.value))}
          className="form-select"
          style={{ maxWidth: "30%" }}
        >
          {CHOICES.map((c) => (
            <option value={c[0]} key={c[0]} selected={c[0] == selectedAlgo}>
              {c[1]}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          disabled={animationOngoing || selectedAlgo === 0}
          onClick={async () => {
            if (animationOngoing || selectedAlgo === 0) return;
            setAnimationOngoing(true);
            await CHOICES[selectedAlgo][2](array);
            await finalAnimation();
            setAnimationOngoing(false);
          }}
        >
          Sort
        </button>
        <span>
          <label htmlFor="Count" className="form-label">
            Count
          </label>
          <input
            type="range"
            className="form-range"
            id="Count"
            min="10"
            max={getMaxCount()}
            value={count}
            onChange={({ currentTarget: t }) => {
              if (animationOngoing) return;
              setCount(t.value);
              resetArray(t.value);
            }}
          />
        </span>
        <span>
          <label htmlFor="Speed" className="form-label">
            Speed
          </label>
          <input
            type="range"
            className="form-range"
            id="Speed"
            min="0"
            max="49"
            value={50 - animationSpeed}
            onChange={({ currentTarget: t }) => {
              if (animationOngoing) return;
              setAnimationSpeed(50 - t.value);
            }}
          />
        </span>
      </div>
    </div>
  );
}

export default SortingVisualizer;

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getMaxCount = () => {
  const width = window.innerWidth;
  return 50 + Math.floor(width > 750 ? width / 7 : (width - 500) / 10);
};
