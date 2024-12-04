"use client";

import React, { useState, useEffect, useCallback } from "react";

const STEP = 5;
const INTERVAL = 16;
const MAX_CHARGE = 2000;
const SNOWBALL_SPEED = 10;

interface Snowball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  charge: number;
}

export default function SnowmanGame() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [rotation, setRotation] = useState(0);
  const [charging, setCharging] = useState(false);
  const [chargeStart, setChargeStart] = useState(0);
  const [snowballs, setSnowballs] = useState<Snowball[]>([]);

  const throwSnowball = useCallback(
    (charge: number) => {
      const angle = (rotation * Math.PI) / 180;
      const power = (charge / MAX_CHARGE) * SNOWBALL_SPEED;
      setSnowballs((prev) => [
        ...prev,
        {
          x: position.x,
          y: position.y - 90,
          dx: Math.cos(angle) * power,
          dy: Math.sin(angle) * power,
          charge: charge,
        },
      ]);
    },
    [position, rotation]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => new Set(prev).add(e.key));
      switch (e.key) {
        case "ArrowLeft":
          setRotation(180);
          break;
        case "ArrowRight":
          setRotation(0);
          break;
        case "ArrowUp":
          setRotation(270);
          break;
        case "ArrowDown":
          setRotation(90);
          break;
        case " ":
          if (!charging) {
            setCharging(true);
            setChargeStart(Date.now());
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const updated = new Set(prev);
        updated.delete(e.key);
        return updated;
      });
      if (e.key === " " && charging) {
        const charge = Math.min(Date.now() - chargeStart, MAX_CHARGE);
        throwSnowball(charge);
        setCharging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [charging, chargeStart, throwSnowball]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        let { x, y } = prev;

        if (keysPressed.has("ArrowLeft")) x -= STEP;
        if (keysPressed.has("ArrowRight")) x += STEP;
        if (keysPressed.has("ArrowUp")) y -= STEP;
        if (keysPressed.has("ArrowDown")) y += STEP;

        x = Math.max(50, Math.min(window.innerWidth - 50, x));
        y = Math.max(50, Math.min(window.innerHeight - 50, y));

        return { x, y };
      });

      setSnowballs((prev) =>
        prev
          .map((snowball) => ({
            ...snowball,
            x: snowball.x + snowball.dx,
            y: snowball.y + snowball.dy,
            dy: snowball.dy + 0.2,
          }))
          .filter(
            (snowball) =>
              snowball.x > 0 &&
              snowball.x < window.innerWidth &&
              snowball.y < window.innerHeight
          )
      );
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [keysPressed]);

  const chargePercentage = charging
    ? Math.min(((Date.now() - chargeStart) / MAX_CHARGE) * 100, 100)
    : 0;

  return (
    <div className="h-screen w-screen bg-blue-500 overflow-hidden">
      <svg width="100%" height="100%" className="absolute top-0 left-0">
        <g
          transform={`translate(${position.x}, ${position.y})`}
          style={{ transition: "transform 0.1s linear" }}
        >
          <circle cx="0" cy="-90" r="20" fill="white" />
          <circle cx="0" cy="-40" r="30" fill="white" />
          <circle cx="0" cy="20" r="40" fill="white" />

          <g transform={`rotate(${rotation}, 0, -90)`}>
            <polygon
              points="20,-90 30,-93 20,-96"
              fill="orange"
              stroke="orange"
            />
          </g>

          {charging && (
            <rect
              x="-25"
              y="-130"
              width="50"
              height="10"
              fill="none"
              stroke="black"
            />
          )}
          {charging && (
            <rect
              x="-25"
              y="-130"
              width={chargePercentage / 2}
              height="10"
              fill="red"
            />
          )}
        </g>

        {snowballs.map((snowball, index) => (
          <circle
            key={index}
            cx={snowball.x}
            cy={snowball.y}
            r={5 + (snowball.charge / MAX_CHARGE) * 5}
            fill="white"
            stroke="lightgray"
          />
        ))}
      </svg>
    </div>
  );
}
