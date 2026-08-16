/**
 * MOORA DSS — Calculation Engine
 * Pure functions for Multi-Objective Optimization on the basis of Ratio Analysis
 */

export function calculateDenominators(alternatives, criteriaCount) {
  const denominators = [];
  for (let j = 0; j < criteriaCount; j++) {
    let sumOfSquares = 0;
    for (let i = 0; i < alternatives.length; i++) {
      sumOfSquares += Math.pow(alternatives[i].values[j], 2);
    }
    const denom = Math.sqrt(sumOfSquares);
    denominators.push(denom === 0 ? 1 : denom);
  }
  return denominators;
}

export function normalize(alternatives, criteria) {
  const criteriaCount = criteria.length;
  const denominators = calculateDenominators(alternatives, criteriaCount);
  const matrix = [];

  for (let i = 0; i < alternatives.length; i++) {
    const row = [];
    for (let j = 0; j < criteriaCount; j++) {
      row.push(alternatives[i].values[j] / denominators[j]);
    }
    matrix.push(row);
  }

  return { denominators, matrix };
}

export function weighted(normalizedMatrix, weights) {
  const result = [];
  for (let i = 0; i < normalizedMatrix.length; i++) {
    const row = [];
    for (let j = 0; j < normalizedMatrix[i].length; j++) {
      row.push(normalizedMatrix[i][j] * weights[j]);
    }
    result.push(row);
  }
  return result;
}

export function calculateYi(weightedMatrix, criteriaTypes) {
  const results = [];
  for (let i = 0; i < weightedMatrix.length; i++) {
      let benefitSum = 0;
    let costSum = 0;
    for (let j = 0; j < criteriaTypes.length; j++) {
      if (criteriaTypes[j] === 'benefit') {
        benefitSum += weightedMatrix[i][j];
      } else {
        costSum += weightedMatrix[i][j];
      }
    }
    results.push({ benefitSum, costSum, yi: benefitSum - costSum });
  }
  return results;
}

export function rank(alternatives, yiResults) {
  const combined = alternatives.map((alt, i) => ({
    rank: 0,
    id: alt.id,
    name: alt.name,
    yi: yiResults[i].yi,
  }));
  combined.sort((a, b) => b.yi - a.yi);
  combined.forEach((item, idx) => {
    item.rank = idx + 1;
  });
  return combined;
}

export function runFull(alternatives, criteria) {
  if (!alternatives || alternatives.length < 2) return null;

  const weights = criteria.map((c) => c.weight);
  const types = criteria.map((c) => c.type);

  const normResult = normalize(alternatives, criteria);
  const weightedMatrix = weighted(normResult.matrix, weights);
  const yiResults = calculateYi(weightedMatrix, types);
  const ranking = rank(alternatives, yiResults);

  return {
    denominators: normResult.denominators,
    normalized: normResult.matrix,
    weighted: weightedMatrix,
    yi: yiResults,
    ranking,
  };
}
