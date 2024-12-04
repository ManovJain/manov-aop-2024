// import { Game } from './components/Game'

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-amber-50">
//       <Game />
//     </main>
//   )
// }

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Square, Triangle, Circle } from "lucide-react";

// Types and Utilities
type ShapeType = "square" | "triangle" | "circle";
type ShapeColor = "red" | "green" | "gold";

interface ShapeProps {
  type: ShapeType;
  color: ShapeColor;
  icon: "window" | "door" | null;
}

const shapeTypes: ShapeType[] = ["square", "triangle", "circle"];
const shapeColors: ShapeColor[] = ["red", "green", "gold"];
const icons = ["window", "door", null];

function getRandomShape(): ShapeProps {
  const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
  const icon = icons[Math.floor(Math.random() * icons.length)] as
    | "window"
    | "door"
    | null;

  if (icon === "window" || icon === "door") {
    return { type: "square", color, icon };
  }

  return { type, color, icon };
}

function getShapeComponent(type: ShapeType) {
  switch (type) {
    case "square":
      return Square;
    case "triangle":
      return Triangle;
    case "circle":
      return Circle;
    default:
      return Square;
  }
}

const christmasJokes = [
  "What does a gingerbread man put on his bed? Cookie sheets!",
  "Why did Santa's helper see the doctor? Because he had low elf esteem!",
  "What do you call an elf who sings? A wrapper!",
  "What kind of photos do elves take? Elfies!",
  "What do snowmen eat for breakfast? Frosted Flakes!",
  "What do you call a scared snowman? A snow-coward!",
  "What do you get when you cross a snowman with a vampire? Frostbite!",
  "Why don't gingerbread men tell jokes? They're always baked!",
  "What did the gingerbread man say when he broke his leg? Oh snap!",
  "What's a gingerbread man's favorite school subject? Cookie-ng class!",
];

// Components
const Shape: React.FC<ShapeProps & { onClick?: () => void }> = ({
  type,
  color,
  icon,
  onClick,
}) => {
  const ShapeComponent = getShapeComponent(type);

  return (
    <div
      className="relative w-14 h-14 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <ShapeComponent
        className={`w-12 h-12 ${
          color === "red"
            ? "text-red-500"
            : color === "green"
            ? "text-green-500"
            : "text-yellow-500" // gold
        }`}
      />
      {icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          {icon === "window" && <Square className="w-8 h-8 text-black" />}
          {icon === "door" && <Square className="w-8 h-8 text-black" />}
        </div>
      )}
    </div>
  );
};

const Grid: React.FC<{
  grid: (ShapeProps | null)[][];
  onCellClick: (row: number, col: number) => void;
  selectedShape: ShapeProps | null;
}> = ({ grid, onCellClick, selectedShape }) => {
  return (
    <div className="grid grid-cols-4 gap-1 p-4 bg-red-50 rounded-lg border-4 border-yellow-500">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-20 h-20 bg-red-100 rounded-md flex items-center justify-center ${
              !cell && selectedShape ? "animate-pulse" : ""
            }`}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {cell && <Shape {...cell} />}
          </div>
        ))
      )}
    </div>
  );
};

const Sidebar: React.FC<{
  shapes: ShapeProps[];
  onShapeSelect: (index: number) => void;
  remainingShapes: number;
  selectedShape: ShapeProps | null;
}> = ({ shapes, onShapeSelect, remainingShapes, selectedShape }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 flex flex-col items-center border-l-4 border-yellow-500">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Shapes</h2>
      <div className="flex flex-col gap-4">
        {shapes.map((shape, index) => (
          <div
            key={index}
            className={`p-1 rounded-md ${
              selectedShape === shape ? "border-2 border-yellow-500" : ""
            }`}
          >
            <Shape {...shape} onClick={() => onShapeSelect(index)} />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <p className="text-lg font-semibold text-red-700">
          Remaining Shapes: {remainingShapes}
        </p>
      </div>
    </div>
  );
};

const GingerbreadMan: React.FC<{ joke: string; className?: string }> = ({
  joke,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <svg
        width="100"
        height="120"
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-bounce"
      >
        <path
          d="M50 10C65.5 10 78 22.5 78 38C78 53.5 65.5 66 50 66C34.5 66 22 53.5 22 38C22 22.5 34.5 10 50 10ZM50 70C77.5 70 100 81.5 100 95V110H0V95C0 81.5 22.5 70 50 70Z"
          fill="#8B4513"
        />
        <circle cx="35" cy="35" r="5" fill="white" />
        <circle cx="65" cy="35" r="5" fill="white" />
        <path
          d="M40 50C40 52.7614 44.4772 55 50 55C55.5228 55 60 52.7614 60 50"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative bg-amber-100 rounded-lg p-4 border-2 border-amber-500 max-w-md">
        <div className="absolute -top-3 left-4 bg-amber-100 px-2 text-amber-800 font-bold text-sm">
          Gingerbread dude
        </div>
        <p className="text-black font-medium mt-2">{joke}</p>
      </div>
    </div>
  );
};

// Main Game Component
const GRID_ROWS = 4;
const GRID_COLS = 4;
const TOTAL_SHAPES = 10;

export default function GingerbreadHouseBuilder() {
  const [grid, setGrid] = useState<(ShapeProps | null)[][]>(
    Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(null))
  );
  const [shapes, setShapes] = useState<ShapeProps[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeProps | null>(null);
  const [remainingShapes, setRemainingShapes] = useState(TOTAL_SHAPES);
  const [currentJoke, setCurrentJoke] = useState("");
  const [usedJokes, setUsedJokes] = useState<Set<number>>(new Set());

  const generateShapes = useCallback(() => {
    setShapes(
      Array(3)
        .fill(null)
        .map(() => getRandomShape())
    );
  }, []);

  useEffect(() => {
    generateShapes();
  }, [generateShapes]);

  const getRandomJoke = useCallback(() => {
    if (usedJokes.size >= christmasJokes.length) {
      return "Thanks for building the house!";
    }

    let jokeIndex;
    do {
      jokeIndex = Math.floor(Math.random() * christmasJokes.length);
    } while (usedJokes.has(jokeIndex));

    setUsedJokes((prev) => new Set(prev).add(jokeIndex));
    return christmasJokes[jokeIndex];
  }, [usedJokes]);

  const handleShapeSelect = (index: number) => {
    setSelectedShape(shapes[index]);
  };

  const handleCellClick = (row: number, col: number) => {
    if (selectedShape && remainingShapes > 0 && !grid[row][col]) {
      const newGrid = [...grid];
      newGrid[row][col] = selectedShape;
      setGrid(newGrid);
      setSelectedShape(null);
      setRemainingShapes((prev) => {
        const newRemaining = prev - 1;
        if (newRemaining === 0) {
          setCurrentJoke("Thanks for building the house!");
        } else {
          setCurrentJoke(getRandomJoke());
        }
        return newRemaining;
      });
      generateShapes();
    }
  };

  const handleSaveHouse = () => {
    const canvas = document.createElement("canvas");
    canvas.width = GRID_COLS * 80;
    canvas.height = GRID_ROWS * 80;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#fef2f2"; // bg-red-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            ctx.fillStyle =
              cell.color === "red"
                ? "#ef4444"
                : cell.color === "green"
                ? "#22c55e"
                : "#eab308";
            ctx.beginPath();

            const x = colIndex * 80 + 40;
            const y = rowIndex * 80 + 40;

            if (cell.type === "square") {
              ctx.rect(x - 30, y - 30, 60, 60);
            } else if (cell.type === "triangle") {
              ctx.moveTo(x, y - 30);
              ctx.lineTo(x + 30, y + 30);
              ctx.lineTo(x - 30, y + 30);
            } else if (cell.type === "circle") {
              ctx.arc(x, y, 30, 0, Math.PI * 2);
            }

            ctx.fill();

            if (cell.icon) {
              ctx.fillStyle = "#000000";
              ctx.font = "36px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(cell.icon === "window" ? "□" : "▭", x, y);
            }
          }
        });
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "gingerbread-house.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-3/4 p-4">
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Gingerbread House Builder
        </h1>
        <Grid
          grid={grid}
          onCellClick={handleCellClick}
          selectedShape={selectedShape}
        />
        <div className="mt-8 mb-4">
          {currentJoke && <GingerbreadMan joke={currentJoke} />}
        </div>
        <button
          onClick={handleSaveHouse}
          disabled={remainingShapes > 0}
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-red-900 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save House
        </button>
      </div>
      <Sidebar
        shapes={shapes}
        onShapeSelect={handleShapeSelect}
        remainingShapes={remainingShapes}
        selectedShape={selectedShape}
      />
    </div>
  );
}
