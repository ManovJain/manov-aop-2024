"use client";

import SnowmanGame from "./snowman";

export default function Home() {
  return (
    <div className="relative">
      <SnowmanGame />
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-4 rounded-lg">
        <h1 className="text-xl font-bold mb-2">Snowman Game</h1>
        <p>Use arrow keys to move the snowman.</p>
        <p>The carrot nose shows the direction the snowman is facing.</p>
        <p>The snowman&apos;s body remains vertical at all times.</p>
        <p>Press and hold the space bar to charge and throw a snowball.</p>
        <p>The longer you hold, the more powerful the throw!</p>
      </div>
    </div>
  );
}
