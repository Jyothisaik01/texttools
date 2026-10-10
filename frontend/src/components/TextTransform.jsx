import React, { useState } from 'react';
import {
  Type,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Hash,
  Binary,
  Link,
  Code2,
} from 'lucide-react';

export default function TextTransform({ darkMode, showToast }) {
  const [inputText, setInputText] = useState('Welcome to TextTools! Effortlessly transform, analyze, and format your text.');
  const [copied, setCopied] = useState(false);

  const transforms = [
    { name: 'UPPERCASE', fn: (t) => t.toUpperCase(), icon: Type },
    { name: 'lowercase', fn: (t) => t.toLowerCase(), icon: Type },
    {
      name: 'Title Case',
      fn: (t) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()),
      icon: Type,
    },
    {
      name: 'camelCase',
      fn: (t) =>
        t
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
          .replace(/\s+/g, ''),
      icon: Code2,
    },
    {
      name: 'snake_case',
      fn: (t) =>
        t
          .trim()
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_'),
      icon: Hash,
    },
    {
      name: 'kebab-case',
      fn: (t) =>
        t
          .trim()
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-'),
      icon: Hash,
    },
    {
      name: 'URL Encode',
      fn: (t) => encodeURIComponent(t),
      icon: Link,
    },
    {
      name: 'URL Decode',
      fn: (t) => {
        try {
          return decodeURIComponent(t);
        } catch {
          return t;
        }
      },
      icon: Link,
    },
    {
      name: 'Base64 Encode',
      fn: (t) => {
        try {
          return btoa(unescape(encodeURIComponent(t)));
        } catch {
          return t;
        }
      },
      icon: Binary,
    },
    {
      name: 'Base64 Decode',
      fn: (t) => {
        try {
          return decodeURIComponent(escape(atob(t)));
        } catch {
          return t;
        }
      },
      icon: Binary,
    },
    {
      name: 'Reverse Text',
      fn: (t) => t.split('').reverse().join(''),
      icon: RotateCcw,
    },
    {
      name: 'Remove Extra Spaces',
      fn: (t) => t.replace(/[ \t]+/g, ' ').trim(),
      icon: Sparkles,
    },
  ];

  const applyTransform = (transform) => {
    try {
      const res = transform.fn(inputText);
      setInputText(res);
      showToast?.(`Transformed to ${transform.name}!`, 'success', 'Transformed');
    } catch {
      showToast?.(`Could not apply ${transform.name}`, 'error', 'Error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast?.('Copied to clipboard!', 'success', 'Copied');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3.5 overflow-hidden">
      {/* Banner */}
      <div
        className={`shrink-0 rounded-2xl border p-5 flex items-center justify-between ${
          darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-gradient-to-r from-blue-50/60 to-white border-slate-200'
        }`}
      >
        <div>
          <h2 className="text-xl font-black tracking-tight">
            <span>Text</span> <span className="text-blue-600">Transform</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Instantly convert case styles, encode/decode data, clean whitespace, and format strings.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Result'}</span>
        </button>
      </div>

      {/* Editor & Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3.5 overflow-hidden">
        {/* Left: Input Textarea */}
        <div
          className={`lg:col-span-2 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden shadow-xs ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="shrink-0 flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800 text-xs">
            <span className="font-bold">Text Editor</span>
            <span className="text-slate-400 font-mono">
              {inputText.length} characters • {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
            </span>
          </div>
          <div
            className={`flex-1 min-h-0 rounded-xl border p-3 ${
              darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
            }`}
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-full resize-none outline-none border-none bg-transparent font-sans text-xs sm:text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Transform Action Buttons */}
        <div
          className={`rounded-2xl border p-4 flex flex-col overflow-hidden shadow-xs ${
            darkMode ? 'bg-black border-zinc-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="shrink-0 mb-2 pb-1.5 border-b border-slate-100 dark:border-zinc-800 text-xs font-bold">
            Available Transformations
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
            {transforms.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => applyTransform(t)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer ${
                  darkMode
                    ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-200 hover:text-white'
                    : 'border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-200 text-slate-700 hover:text-blue-600 shadow-2xs'
                }`}
              >
                <span>{t.name}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
