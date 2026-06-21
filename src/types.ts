export interface TransportHabits {
  carHomeToWorkWeekly: number; // km
  carFuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  flightsYearly: number; // hours
  publicTransitWeekly: number; // km
}

export interface FoodHabits {
  meatServingsWeekly: number; // servings
  localFoodPercent: number; // 0-100
  lowWasteCooking: boolean;
}

export interface ElectricityUsage {
  kwhMonthly: number;
  greenEnergyProvider: boolean;
  showersDaily: number;
}

export interface ShoppingSpend {
  clothingPurchasedMonthly: number;
  gadgetsYearly: number;
  recycledChoiceFrequency: 'never' | 'sometimes' | 'always';
}

export interface CarbonProfile {
  transport: TransportHabits;
  food: FoodHabits;
  electricity: ElectricityUsage;
  shopping: ShoppingSpend;
}

export interface FootprintResult {
  monthlyFootprint: number; // kg CO2
  yearlyFootprint: number; // kg CO2
  categoryEmissions: {
    transport: number;
    diet: number;
    energy: number;
    consumption: number;
  };
  sustainabilityScore: number; // 0-100
  aiExplanation: string;
  recommendations: Array<{
    title: string;
    description: string;
    carbonSavings: number; // kg CO2/month
    impactLevel: 'High' | 'Medium' | 'Low';
    category: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ScannerResult {
  merchantTitle: string;
  scannedDate: string;
  estimatedEmissionsKg: number;
  score: number;
  analysisSummary: string;
  alternativeEcoOption: string;
  carbonReductionPotentialKg: number;
  detectedItems: Array<{
    label: string;
    value: string;
  }>;
}

export interface SimulationResult {
  co2Ppm: number;
  globalTempAnomaly: number;
  globalAirQuality: string;
  biodiversityLossPercent: number;
  message: string;
  earthVisualState: 'optimistic' | 'business-as-usual' | 'pessimistic';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  points: number;
  unlocked: boolean;
}
