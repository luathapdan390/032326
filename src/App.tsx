/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, Send, AlertCircle, Play, CheckCircle2, Loader2, Shield, Crown, BookOpen, Palette, Compass, Heart, HandHelping, Laugh } from 'lucide-react';

// --- DATA ---
const examData = [
  {
    partTitle: "Part 1 – Present Simple",
    instruction: "Fill in the blanks with the correct form of the verb.",
    questions: [
      "I ______ (study) English every day.|study",
      "She ______ (work) in a hospital.|works",
      "They ______ (live) in a big city.|live",
      "He ______ (play) football on Sunday.|plays",
      "We ______ (eat) rice every day.|eat"
    ]
  },
  {
    partTitle: "Part 2 – Present Simple Negative",
    instruction: "Make negative sentences.",
    questions: [
      "I like coffee. → I ______ like coffee.|don't",
      "He plays football. → He ______ play football.|doesn't",
      "She works on Sunday. → She ______ work on Sunday.|doesn't",
      "They live in Hanoi. → They ______ live in Hanoi.|don't",
      "We study at night. → We ______ study at night.|don't"
    ]
  },
  {
    partTitle: "Part 3 – Present Continuous",
    instruction: "Complete the sentences.",
    questions: [
      "I am ______ (study) now.|studying",
      "She is ______ (watch) TV.|watching",
      "They are ______ (play) football.|playing",
      "We are ______ (learn) English.|learning",
      "He is ______ (eat) lunch.|eating"
    ]
  },
  {
    partTitle: "Part 4 – Past Simple",
    instruction: "Write the past form of the verbs.",
    questions: [
      "Yesterday I ______ (go) to school.|went",
      "She ______ (watch) TV last night.|watched",
      "They ______ (visit) their grandparents.|visited",
      "We ______ (study) English yesterday.|studied",
      "He ______ (play) football yesterday.|played"
    ]
  },
  {
    partTitle: "Part 5 – Future Simple / Going to",
    instruction: "Choose WILL or AM/IS/ARE GOING TO",
    questions: [
      "I ______ study tomorrow.|will",
      "She ______ buy a new phone (plan).|is going to",
      "We ______ travel next year.|will",
      "They ______ have a party tonight (plan).|are going to",
      "I think he ______ pass the exam.|will"
    ]
  },
  {
    partTitle: "Part 6 – There is / There are",
    instruction: "Fill in the blanks.",
    questions: [
      "There ______ a book on the table.|is",
      "There ______ many students in the class.|are",
      "There ______ a hospital near my house.|is",
      "There ______ two cars in the garage.|are",
      "There ______ some water in the bottle.|is"
    ]
  },
  {
    partTitle: "Part 7 – Some / Any / Much / Many",
    instruction: "Choose the correct word.",
    questions: [
      "I have ______ friends. (some / any)|some",
      "Do you have ______ questions? (some / any)|any",
      "There are ______ students in the room. (much / many)|many",
      "I don’t have ______ money. (some / any)|any",
      "We don’t have ______ time. (much / many)|much"
    ]
  },
  {
    partTitle: "Part 8 – Comparatives / Superlatives",
    instruction: "Complete the sentences.",
    questions: [
      "This book is ______ (cheap) than that book.|cheaper",
      "My house is ______ (big) than yours.|bigger",
      "She is the ______ (smart) student in the class.|smartest",
      "This is the ______ (small) room.|smallest",
      "This car is ______ (expensive) than that car.|more expensive"
    ]
  },
  {
    partTitle: "Part 9 – Can / Should",
    instruction: "Fill in the blanks.",
    questions: [
      "I ______ swim.|can",
      "You ______ study more.|should",
      "He ______ drive a car.|can",
      "We ______ exercise every day.|should",
      "She ______ speak English very well.|can"
    ]
  },
  {
    partTitle: "Part 10 – Vocabulary",
    instruction: "Choose the correct word.",
    questions: [
      "A ______ works in a school. (teacher / doctor)|teacher",
      "You work in a ______. (office / beach)|office",
      "Rice, noodles and meat are ______. (food / travel)|food",
      "A hotel is a place for ______. (study / travel)|travel",
      "The internet and smartphone are ______. (technology / environment)|technology"
    ]
  }
];

// --- ARCHETYPES ---
interface Archetype {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const ARCHETYPES: Archetype[] = [
  { id: 'warrior', name: 'Warrior', icon: <Shield className="w-8 h-8" />, description: 'Strong, determined, never gives up', color: 'bg-emerald-500' },
  { id: 'leader', name: 'Leader', icon: <Crown className="w-8 h-8" />, description: 'Leads, controls, guides others', color: 'bg-emerald-500' },
  { id: 'sage', name: 'Sage', icon: <BookOpen className="w-8 h-8" />, description: 'Wise, loves learning, deep understanding', color: 'bg-emerald-500' },
  { id: 'creator', name: 'Creator', icon: <Palette className="w-8 h-8" />, description: 'Creative, rich imagination', color: 'bg-emerald-500' },
  { id: 'explorer', name: 'Explorer', icon: <Compass className="w-8 h-8" />, description: 'Loves exploring, curious, values experiences', color: 'bg-emerald-500' },
  { id: 'lover', name: 'Lover', icon: <Heart className="w-8 h-8" />, description: 'Emotional, connection, values relationships', color: 'bg-emerald-500' },
  { id: 'caregiver', name: 'Caregiver', icon: <HandHelping className="w-8 h-8" />, description: 'Caring, helpful, looks after others', color: 'bg-emerald-500' },
  { id: 'jester', name: 'Jester', icon: <Laugh className="w-8 h-8" />, description: 'Humorous, fun, makes everyone laugh', color: 'bg-emerald-500' },
];

// --- CONSTANTS ---
const BOT_TOKEN = '8260200134:AAFlf6xMu9DAYAKWDJVoLFczYRRzWVqijnY';
const CHAT_ID = '6789535208';

export default function App() {
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NEW STATES
  const [name, setName] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate Total Questions
  const totalQuestions = examData.reduce((acc, part) => acc + part.questions.length, 0);

  // Fullscreen Logic
  const handleStartTest = async () => {
    if (!name.trim() || !selectedArchetype) {
      setError("Please enter your name and select an archetype.");
      return;
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setTestStarted(true);
      setError(null);
      setAnswers({});
      setResult(null);
    } catch (err) {
      console.error("Fullscreen request failed", err);
      setError("Please allow fullscreen to start the test.");
    }
  };

  const resetTest = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Failed to exit fullscreen", err);
      }
    }
    
    setTestStarted(false);
    setAnswers({});
    setResult(null);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted) {
        alert("Fullscreen exited! The test has been reset for security reasons.");
        resetTest();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [testStarted, resetTest]);

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let score = 0;

    examData.forEach((part, pIdx) => {
      part.questions.forEach((qStr, qIdx) => {
        const [, correctAnswer] = qStr.split('|');
        const qId = `p${pIdx}-q${qIdx}`;
        const userAnswer = (answers[qId] || '').trim().toLowerCase();
        
        let normalizedCorrect = correctAnswer.trim().toLowerCase();
        let normalizedUser = userAnswer;
        
        if (normalizedCorrect === "don't" && normalizedUser === "do not") normalizedUser = "don't";
        if (normalizedCorrect === "doesn't" && normalizedUser === "does not") normalizedUser = "doesn't";

        if (normalizedUser === normalizedCorrect) {
          score++;
        }
      });
    });

    const resultData = { score, total: totalQuestions };
    setResult(resultData);

    // Telegram Notification
    try {
      const message = `🎯 IELTS Foundation (50Qs)\n\n👤 Name: ${name}\n🎭 Archetype: ${selectedArchetype?.name}\n📊 Score: ${score}/${totalQuestions}\n📈 Percentage: ${((score / totalQuestions) * 100).toFixed(2)}%\n⏰ Time: ${new Date().toLocaleString()}`;
      
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send report to Telegram');
      }
    } catch (err) {
      console.error("Telegram report failed", err);
    } finally {
      setIsSubmitting(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
        {!testStarted && !result ? (
          // --- WELCOME SCREEN ---
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-5xl mx-auto"
          >
            <div className="w-full bg-zinc-900/50 p-8 rounded-3xl border border-emerald-500/20 shadow-2xl backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="inline-flex w-20 h-20 bg-emerald-500/10 rounded-3xl items-center justify-center mb-6 border border-emerald-500/20">
                  <ClipboardCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  IELTS <span className="text-emerald-500 italic">Foundation</span>
                </h1>
                <p className="text-zinc-400 max-w-md mx-auto text-sm">
                  A 50-question intensive drill covering 10 essential grammar and vocabulary topics.
                </p>
              </div>
              
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="max-w-md mx-auto">
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest text-center">Your Identity</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-lg text-emerald-400 placeholder:text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-4 uppercase tracking-widest text-center">Select Your Archetype</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ARCHETYPES.map((arch) => (
                      <button
                        key={arch.id}
                        onClick={() => setSelectedArchetype(arch)}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-center group ${
                          selectedArchetype?.id === arch.id
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${arch.color} bg-opacity-20 text-emerald-400`}>
                          {arch.icon}
                        </div>
                        <h4 className="font-bold text-sm text-zinc-200 mb-1">{arch.name}</h4>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-400/10 py-3 px-4 rounded-lg max-w-md mx-auto border border-red-400/20"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}

                <div className="max-w-md mx-auto pt-4">
                  <button
                    onClick={handleStartTest}
                    className="w-full group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-5 px-8 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] uppercase tracking-widest"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    {selectedArchetype ? `START AS ${selectedArchetype.name.toUpperCase()}` : 'CHOOSE ARCHETYPE'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : result ? (
          // --- RESULT SCREEN ---
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border-4 border-emerald-500/20 relative">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 rounded-full border-4 border-emerald-500"
                style={{ clipPath: `inset(0 0 0 0)` }}
              />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Test Completed, {name}!</h2>
            <p className="text-zinc-400 mb-8">Your results have been securely recorded.</p>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-12 w-full max-w-sm shadow-2xl">
              <div className="text-6xl font-black text-emerald-500 mb-2">
                {result.score}<span className="text-zinc-700 text-3xl">/{result.total}</span>
              </div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Final Score</div>
            </div>

            <button
              onClick={resetTest}
              className="text-zinc-400 hover:text-white transition-colors text-sm underline underline-offset-4"
            >
              Return to Headquarters
            </button>
          </motion.div>
        ) : (
          // --- TEST SCREEN ---
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-xl py-4 mb-12 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedArchetype?.color} bg-opacity-20 text-emerald-400`}>
                  {selectedArchetype?.icon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-500">{name}</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Fullscreen Active</p>
                </div>
              </div>
              <div className="text-sm font-mono bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 text-emerald-400">
                {Object.keys(answers).length}/{totalQuestions}
              </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-16 pb-32">
              
              {examData.map((part, pIdx) => (
                <section key={pIdx} className="space-y-6">
                  <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h3 className="text-2xl font-black text-zinc-100">{part.partTitle}</h3>
                    <p className="text-zinc-400 text-sm mt-2">{part.instruction}</p>
                  </div>
                  
                  <div className="grid gap-4">
                    {part.questions.map((qStr, qIdx) => {
                      const [prompt, ] = qStr.split('|');
                      const qId = `p${pIdx}-q${qIdx}`;
                      
                      return (
                        <div key={qId} className="flex flex-col md:flex-row md:items-center gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                          <p className="flex-1 text-zinc-300 font-medium">
                            <span className="text-emerald-600 mr-2 font-bold">{qIdx + 1}.</span>
                            {prompt}
                          </p>
                          <input
                            type="text"
                            value={answers[qId] || ''}
                            onChange={(e) => handleInputChange(qId, e.target.value)}
                            placeholder="Type answer..."
                            className="w-full md:w-48 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 transition-all text-sm text-emerald-400"
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* SUBMIT FOOTER */}
              <div className="fixed bottom-0 left-0 right-0 p-6 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 uppercase tracking-widest"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Final Test
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
