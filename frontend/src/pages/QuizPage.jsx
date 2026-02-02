import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNews } from '../context/NewsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuizPage() {
  const { articles } = useNews();
  const { addPoints, isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await axios.get('/api/quiz/daily');
        if (!cancelled) {
          setQuiz(res.data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load today\'s quiz.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (i) => {
    if (!quiz) return;
    if (selected !== null) return;
    setSelected(i);
    const q = quiz.questions[currentIndex];
    if (i === q.correctIndex) {
      const points = 10;
      setScore((s) => s + points);
      // Award points to authenticated users
      if (isAuthenticated) {
        addPoints(points);
      }
    }
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Daily Quiz</h1>
        <p className="text-sm text-muted">Building questions from today&apos;s news…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Daily Quiz</h1>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions.length) {
    return (
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Daily Quiz</h1>
        <p className="text-sm text-muted">No quiz available right now. Try again later.</p>
      </div>
    );
  }

  const q = quiz.questions[currentIndex];

  if (completed) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Daily Quiz</h1>
          <p className="text-sm text-muted">
            Based on today&apos;s real headlines from your briefing.
          </p>
        </header>
        <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-muted">You scored</p>
          <p className="text-4xl font-bold text-accent">{score}</p>
          <p className="text-xs text-muted">out of {quiz.maxScore} points</p>
          <button
            type="button"
            onClick={() => {
              setCompleted(false);
              setCurrentIndex(0);
              setSelected(null);
              setScore(0);
            }}
            className="mt-2 px-4 py-2 rounded-md bg-accent-gradient text-white text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Daily Quiz</h1>
          <p className="text-sm text-muted">
            Every question is generated from your current news briefing.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Score</p>
          <p className="text-lg font-semibold text-accent">{score}</p>
        </div>
      </header>

      <section className="bg-primary-gradient text-white rounded-t-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="uppercase tracking-wide">
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <span>{((score / quiz.maxScore) * 100 || 0).toFixed(0)}%</span>
        </div>
        <p className="font-serif text-lg md:text-xl font-semibold">
          {q.question}
        </p>
      </section>

      <section className="bg-card border border-border border-t-0 rounded-b-xl p-4 md:p-5 space-y-4">
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            let classes =
              'w-full text-left px-3 py-2 rounded-md border text-sm flex items-center justify-between gap-2';
            if (selected !== null) {
              if (isCorrect) {
                classes += ' border-green-500 bg-green-50 text-green-700';
              } else if (isSelected && !isCorrect) {
                classes += ' border-red-500 bg-red-50 text-red-700';
              }
            } else {
              classes += ' border-border hover:border-accent hover:bg-amber-50';
            }
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={classes}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="text-sm text-muted bg-bg rounded-md p-3">
            <strong className="text-foreground">Explanation: </strong>
            {q.explanation}
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs text-muted">Source: </span>
              <a 
                href={articles.find(a => a.id === q.articleId)?.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent hover:underline"
              >
                {q.sourceName} →
              </a>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={selected === null}
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-accent-gradient text-white text-sm font-semibold disabled:opacity-60"
          >
            {currentIndex < quiz.questions.length - 1 ? 'Next question' : 'See results'}
          </button>
        </div>
      </section>
    </div>
  );
}

