// Shared test inputs (mirrors docs/acceptance-criteria.md §0).
import type { QuestionSet } from "./question-set";

export const urls = {
  shortLink: "https://maps.app.goo.gl/abc123",
  longPlace:
    "https://www.google.com/maps/place/Blue+Bottle+Coffee/@37.7765,-122.4233,17z/data=!3m1!4b1",
  coordsOnly: "https://www.google.com/maps/@37.7765,-122.4233,17z",
  directions: "https://www.google.com/maps/dir/Home/Work",
  searchList: "https://www.google.com/maps/search/coffee+near+me/@37.77,-122.42,14z",
} as const;

// rating → expected branch (FR-2.4)
export const ratingBranches: ReadonlyArray<[number, "good" | "mixed" | "rough"]> = [
  [5, "good"],
  [4, "good"],
  [3, "mixed"],
  [2, "rough"],
  [1, "rough"],
];

// A well-formed question set — the shape the generation service must emit.
export const validQuestionSet: QuestionSet = {
  businessName: "Blue Bottle Coffee",
  category: "Coffee shop",
  questions: [
    { id: "q1", prompt: "Overall, how was it?", type: "rating" },
    {
      id: "q2",
      prompt: "What did you order?",
      type: "single",
      options: [
        { id: "espresso", label: "Espresso" },
        { id: "latte", label: "Latte" },
        { id: "drip", label: "Drip coffee" },
      ],
    },
    {
      id: "q3",
      prompt: "What stood out most?",
      type: "multi",
      options: [
        { id: "coffee", label: "Coffee" },
        { id: "service", label: "Service" },
        { id: "ambiance", label: "Ambiance" },
        { id: "value", label: "Value" },
      ],
    },
    { id: "q4", prompt: "Anything else worth mentioning?", type: "text", optional: true },
  ],
};

// Answer sets for grounding/sentiment tests (FR-3.2/.3).
export const answerSets = {
  positiveRestaurant: {
    rating: 5,
    answers: {
      ordered: "Carbonara",
      stoodOut: ["Food", "Service"],
      freeText: "The patio was quiet.",
    },
    // Facts the user supplied — nothing outside this set may appear in output.
    suppliedFacts: ["Carbonara", "patio", "quiet", "food", "service"],
  },
  negativeRestaurant: {
    rating: 2,
    answers: {
      wentWrong: ["Slow service", "Cold food"],
      freeText: "",
    },
    suppliedFacts: ["slow", "service", "cold", "food"],
  },
  mixedCafe: {
    rating: 3,
    answers: {
      stoodOut: ["Ambiance"],
      freeText: "Coffee was great but pricey.",
    },
    suppliedFacts: ["ambiance", "coffee", "great", "pricey"],
  },
} as const;

// Facts that must NEVER appear unless the user supplied them (adversarial grounding).
export const forbiddenInventions = [
  "Tiramisu", // dish not ordered
  "Maria", // a server name
  "$24", // a price
  "last Tuesday", // a date
  "live music", // an event
];

// AI-tell phrases the natural-voice check denies (AC-GEN-6).
export const aiTellDenylist = [
  "as an ai",
  "i would say",
  "5/5 stars",
  "in conclusion",
  "overall, i would",
  "highly recommend to anyone looking",
];

export const WRITE_REVIEW_BASE = "https://search.google.com/local/writereview?placeid=";
