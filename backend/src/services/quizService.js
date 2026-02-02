function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function getDailyQuiz(articles) {
  const uniqueSources = Array.from(new Set(articles.map((a) => a.sourceName).filter(Boolean)));
  const pool = shuffle(articles).slice(0, Math.min(3, articles.length));

  const questions = pool.map((article, idx) => {
    const correctSource = article.sourceName || 'Unknown';
    const wrongSources = shuffle(
      uniqueSources.filter((s) => s !== correctSource)
    ).slice(0, 3);
    const options = shuffle([correctSource, ...wrongSources]);
    const correctIndex = options.indexOf(correctSource);

    return {
      id: article.id || `q-${idx}`,
      articleId: article.id,
      question: `Which publication is the source of: "${article.title}"?`,
      options,
      correctIndex,
      explanation: `This headline is from ${correctSource}. You can read the full article on their site.`,
      sourceName: correctSource,
      title: article.title
    };
  });

  return {
    questions,
    maxScore: questions.length * 10
  };
}

