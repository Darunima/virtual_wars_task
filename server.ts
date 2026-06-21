import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Helper to safely get the Gemini Client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------------------------
// 1. Carbon Footprint Analyzer API
// ----------------------------------------------------------------------
app.post("/api/gemini/analyze-carbon", async (req, res) => {
  const { transport, food, electricity, water, shopping, travel } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant fallback simulation if API key is not configured yet
    console.log("GEMINI_API_KEY is not configured or placeholder. Providing realistic mock sustainability metrics.");
    
    // Simulate smart calculation
    const calcTransport = (transport?.carHomeToWorkWeekly || 0) * 0.4 * 52 + (transport?.flightsYearly || 0) * 250;
    const calcFood = (food?.meatServingsWeekly || 0) * 8 + 120;
    const calcEnergy = (electricity?.kwhMonthly || 0) * 0.45 * 12 + (water?.showersDaily || 0) * 0.2 * 365;
    const calcSpend = (shopping?.clothingPurchasedMonthly || 0) * 15 + (shopping?.gadgetsYearly || 0) * 80;

    const totalYearlyEmissions = calcTransport + calcFood + calcEnergy + calcSpend;
    const totalMonthlyEmissions = totalYearlyEmissions / 12;
    
    // Score based on average (typical is ~16,000 kg yearly)
    // Low emissions = higher sustainability score
    const sScore = Math.max(10, Math.min(98, Math.round(100 - (totalYearlyEmissions / 300))));

    return res.json({
      monthlyFootprint: Math.round(totalMonthlyEmissions),
      yearlyFootprint: Math.round(totalYearlyEmissions),
      categoryEmissions: {
        transport: Math.round(calcTransport),
        diet: Math.round(calcFood),
        energy: Math.round(calcEnergy),
        consumption: Math.round(calcSpend),
      },
      sustainabilityScore: sScore,
      aiExplanation: "Calculated based on key regional parameters. Note: Incorporate a real developer API key via the secrets panel to activate full multi-faceted AI climate modeling with personalized roadmaps.",
      recommendations: [
        {
          title: "Optimize Commute with EV or Hybrid",
          description: "Transitioning a portion of your car trips to walking, public transit, or a zero-emission hybrid can substantially reduce fuel burn.",
          carbonSavings: Math.round(calcTransport * 0.3 / 12),
          impactLevel: "High",
          category: "transport"
        },
        {
          title: "Adopt a Flexitarian Choice",
          description: "Reducing red meat servings by 50% lowers associated nitrogen and methane footprints from agricultural logistics.",
          carbonSavings: Math.round(calcFood * 0.4 / 12),
          impactLevel: "Medium",
          category: "diet"
        },
        {
          title: "Install Smart LED & Power Strips",
          description: "Eliminating background phantom loads saves baseline kilowatt hours monthly.",
          carbonSavings: Math.round(calcEnergy * 0.15 / 12),
          impactLevel: "Low",
          category: "energy"
        }
      ]
    });
  }

  try {
    const prompt = `Perform a comprehensive sustainability carbon footprint analysis for a user with these profile characteristics:
    - Transport details: ${JSON.stringify(transport)}
    - Eating habits: ${JSON.stringify(food)}
    - Home Energy (Electricity & Water): ${JSON.stringify(electricity)}
    - Buying & Consumer Spend: ${JSON.stringify(shopping)}
    - Travel Context: ${JSON.stringify(travel)}

    Determine:
    1. Monthly CO2 emissions in kg.
    2. Yearly CO2 emissions in kg.
    3. Category breakdown (transport, diet, energy, consumption) in kg CO2/year.
    4. An overall sustainability score (0 to 100, where 100 is carbon-neutral/ideal and 0 is extremely heavy emitter).
    5. A professional Climate Scientist explanation summarizing their impact.
    6. Three powerful, highly personalized recommendations with projected carbon savings in kg CO2/month, categorizing impact levels and category.

    Return the result strictly conforming to the following JSON structure (do not include markdown wrappers, just pure JSON or standard JSON response):
    {
      "monthlyFootprint": number,
      "yearlyFootprint": number,
      "categoryEmissions": {
        "transport": number,
        "diet": number,
        "energy": number,
        "consumption": number
      },
      "sustainabilityScore": number,
      "aiExplanation": "string",
      "recommendations": [
        {
          "title": "string",
          "description": "string",
          "carbonSavings": number,
          "impactLevel": "High" | "Medium" | "Low",
          "category": "transport" | "diet" | "energy" | "consumption"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            monthlyFootprint: { type: Type.NUMBER },
            yearlyFootprint: { type: Type.NUMBER },
            categoryEmissions: {
              type: Type.OBJECT,
              properties: {
                transport: { type: Type.NUMBER },
                diet: { type: Type.NUMBER },
                energy: { type: Type.NUMBER },
                consumption: { type: Type.NUMBER }
              },
              required: ["transport", "diet", "energy", "consumption"]
            },
            sustainabilityScore: { type: Type.NUMBER },
            aiExplanation: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  carbonSavings: { type: Type.NUMBER },
                  impactLevel: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["title", "description", "carbonSavings", "impactLevel", "category"]
              }
            }
          },
          required: [
            "monthlyFootprint",
            "yearlyFootprint",
            "categoryEmissions",
            "sustainabilityScore",
            "aiExplanation",
            "recommendations"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini carbon analysis error:", err?.message || err);
    res.status(500).json({ error: "Failed to generate AI Carbon Footprint metrics." });
  }
});

// ----------------------------------------------------------------------
// 2. AI Green Coach Chat API
// ----------------------------------------------------------------------
app.post("/api/gemini/coach-chat", async (req, res) => {
  const { messages, score } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Failsafe Mock chatbot response
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let content = "Hello! As your VR-1 AI Green Coach, I'm here to support your journey. Your score is currently " + (score || 72) + "/100. Feel free to connect a real Gemini API Key in the settings for active, context-aware coaching answers!";
    
    if (lastMsg.includes("diet") || lastMsg.includes("food") || lastMsg.includes("eat")) {
      content = "To tackle your diet footprint, try eating plant-based primary meals. Moving away from heavy ruminant meats reduces agricultural greenhouse emissions by almost 60%. Each beef meal substituted saves around 4.5kg of CO₂!";
    } else if (lastMsg.includes("car") || lastMsg.includes("plane") || lastMsg.includes("travel") || lastMsg.includes("commute")) {
      content = "Transportation generates almost a third of individual carbon emissions! Commuting via train, public transit, or cycling is immensely helpful. Setting your tires to optimal high pressure can also boost economy by 3%.";
    } else if (lastMsg.includes("electricity") || lastMsg.includes("water") || lastMsg.includes("energy")) {
      content = "Phantom energy consumption is a major hidden drain. Powering off home appliances at night saves nearly 80-120 kWh annually per home. Dialing your boiler down to 50°C also helps significantly.";
    }

    return res.json({
      role: "assistant",
      content
    });
  }

  try {
    const chatHistory = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Add instructions as first system prompt
    const systemInstruction = `You are VR-1 AI Green Coach, a futuristic climate scientist and sustainability expert.
    The user is interactive in a space-age, Apple Vision Pro/NASA inspired carbon tracker platform.
    Your tone must be highly empowering, scientific, smart, encouraging, and actionable. Provide punchy steps.
    Current user sustainability score: ${score || "unknown"}.
    Always encourage incremental progress and don't make the user feel guilty. Give precise figures (e.g. "Switching off unused devices saves 45 kg CO₂ yearly").
    Keep responses beautifully structured and clean. Avoid huge lists unless asked.`;

    // Limit to last 8 messages for token size safety
    const recentHistory = chatHistory.slice(-8);

    const promptText = recentHistory.pop()?.parts[0]?.text || "Hello! Provide a prompt guidance.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [...recentHistory, { role: "user", parts: [{ text: promptText }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      role: "assistant",
      content: response.text || "I'm processing our lifestyle roadmap..."
    });
  } catch (err: any) {
    console.error("Gemini chat coach error:", err?.message || err);
    res.status(500).json({ error: "Failed to fetch green recommendations." });
  }
});

// ----------------------------------------------------------------------
// 3. AI Receipt / Bill Scanner API
// ----------------------------------------------------------------------
app.post("/api/gemini/scan-bill", async (req, res) => {
  const { imageBase64, mimeType, billType } = req.body;

  const ai = getGeminiClient();
  if (!ai || !imageBase64) {
    // Failsafe Mock Scanning
    console.log("Using failsafe scan processing.");
    const titles = {
      electric: "Smart Power Bill Insight",
      grocery: "Organic Food Receipt Audit",
      travel: "Commuter Transit Statement Review"
    };

    const estimates = {
      electric: { emissions: 138, score: 72, savings: "Reduce phantom standby loads", co2Saved: 34 },
      grocery: { emissions: 64, score: 85, savings: "Buy seasonal items locally", co2Saved: 18 },
      travel: { emissions: 198, score: 55, savings: "Car share or use hybrid model", co2Saved: 85 }
    };

    const selectedType = (billType as 'electric'|'grocery'|'travel') || 'electric';
    const entry = estimates[selectedType];

    return res.json({
      merchantTitle: titles[selectedType] || "Automated Bill Audit",
      scannedDate: "June 2026",
      estimatedEmissionsKg: entry.emissions,
      score: entry.score,
      analysisSummary: "This scan was successfully reviewed using local footprint lookups. Note: To activate deep neural visual scanner, please enter a valid developer API key in Settings.",
      alternativeEcoOption: entry.savings,
      carbonReductionPotentialKg: entry.co2Saved,
      detectedItems: [
        { label: "Direct energy burn", value: `${entry.emissions} kg CO₂` },
        { label: "Optimal substitution potential", value: `-${entry.co2Saved} kg` }
      ]
    });
  }

  try {
    const systemPrompt = `Analyze the uploaded receipt/utility bill image. Determine:
    1. The main merchant name or title.
    2. Approximate emissions in kg CO2 associated with this purchase/usage.
    3. An overall eco score (0 to 100).
    4. A concise visual environmental audit.
    5. A specific, actionable carbon alternative or option to save money.
    6. Carbon reduction potential in kg CO2.
    7. Maximum 3 key line items extracted.

    Return the final structured report as JSON:
    {
      "merchantTitle": "string",
      "scannedDate": "string",
      "estimatedEmissionsKg": number,
      "score": number,
      "analysisSummary": "string",
      "alternativeEcoOption": "string",
      "carbonReductionPotentialKg": number,
      "detectedItems": [
        { "label": "string", "value": "string" }
      ]
    }`;

    const promptPart = { text: systemPrompt };
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, promptPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantTitle: { type: Type.STRING },
            scannedDate: { type: Type.STRING },
            estimatedEmissionsKg: { type: Type.NUMBER },
            score: { type: Type.NUMBER },
            analysisSummary: { type: Type.STRING },
            alternativeEcoOption: { type: Type.STRING },
            carbonReductionPotentialKg: { type: Type.NUMBER },
            detectedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["label", "value"]
              }
            }
          },
          required: [
            "merchantTitle",
            "scannedDate",
            "estimatedEmissionsKg",
            "score",
            "analysisSummary",
            "alternativeEcoOption",
            "carbonReductionPotentialKg",
            "detectedItems"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini visual scan error:", err?.message || err);
    res.status(500).json({ error: "Failed to audit visual bill." });
  }
});

// ----------------------------------------------------------------------
// 4. Future Prediction & Carbon Simulator API
// ----------------------------------------------------------------------
app.post("/api/gemini/future-prediction", async (req, res) => {
  const { year, scenario, carbonActions } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Realistic simulations based on science
    // scenario: 'optimistic' | 'business-as-usual' | 'pessimistic'
    let globalTempAnomaly = 1.3;
    let co2Ppm = 422;
    let globalAirQuality = "Fair";
    let message = "";
    let biodiversityLossPercent = 12;

    const yrsDiff = year - 2025;

    if (scenario === 'optimistic') {
      // Rapid adoption
      globalTempAnomaly = Math.min(1.8, 1.2 + (yrsDiff * 0.008));
      co2Ppm = Math.round(420 + (yrsDiff * 0.5));
      globalAirQuality = "Outstanding";
      biodiversityLossPercent = Math.max(5, Math.round(10 - yrsDiff * 0.1));
      message = "Global carbon neutral targets reached! Forests are flourishing, clean transport powers 92% of commuting, and air quality index is back to historic safety thresholds.";
    } else if (scenario === 'business-as-usual') {
      globalTempAnomaly = 1.2 + (yrsDiff * 0.035);
      co2Ppm = Math.round(420 + (yrsDiff * 2.2));
      globalAirQuality = "Moderate";
      biodiversityLossPercent = Math.round(10 + yrsDiff * 0.3);
      message = "Emissions hover at stable but high volumes. Warming triggers volatile local microclimates. Coastal cities require flood barriers, but transition continues.";
    } else { // pessimistic
      globalTempAnomaly = 1.2 + (yrsDiff * 0.06);
      co2Ppm = Math.round(420 + (yrsDiff * 4.5));
      globalAirQuality = "Severe Threat";
      biodiversityLossPercent = Math.round(10 + yrsDiff * 0.8);
      message = "Runaway feedback loops trigger climate distress. Severe regional smog reduces respiratory health, wild forest cover decays by 40%, and acidification affects reefs recursively.";
    }

    return res.json({
      co2Ppm,
      globalTempAnomaly: parseFloat(globalTempAnomaly.toFixed(2)),
      globalAirQuality,
      biodiversityLossPercent,
      message,
      earthVisualState: scenario // optimistic, business-as-usual, pessimistic
    });
  }

  try {
    const prompt = `Simulate global environmental conditions in the year ${year} under a ${scenario} lifestyle policy stance.
    User's active lifestyle choices in simulator: ${JSON.stringify(carbonActions)}.

    Determine:
    1. Atmospheric CO2 levels (PPM).
    2. Global Temperature Anomaly compared to pre-industrial (degrees Celsius).
    3. Global Air Quality scale (e.g. Outstanding, Moderate, Severe Threat).
    4. Biodiversity ecosystem loss indicator (percentage 0 to 100).
    5. A dramatic but highly scientific 3-sentence visual snapshot message describing how the Earth looks.
    6. Calculated state label: "optimistic" | "business-as-usual" | "pessimistic"

    Return as JSON response:
    {
      "co2Ppm": number,
      "globalTempAnomaly": number,
      "globalAirQuality": "string",
      "biodiversityLossPercent": number,
      "message": "string",
      "earthVisualState": "string"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            co2Ppm: { type: Type.NUMBER },
            globalTempAnomaly: { type: Type.NUMBER },
            globalAirQuality: { type: Type.STRING },
            biodiversityLossPercent: { type: Type.NUMBER },
            message: { type: Type.STRING },
            earthVisualState: { type: Type.STRING }
          },
          required: ["co2Ppm", "globalTempAnomaly", "globalAirQuality", "biodiversityLossPercent", "message", "earthVisualState"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Gemini simulator API error:", err);
    res.status(500).json({ error: "Failed to generate future impact prediction." });
  }
});


// ----------------------------------------------------------------------
// Vite Middleware for Dev or Build Asset Serving
// ----------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Host 0.0.0.0 is mandatory for Cloud Run deployment!
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VR-1 AI] Server operational at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server boot failure:", err);
});
