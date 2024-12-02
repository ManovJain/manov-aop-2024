"use client";

import { useEffect, useState, useRef } from "react";
import { Gift } from "lucide-react";

const SPRITE_FRAMES = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(1)-2T00RD2kEr12FafY8wddivorI3YiPe.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(2)-Oldsr0cMq8NswjoAESz1pYHbTaA0St.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(3)-PAJUIDiNqhyjztxyek8m8WSNy2tIxi.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(4)-TpNF6BzF2YUSQegQY3lAvl3tYaLaPW.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(5)-wZaBPGgVSglWN4F6XZPtLMQPCemhSv.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(6)-hew6Yjf6gYfgYMSwGp63F9dXakQCfJ.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(7)-seO1P1NUt0UJTPVP9OeVfdKoWi6VEN.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(8)-EiPk5OBZ7KfVScCCdyt1CfWw0qQdFV.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(9)-ce9PxgviKmgYfacGfBalNteh7fufY5.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Run%20(10)-Xe3bmH8nirPZid18A9jE9aBBprJoVb.png",
];

interface Gift {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export default function SantaSprite() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  // Countdown to Christmas
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const christmasDate = new Date(currentYear, 11, 25); // Month is 0-indexed

      if (now > christmasDate) {
        christmasDate.setFullYear(currentYear + 1);
      }

      const difference = christmasDate.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spawn gifts periodically
  useEffect(() => {
    const spawnGift = () => {
      if (!containerRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();
      const newGift: Gift = {
        id: Date.now(),
        x: Math.random() * (width - 40),
        y: Math.random() * (height - 40),
        collected: false,
      };
      setGifts((prev) => [...prev, newGift]);
    };

    const interval = setInterval(spawnGift, 2000); // Spawn a gift every 2 seconds
    spawnGift(); // Spawn initial gift

    return () => clearInterval(interval);
  }, []);

  // Handle keydown events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      setIsMoving(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
      if (keysPressed.current.size === 0) {
        setIsMoving(false);
        setCurrentFrame(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Check for gift collection
  const checkGiftCollection = () => {
    const santaWidth = 96; // Santa sprite width
    const santaHeight = 96; // Santa sprite height
    const giftSize = 40; // Gift icon size

    setGifts((prevGifts) =>
      prevGifts.map((gift) => {
        if (gift.collected) return gift;

        const collision =
          position.x < gift.x + giftSize &&
          position.x + santaWidth > gift.x &&
          position.y < gift.y + giftSize &&
          position.y + santaHeight > gift.y;

        if (collision) {
          setScore((prev) => prev + 1);
          return { ...gift, collected: true };
        }
        return gift;
      })
    );
  };

  // Remove collected gifts after animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setGifts((prev) => prev.filter((gift) => !gift.collected));
    }, 500); // Remove after 500ms (duration of animation)

    return () => clearTimeout(timeout);
  }, [gifts]);

  // Animation loop
  useEffect(() => {
    const updatePosition = () => {
      const speed = 3;
      const newPosition = { ...position };
      const container = containerRef.current;

      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const santaWidth = 96;
        const santaHeight = 96;

        if (keysPressed.current.has("ArrowLeft")) {
          newPosition.x = Math.max(0, position.x - speed);
          setDirection("left");
        }
        if (keysPressed.current.has("ArrowRight")) {
          newPosition.x = Math.min(width - santaWidth, position.x + speed);
          setDirection("right");
        }
        if (keysPressed.current.has("ArrowUp")) {
          newPosition.y = Math.max(0, position.y - speed);
        }
        if (keysPressed.current.has("ArrowDown")) {
          newPosition.y = Math.min(height - santaHeight, position.y + speed);
        }

        setPosition(newPosition);
        checkGiftCollection();
      }

      if (isMoving) {
        setCurrentFrame((prev) => (prev + 1) % SPRITE_FRAMES.length);
      }

      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    animationFrameRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMoving, position]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xDeFlwgWmBSGM5eUCpDRXkRSDyFDCA.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Christmas Countdown */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/80 p-4 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">Countdown to Christmas</h2>
        <p className="text-2xl font-mono" aria-live="polite">
          {countdown}
        </p>
      </div>

      {/* Gifts */}
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className={`absolute transition-all duration-500 ${
            gift.collected ? "scale-150 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{
            transform: `translate(${gift.x}px, ${gift.y}px)`,
          }}
        >
          <div className="w-10 h-10 text-red-500">
            <Gift className="w-full h-full" />
          </div>
        </div>
      ))}

      {/* Santa */}
      <div
        className="absolute transition-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <img
          src={SPRITE_FRAMES[currentFrame]}
          alt="Santa sprite"
          className="w-24 h-24 object-contain"
          style={{
            transform: `scaleX(${direction === "left" ? -1 : 1})`,
          }}
        />
      </div>

      {/* Score and Instructions */}
      <div className="absolute bottom-4 left-4 bg-white/80 p-4 rounded-lg space-y-2">
        <p>Use arrow keys to move Santa</p>
        <p className="font-bold">Gifts Collected: {score}</p>
      </div>
    </div>
  );
}
