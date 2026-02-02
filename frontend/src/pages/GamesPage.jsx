import React, { useMemo, useState } from 'react';
import { useNews } from '../context/NewsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function buildMemoryCards(articles) {
  const base = articles.slice(0, 6).map((a) => ({
    id: a.id,
    label: a.sourceName || 'Unknown'
  }));
  const pairs = [...base, ...base];
  return pairs
    .map((card, idx) => ({
      uid: `${card.id}-${idx}`,
      key: card.id,
      label: card.label,
      flipped: false,
      matched: false
    }))
    .sort(() => Math.random() - 0.5);
}



function NewsMemoryGame({ articles }) {
  const [cards, setCards] = useState(() => buildMemoryCards(articles));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);

  const matches = cards.filter((c) => c.matched).length / 2;

  const reset = () => {
    setCards(buildMemoryCards(articles));
    setFlipped([]);
    setMoves(0);
  };




  const handleFlip = (uid) => {
    if (flipped.length === 2) return;
    setCards((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, flipped: true } : c))
    );
    setFlipped((prev) => [...prev, uid]);
  };

  React.useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = flipped;
      const first = cards.find((c) => c.uid === a);
      const second = cards.find((c) => c.uid === b);
      if (!first || !second) return;
      if (first.key === second.key) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === a || c.uid === b ? { ...c, matched: true } : c
            )
          );
          setFlipped([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === a || c.uid === b ? { ...c, flipped: false } : c
            )
          );
          setFlipped([]);
        }, 700);
      }
    }
  }, [flipped, cards]);

  const done = matches === Math.min(6, articles.length);

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">News Memory</h2>
          <p className="text-xs text-muted">
            Match publisher names based on today&apos;s briefing.
          </p>
          <p className="text-xs text-muted mt-1">
            Sources: {articles.slice(0, 6).map(a => a.sourceName).filter((v, i, arr) => arr.indexOf(v) === i).join(', ')}
          </p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>Moves: {moves}</p>
          <p>Matches: {matches}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {cards.map((card) => {
          const visible = card.flipped || card.matched;
          return (
            <button
              key={card.uid}
              type="button"
              disabled={card.matched}
              onClick={() => handleFlip(card.uid)}
              className={`aspect-square rounded-md text-xs font-semibold flex items-center justify-center transition ${
                card.matched
                  ? 'bg-emerald-100 text-emerald-700'
                  : visible
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-primary-gradient text-white'
              }`}
            >
              {visible ? card.label : '?'}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={reset}
          className="text-xs text-muted hover:text-foreground underline"
        >
          Reset game
        </button>
      </div>
      {done && (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
          Nice! You&apos;ve matched all publishers based on today&apos;s headlines.
        </p>
      )}
    </div>
  );
}

function buildTrueFalsePool(articles) {
  const real = articles.slice(0, 5).map((a) => ({
    statement: a.title,
    isTrue: true
  }));
  const fake = real.map((r, idx) => ({
    statement: r.statement.replace(/[0-9]/g, 'X') + ' (?)',
    isTrue: false,
    id: `fake-${idx}`
  }));
  return [...real, ...fake].sort(() => Math.random() - 0.5);
}

function HeadlineTrueFalseGame({ articles }) {
  const pool = useMemo(() => buildTrueFalsePool(articles), [articles]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const current = pool[index];

  const submit = (value) => {
    if (answer !== null) return;
    setAnswer(value);
    if (value === current.isTrue) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (index < pool.length - 1) {
      setIndex((i) => i + 1);
      setAnswer(null);
    } else {
      setIndex(0);
      setAnswer(null);
      setScore(0);
    }
  };

  const done = index === pool.length - 1 && answer !== null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">Real or Not?</h2>
          <p className="text-xs text-muted">
            Decide if this is a real headline from today&apos;s news feed.
          </p>
          <p className="text-xs text-muted mt-1">
            Headlines from: {articles.slice(0, 5).map(a => a.sourceName).filter((v, i, arr) => arr.indexOf(v) === i).join(', ')}
          </p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>
            Score: {score}/{pool.length}
          </p>
          <p>
            Q {index + 1}/{pool.length}
          </p>
        </div>
      </div>
      <p className="text-sm font-medium">&quot;{current.statement}&quot;</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => submit(true)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-semibold border ${
            answer === true
              ? current.isTrue
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-red-500 bg-red-50 text-red-700'
              : 'border-border hover:border-emerald-500'
          }`}
        >
          True
        </button>
        <button
          type="button"
          onClick={() => submit(false)}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-semibold border ${
            answer === false
              ? !current.isTrue
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-red-500 bg-red-50 text-red-700'
              : 'border-border hover:border-red-500'
          }`}
        >
          False
        </button>
      </div>
      {answer !== null && (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {answer === current.isTrue
              ? 'Correct – this matches today’s feed.'
              : 'Not quite – compare with your daily briefing.'}
          </span>
          <button
            type="button"
            onClick={next}
            className="text-foreground font-semibold underline"
          >
            {done ? 'Restart' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function GamesPage() {
  const { articles } = useNews();
  const { addPoints, isAuthenticated } = useAuth();

  const awardPoints = (points) => {
    if (isAuthenticated) {
      addPoints(points);
    }
  };

  if (!articles.length) {
    return (
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">Fun Games</h1>
        <p className="text-sm text-muted">
          Games are powered by today&apos;s news. Load the briefing first to unlock them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl md:text-3xl font-bold mb-1">Fun Games</h1>
        <p className="text-sm text-muted">
          6 exciting games powered by today's headlines – test your knowledge and have fun!
        </p>
        {isAuthenticated && (
          <p className="text-xs text-accent mt-1">
            🎮 Earn points by playing games and climb the leaderboard!
          </p>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NewsMemoryGame articles={articles} />
        <HeadlineTrueFalseGame articles={articles} />
        <HeadlineScrambleGame articles={articles} />
        <NewsBingoGame articles={articles} />
        <SpeedReaderGame articles={articles} />
        <MarketPredictorGame articles={articles} />
      </div>
    </div>
  );
}

// NEW GAME 1: Headline Scramble
function HeadlineScrambleGame({ articles }) {
  const [currentArticle, setCurrentArticle] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const article = articles[currentArticle];
  const words = article?.title.split(' ') || [];
  const scrambledWords = useMemo(() => 
    words.map(word => word.split('').sort(() => Math.random() - 0.5).join('')),
    [article?.title]
  );

  const checkAnswer = () => {
    const normalizedInput = userInput.toLowerCase().trim();
    const normalizedTitle = article.title.toLowerCase().trim();
    
    if (normalizedInput === normalizedTitle) {
      setScore(s => s + 10);
      if (currentArticle < Math.min(articles.length - 1, 4)) {
        setCurrentArticle(c => c + 1);
        setUserInput('');
        setShowHint(false);
      } else {
        setGameComplete(true);
      }
    }
  };

  const reset = () => {
    setCurrentArticle(0);
    setUserInput('');
    setShowHint(false);
    setScore(0);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-center">
        <h2 className="font-serif text-lg font-semibold">🎉 Headline Scramble Complete!</h2>
        <p className="text-2xl font-bold text-accent">{score} points</p>
        <button onClick={reset} className="px-4 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">Headline Scramble</h2>
          <p className="text-xs text-muted">Unscramble the words to reveal the headline</p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>Score: {score}</p>
          <p>Article {currentArticle + 1}/5</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-mono">
            {scrambledWords.join(' ')}
          </p>
        </div>
        
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type the unscrambled headline..."
          className="w-full px-3 py-2 border border-border rounded-md text-sm"
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
        />
        
        <div className="flex gap-2">
          <button
            onClick={checkAnswer}
            className="px-3 py-1 bg-accent-gradient text-white rounded-md text-xs font-semibold"
          >
            Check Answer
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-1 border border-border rounded-md text-xs font-semibold"
          >
            {showHint ? 'Hide' : 'Show'} Hint
          </button>
        </div>
        
        {showHint && (
          <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-700">
            💡 Source: {article.sourceName} | Length: {article.title.length} characters
          </div>
        )}
      </div>
    </div>
  );
}

// NEW GAME 2: News Bingo
function NewsBingoGame({ articles }) {
  const [bingoCard, setBingoCard] = useState(() => {
    const keywords = ['AI', 'Market', 'Growth', 'Tech', 'Global', 'Trade', 'Finance', 'Business', 'Economy'];
    const shuffled = [...keywords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9).map((word, idx) => ({
      id: idx,
      word,
      found: false,
      articles: articles.filter(a => 
        a.title.toLowerCase().includes(word.toLowerCase()) || 
        a.summary.toLowerCase().includes(word.toLowerCase())
      )
    }));
  });

  const toggleCell = (id) => {
    setBingoCard(prev => prev.map(cell => 
      cell.id === id ? { ...cell, found: !cell.found } : cell
    ));
  };

  const completedLines = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    return lines.filter(line => line.every(idx => bingoCard[idx]?.found)).length;
  };

  const reset = () => {
    setBingoCard(prev => prev.map(cell => ({ ...cell, found: false })));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">News Bingo</h2>
          <p className="text-xs text-muted">Find these keywords in today's headlines</p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>Lines: {completedLines()}</p>
          <p>Found: {bingoCard.filter(c => c.found).length}/9</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {bingoCard.map((cell) => (
          <button
            key={cell.id}
            onClick={() => toggleCell(cell.id)}
            className={`aspect-square rounded-md text-xs font-semibold flex flex-col items-center justify-center transition ${
              cell.found
                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                : cell.articles.length > 0
                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                : 'bg-gray-50 text-gray-400 border border-gray-200'
            }`}
          >
            <span>{cell.word}</span>
            <span className="text-xs">({cell.articles.length})</span>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={reset}
          className="text-xs text-muted hover:text-foreground underline"
        >
          Reset
        </button>
        {completedLines() > 0 && (
          <span className="text-xs text-green-600 font-semibold">
            🎉 {completedLines()} line{completedLines() > 1 ? 's' : ''} complete!
          </span>
        )}
      </div>
    </div>
  );
}

// NEW GAME 3: Speed Reader Challenge
function SpeedReaderGame({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  const currentArticle = articles[currentIndex];
  const question = `What is the main topic of this article from ${currentArticle?.sourceName}?`;

  React.useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(30);
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    // Simple scoring based on answer length and relevance
    const points = Math.min(userAnswer.length > 10 ? 15 : 10, 15);
    setScore(s => s + points);
    setShowResult(true);
    
    setTimeout(() => {
      if (currentIndex < Math.min(articles.length - 1, 4) && timeLeft > 0) {
        setCurrentIndex(i => i + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        setGameActive(false);
      }
    }, 2000);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">Speed Reader</h2>
          <p className="text-xs text-muted">Read fast and answer questions about articles</p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>Time: {timeLeft}s</p>
          <p>Score: {score}</p>
        </div>
      </div>
      
      {!gameActive && timeLeft === 30 ? (
        <div className="text-center py-8">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-accent-gradient text-white rounded-md font-semibold"
          >
            Start Speed Reading Challenge
          </button>
        </div>
      ) : !gameActive ? (
        <div className="text-center py-4">
          <p className="text-lg font-bold text-accent">Final Score: {score}</p>
          <p className="text-sm text-muted mb-3">Articles read: {currentIndex + 1}</p>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">{currentArticle?.title}</h3>
            <p className="text-xs text-muted">{currentArticle?.summary}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">{question}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full px-3 py-2 border border-border rounded-md text-sm"
              onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
              disabled={showResult}
            />
          </div>
          
          {!showResult && (
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim()}
              className="w-full px-3 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold disabled:opacity-50"
            >
              Submit Answer
            </button>
          )}
          
          {showResult && (
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm text-green-700">✓ Answer recorded! +{Math.min(userAnswer.length > 10 ? 15 : 10, 15)} points</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// NEW GAME 4: Market Predictor
function MarketPredictorGame({ articles }) {
  const [predictions, setPredictions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const marketArticles = articles.filter(a => 
    a.domains?.includes('share market') || 
    a.domains?.includes('finance') || 
    a.domains?.includes('economics')
  ).slice(0, 5);

  const makePrediction = (articleId, prediction) => {
    setPredictions(prev => ({ ...prev, [articleId]: prediction }));
  };

  const calculateResults = () => {
    let totalScore = 0;
    marketArticles.forEach(article => {
      const prediction = predictions[article.id];
      if (prediction) {
        // Simple sentiment analysis based on keywords
        const positive = /growth|rise|gain|up|increase|bull|positive|strong/i.test(article.title + ' ' + article.summary);
        const negative = /fall|drop|decline|down|decrease|bear|negative|weak/i.test(article.title + ' ' + article.summary);
        
        let actualTrend = 'neutral';
        if (positive && !negative) actualTrend = 'bullish';
        if (negative && !positive) actualTrend = 'bearish';
        
        if (prediction === actualTrend) {
          totalScore += 20;
        } else if (prediction !== 'neutral' && actualTrend !== 'neutral') {
          totalScore += 5; // partial credit for trying
        }
      }
    });
    setScore(totalScore);
    setShowResults(true);
  };

  const reset = () => {
    setPredictions({});
    setShowResults(false);
    setScore(0);
  };

  if (marketArticles.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <h2 className="font-serif text-lg font-semibold mb-2">Market Predictor</h2>
        <p className="text-sm text-muted">No market-related articles found in today's news.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">Market Predictor</h2>
          <p className="text-xs text-muted">Predict market trends based on news sentiment</p>
        </div>
        <div className="text-right text-xs text-muted">
          <p>Predictions: {Object.keys(predictions).length}/{marketArticles.length}</p>
          {showResults && <p>Score: {score}</p>}
        </div>
      </div>
      
      {!showResults ? (
        <div className="space-y-3">
          {marketArticles.map(article => (
            <div key={article.id} className="border border-border rounded-lg p-3">
              <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
              <p className="text-xs text-muted mb-2">{article.sourceName}</p>
              <div className="flex gap-2">
                {['bullish', 'neutral', 'bearish'].map(trend => (
                  <button
                    key={trend}
                    onClick={() => makePrediction(article.id, trend)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      predictions[article.id] === trend
                        ? trend === 'bullish' ? 'bg-green-100 text-green-700'
                        : trend === 'bearish' ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                        : 'border border-border hover:bg-gray-50'
                    }`}
                  >
                    {trend === 'bullish' ? '📈 Bullish' : trend === 'bearish' ? '📉 Bearish' : '➡️ Neutral'}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <button
            onClick={calculateResults}
            disabled={Object.keys(predictions).length < marketArticles.length}
            className="w-full px-3 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold disabled:opacity-50"
          >
            Calculate Results
          </button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{score} points</p>
            <p className="text-sm text-blue-700">
              {score >= 80 ? '🎉 Market Genius!' : 
               score >= 60 ? '📊 Good Analyst!' : 
               score >= 40 ? '📈 Getting There!' : '🤔 Keep Learning!'}
            </p>
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-accent-gradient text-white rounded-md text-sm font-semibold"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

