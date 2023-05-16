import React, { useEffect, useState } from "react";
import "./SortingVisualizer.css";
import sortingAnimations from "../assets/sortingAlgos.js";
import Controllers from "./controllers";

const PRIMARY_COLOR = "turquoise",
  SECONDARY_COLOR = "red",
  TERTIARY_COLOR = "purple",
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
        barOneStyle.height = `${(newHeight / (max - min)) * 80}%`;
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
      await changeColorAnimations(pivotIndex, arrayBars, 2);
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
      await compareAnimation([pivotIndex, finalPos], arrayBars, 1);
    }
  };

  const testSort = () => {
    for (let i = 0; i < 100; i++) {
      const a1 = array.slice().sort((a, b) => a - b);
      const a2 = array.slice();
      sortingAnimations.getQuickSortAnimations(a2);
      console.log(JSON.stringify(a1) === JSON.stringify(a2));
      // console.log(array,a2);
      resetArray(count);
    }
  };

  const CHOICES = [
    [0, "MergeSort", mergeSort],
    [1, "InsertionSort", insertionSort],
    [2, "BubbleSort", bubbleSort],
    [3, "QuickSort", quickSort],
  ];

  return (
    <div>
      <div className="array-container">
        {array.map((value, index) => (
          <div
            className="array-bar"
            key={index}
            style={{
              height: `${(value / (max - min)) * 80}%`,
              width: `${window.innerWidth / (1.5 * count)}px`,
            }}
          ></div>
        ))}
      </div>
      <div className="container">
        <button
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
        <label htmlFor="algo">Select sorting algo:</label>
        <select
          id="algo"
          name="algo"
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(Number(e.currentTarget.value))}
        >
          {CHOICES.map((c) => (
            <option value={c[0]} key={c[0]}>
              {c[1]}
            </option>
          ))}
        </select>
        <button
          disabled={animationOngoing}
          onClick={async () => {
            if (animationOngoing) return;
            setAnimationOngoing(true);
            await CHOICES[selectedAlgo][2](array);
            await finalAnimation();
            setAnimationOngoing(false);
          }}
        >
          Sort
        </button>
        <Controllers
          maxCount={getMaxCount()}
          count={count}
          animationOngoing={animationOngoing}
          setCount={setCount}
          resetArray={resetArray}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
        />
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
