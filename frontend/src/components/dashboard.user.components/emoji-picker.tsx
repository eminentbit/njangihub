"use client";

import { useEffect, useRef } from "react";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EmojiPicker = ({ onEmojiSelect, isOpen, onClose }: EmojiPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  // Common emojis organized by category
  const emojis = {
    "Smileys & Emotion": [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
    ],
    "People & Body": [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤝",
      "🙏",
      "👏",
      "🙌",
      "👐",
      "🤲",
      "🤦‍♂️",
      "🤦‍♀️",
      "🤷‍♂️",
      "🤷‍♀️",
    ],
    "Animals & Nature": [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
    ],
    "Food & Drink": [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
    ],
    Activities: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🎱",
      "🏓",
      "🏸",
      "🥅",
      "🏒",
      "🏑",
      "🥍",
    ],
    Objects: [
      "💻",
      "📱",
      "📞",
      "⌚",
      "📷",
      "🔋",
      "💡",
      "🔨",
      "🧰",
      "🧲",
      "🧪",
      "🧫",
      "🧬",
      "🔬",
      "🔭",
    ],
    Symbols: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
    ],
  };

  useEffect(() => {
    // Close emoji picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-14 right-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 max-h-72 overflow-y-auto z-10"
    >
      <div className="p-2 sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Smile className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium">Emoji Picker</span>
        </div>
      </div>
      <div className="p-2">
        {Object.entries(emojis).map(([category, categoryEmojis]) => (
          <div key={category} className="mb-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {category}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {categoryEmojis.map((emoji, index) => (
                <button
                  type="button"
                  key={index}
                  className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => {
                    onEmojiSelect(emoji);
                    onClose();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
