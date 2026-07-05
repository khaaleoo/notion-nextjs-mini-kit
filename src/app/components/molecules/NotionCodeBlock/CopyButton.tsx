"use client";
import { useState } from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy code"
      className="absolute top-10 right-3 z-10 p-1.5 rounded-md cursor-pointer
        bg-gray-200/80 hover:bg-gray-300 text-gray-600 hover:text-gray-900 border border-gray-300
        opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-150"
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardIcon className="w-3.5 h-3.5" />}
    </button>
  );
}
