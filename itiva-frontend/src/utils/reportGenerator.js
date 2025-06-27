import { fullQuestionnaireData } from '@/api/mockData'

const categoryKeyMap = {
  ws: 'Website Strength',
  dn: 'Devices & Network',
  cd: 'Compliance Documentation', // Note: This has the typo as requested for the demonstration
  cs: 'Cyber Security Implementations',
}

const categoryNameToKeyMap = Object.fromEntries(
  Object.entries(categoryKeyMap).map(([key, name]) => [name, key]),
)

const questionsByShortKeyMap = fullQuestionnaireData.reduce((acc, q) => {
  const shortKey = categoryNameToKeyMap[q.category]
  if (shortKey) {
    if (!acc[shortKey]) acc[shortKey] = []
    acc[shortKey].push(q)
  }
  return acc
}, {})

export function generateMockReport(targetScores) {
  const allRecommendations = []
  const finalScores = {}

  for (const shortKey in questionsByShortKeyMap) {
    const targetScore = targetScores[shortKey]
    const categoryQuestions = questionsByShortKeyMap[shortKey] || []
    const questionCount = categoryQuestions.length
    if (questionCount === 0) {
      finalScores[shortKey] = targetScore
      continue
    }

    const maxCategoryScore = 100
    let scoreDeficit = maxCategoryScore - targetScore
    let currentCategoryScore = 0
    const answersForCategory = {}

    categoryQuestions.forEach((q) => {
      const perfectOption = q.options.find((opt) => parseFloat(opt.score) === 2)
      answersForCategory[q.id] = perfectOption
    })

    for (const q of categoryQuestions) {
      if (scoreDeficit <= 0) break
      const optionsSorted = [...q.options].sort((a, b) => b.score - a.score)
      const perfectOption = optionsSorted[0]
      const maxPointsPerQuestion = 100 / questionCount
      for (let i = 1; i < optionsSorted.length; i++) {
        const currentOption = optionsSorted[i]
        const pointsLost =
          ((parseFloat(perfectOption.score) - parseFloat(currentOption.score)) / 4) *
          maxPointsPerQuestion
        if (pointsLost <= scoreDeficit) {
          answersForCategory[q.id] = currentOption
          scoreDeficit -= pointsLost
          break
        }
      }
    }

    categoryQuestions.forEach((q) => {
      const selectedOption = answersForCategory[q.id]
      const impactValue = selectedOption ? parseFloat(selectedOption.score) : NaN
      const maxPointsPerQuestion = 100 / questionCount
      if (!isNaN(impactValue)) {
        const normalizedImpact = (impactValue + 2) / 4
        const questionScore = normalizedImpact * maxPointsPerQuestion
        currentCategoryScore += questionScore
        if (impactValue < 2) {
          allRecommendations.push({
            text: selectedOption.recommendation,
            impactScore: Math.round(maxPointsPerQuestion - questionScore),
            category: q.category,
          })
        }
      }
    })
    finalScores[shortKey] = Math.round(currentCategoryScore)
  }

  const overall = Math.round(Object.values(finalScores).reduce((a, b) => a + b, 0) / 4)
  const fullRecommendations = allRecommendations.sort((a, b) => b.impactScore - a.impactScore)

  return {
    ws: finalScores.ws || 0,
    dn: finalScores.dn || 0,
    cd: finalScores.cd || 0,
    cs: finalScores.cs || 0,
    overall,
    recommendations: fullRecommendations,
  }
}
