"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Snowfall from "react-snowfall";
import { adventSections, AdventSection } from "./data/adventSections";

export default function AdventCalendar() {
  const [sections, setSections] = useState<AdventSection[]>(adventSections);
  const [stars, setStars] = useState<
    Array<{ top: string; left: string; delay: string }>
  >([]);

  useEffect(() => {
    // Generate stars only on client-side
    setStars(
      Array.from({ length: 50 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
      }))
    );
  }, []);

  const toggleSection = (id: number) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const renderRow = (start: number, end: number) => (
    <div className="flex justify-center gap-2">
      {sections.slice(start - 1, end).map((section) => (
        <TriangleSection
          key={section.id}
          section={section}
          onClick={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <Snowfall
        color="white"
        snowflakeCount={200}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 gap-2 w-fit mx-auto">
          {renderRow(1, 1)}
          {renderRow(2, 4)}
          {renderRow(5, 9)}
          {renderRow(10, 16)}
          {renderRow(17, 25)}
        </div>
      </div>

      <div className="text-center mt-8 space-y-4 relative z-10">
        <h1 className="text-4xl font-bold text-white">
          Manov's Advent of Prompt
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          25 days of prompts, made with{" "}
          <Link
            href="https://v0.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            v0
          </Link>
          !
        </p>
        <p className="text-green-400">
          See more #AdventOfPrompt creations{" "}
          <Link
            href="https://x.com/i/communities/1863294272687980838"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            here
          </Link>
        </p>
      </div>
    </div>
  );
}

function TriangleSection({
  section,
  onClick,
}: {
  section: AdventSection;
  onClick: () => void;
}) {
  const content = (
    <div
      className={`
        w-12 h-12 flex items-center justify-center
        transition-colors duration-200 ease-in-out
        ${
          section.enabled
            ? "bg-green-400 text-black cursor-pointer"
            : "bg-transparent border border-dotted border-white/30 text-white/50 cursor-not-allowed"
        }
      `}
      onClick={section.enabled ? onClick : undefined}
    >
      {section.id}
    </div>
  );

  return section.enabled ? (
    <Link href={section.redirectPath}>{content}</Link>
  ) : (
    content
  );
}
