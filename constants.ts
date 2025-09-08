
// Base cost is 100 Qi, increasing by 20% each level.
export const BODY_REFINEMENT_COST = (level: number): number => {
    return Math.floor(100 * Math.pow(1.2, level - 1));
};
