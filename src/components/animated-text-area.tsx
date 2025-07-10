import React, { useState, useEffect, useRef } from "react";

interface AnimatedTextareaProps {
  value: string;
  setValue: (val: string) => void;
  placeholders?: string[];
  className?: string;
}

const defaultPlaceholders = [
  "Start typing your message...",
  "What's on your mind?",
  "Share your thoughts...",
  "Tell us what you need...",
  "How can we help you today?",
];

const AnimatedTextarea: React.FC<AnimatedTextareaProps> = ({
  value,
  setValue,
  placeholders = defaultPlaceholders,
  className = "",
}) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocused || value) return;
    const currentText = placeholders[placeholderIndex];
    if (isTyping) {
      if (currentIndex < currentText.length) {
        const timer = setTimeout(() => {
          setCurrentPlaceholder(currentText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 50 + Math.random() * 50);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (currentIndex > 0) {
        const timer = setTimeout(() => {
          setCurrentPlaceholder(currentText.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setIsTyping(true);
      }
    }
  }, [currentIndex, isTyping, placeholderIndex, isFocused, value, placeholders]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      setCurrentIndex(0);
      setCurrentPlaceholder("");
      setIsTyping(true);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full h-40 p-5 text-lg border border-border rounded-xl resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-foreground bg-background placeholder-transparent shadow-md"
        style={{ caretColor: "hsl(var(--primary))" }}
      />
      {/* Animated placeholder */}
      {!value && (
        <div className="absolute inset-0 p-5 pointer-events-none flex items-start">
          <div className="text-xl text-muted-foreground  select-none animate-fade-in">
            {currentPlaceholder}
            <span className="animate-pulse text-border">|</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedTextarea;
