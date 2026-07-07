export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface RiskInput {
  keywordScore: number;
  urlScore: number;
  emailScore: number;
  phoneScore: number;
  domainScore: number;
}

export interface RiskOutput {
  riskScore: number;
  riskLevel: RiskLevel;
}

export const calculateRisk = (input: RiskInput): RiskOutput => {
  // Weighted scoring parameters (Sum of weights = 1)
  const weights = {
    keyword: 0.20,
    url: 0.25,
    email: 0.15,
    phone: 0.15,
    domain: 0.25
  };

  const riskScore = Math.round(
    input.keywordScore * weights.keyword +
    input.urlScore * weights.url +
    input.emailScore * weights.email +
    input.phoneScore * weights.phone +
    input.domainScore * weights.domain
  );

  let riskLevel: RiskLevel = 'safe';

  if (riskScore > 89) {
    riskLevel = 'critical';
  } else if (riskScore > 70) {
    riskLevel = 'high';
  } else if (riskScore > 40) {
    riskLevel = 'medium';
  } else if (riskScore > 15) {
    riskLevel = 'low';
  }

  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel,
  };
};
