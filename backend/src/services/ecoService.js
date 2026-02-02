// Simple eco model for the "Go Green" section.
// Assumptions (see README for sources):
// - Each avoided printed newspaper saves ~200 g CO2e on average across its lifecycle.
// - We approximate "papersSaved" as a rolling cumulative count for demo purposes.

const BASE_PAPERS_SAVED = Number(process.env.ECO_PAPERS_BASE || 12847);
const CO2_PER_PAPER_GRAMS = Number(process.env.ECO_CO2_PER_PAPER || 200);

export function getEcoMetrics() {
  const papersSaved = BASE_PAPERS_SAVED;
  const co2SavedGrams = Math.round(papersSaved * CO2_PER_PAPER_GRAMS);

  return {
    papersSaved,
    co2SavedGrams,
    co2SavedKg: co2SavedGrams / 1000,
    co2SavedFormatted: `${(co2SavedGrams / 1000).toFixed(1)} kg`,
    assumptions: {
      co2PerPaperGrams: CO2_PER_PAPER_GRAMS
    },
    sources: [
      {
        label: 'Holmen Paper – Magazine climate impact',
        url: 'https://www.holmen.com/en/paper/sustainability/sustainability-stories/magazine-climate-impact/'
      },
      {
        label: 'Carbon footprint and environmental impacts of print products (LEADER project)',
        url: 'https://cris.vtt.fi/en/publications/carbon-footprint-and-environmental-impacts-of-print-products-from'
      },
      {
        label: 'Comparative life cycle assessments: paper and digital media',
        url: 'https://www.sciencedirect.com/science/article/abs/pii/S0195925513000942'
      }
    ]
  };
}

