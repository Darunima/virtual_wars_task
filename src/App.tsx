import React, { useState, useEffect, useRef } from "react";
import { 
  Globe2, 
  Map, 
  TrendingDown, 
  Leaf, 
  Gauge, 
  Compass, 
  User, 
  Send, 
  Upload, 
  Flame, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Eye, 
  Activity, 
  AlertTriangle,
  Lightbulb,
  Droplet,
  ShoppingBag,
  Car,
  Award,
  Users,
  Search,
  Sparkles,
  RefreshCw,
  Info,
  Calendar,
  CloudLightning
} from "lucide-react";

import HolographicGlobe from "./components/HolographicGlobe";
import { 
  CarbonProfile, 
  FootprintResult, 
  ChatMessage, 
  ScannerResult, 
  SimulationResult, 
  AchievementBadge 
} from "./types";

// Static Initial Badges
const INTIAL_BADGES: AchievementBadge[] = [
  { id: "1", title: "First Step", description: "Completed initial digital carbon footprint audit", icon: "🌱", requirement: "Complete habit analyzer", points: 100, unlocked: false },
  { id: "2", title: "Tree Guardian", description: "Saved equivalent of 5 realistic mature trees through smart habits", icon: "🌳", requirement: "Reach score > 75", points: 250, unlocked: false },
  { id: "3", title: "Eco Architect", description: "Switched home utilities to 100% renewable sources", icon: "⚡", requirement: "Toggle Green Energy context", points: 300, unlocked: false },
  { id: "4", title: "Carbon Neutral Hero", description: "Achieved ideal score rating of 90+", icon: "🏆", requirement: "Reach score > 90", points: 500, unlocked: false },
  { id: "5", title: "Visual Scan Audited", description: "Uploaded an electricity bill or purchase receipt for AI scanning", icon: "♻️", requirement: "Execute AI file audit", points: 200, unlocked: false },
];

export default function App() {
  // Global View/Simulation Phase
  const [globeStage, setGlobeStage] = useState<"healthy" | "polluted" | "optimized">("healthy");
  const [activeTab, setActiveTab ] = useState<"analytics" | "coach" | "timemachine" | "community">("analytics");
  
  // App Stats Clock
  const [liveUTC, setLiveUTC] = useState<string>("2026-06-21 08:30:00 UTC");
  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setLiveUTC(now.toISOString().replace('T', ' ').slice(0, 19) + " UTC");
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // 1. Carbon Profile Inputs State
  const [profile, setProfile] = useState<CarbonProfile>({
    transport: {
      carHomeToWorkWeekly: 130,
      carFuelType: "petrol",
      flightsYearly: 4,
      publicTransitWeekly: 50,
    },
    food: {
      meatServingsWeekly: 6,
      localFoodPercent: 40,
      lowWasteCooking: true,
    },
    electricity: {
      kwhMonthly: 310,
      greenEnergyProvider: false,
      showersDaily: 2,
    },
    shopping: {
      clothingPurchasedMonthly: 2,
      gadgetsYearly: 1,
      recycledChoiceFrequency: "sometimes",
    },
  });

  // Carbon Audit Results State (Initial baseline estimates)
  const [calculating, setCalculating] = useState(false);
  const [auditResult, setAuditResult] = useState<FootprintResult>({
    monthlyFootprint: 610,
    yearlyFootprint: 7320,
    categoryEmissions: {
      transport: 3120,
      diet: 1840,
      energy: 1560,
      consumption: 800
    },
    sustainabilityScore: 68,
    aiExplanation: "Generating high-performance global climate metrics. Your current individual carbon estimate ranks close to the Western European baseline average.",
    recommendations: [
      {
        title: "Optimize Commuter Efficiency",
        description: "Increase train or hybrid travel to shave up to 140kg CO₂ weekly.",
        carbonSavings: 140,
        impactLevel: "High",
        category: "transport"
      },
      {
        title: "Activate Green Energy Supply Grid",
        description: "Enabling local green offsets can neutralize energy carbon entirely.",
        carbonSavings: 130,
        impactLevel: "High",
        category: "energy"
      },
      {
        title: "Decrease Ruminant Beef Meals",
        description: "Swapping 3 meat-based dinners for local vegetarian alternatives lowers livestock support strain.",
        carbonSavings: 45,
        impactLevel: "Medium",
        category: "diet"
      }
    ]
  });

  // 2. AI Green Coach Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: "Welcome to VR-1 Earth Hub. I am your AI Climate Coach. Fill out your lifestyle profile above, then ask me anything about maximizing carbon reductions, or upload an invoice below!",
      timestamp: "08:25"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [coachStatus, setCoachStatus] = useState<"idle" | "typing">("idle");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // 3. Receipts & Bills Scanner State
  const [scanType, setScanType] = useState<"electric" | "grocery" | "travel">("electric");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannerResult | null>(null);
  const [scannedFiles, setScannedFiles] = useState<string[]>([]);

  // Presets of simulated files for convenience
  const SCAN_PRESETS = {
    electric: {
      name: "electric_utility_june.png",
      img: "⚡ Utility Statement: 420 kWh Peak Usage",
    },
    grocery: {
      name: "supermarket_receipt_eco.jpg",
      img: "🛒 Market Cart: Heavy beef & imported produce cuts",
    },
    travel: {
      name: "passenger_flight_ticket.png",
      img: "✈️ Continental Air: NYC to London Flight Itinerary",
    }
  };

  // 4. Climate Time Machine & Simulator State
  const [simulationYear, setSimulationYear] = useState<number>(2035);
  const [simScenario, setSimScenario] = useState<"optimistic" | "business-as-usual" | "pessimistic">("optimistic");
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult>({
    co2Ppm: 432,
    globalTempAnomaly: 1.4,
    globalAirQuality: "Balanced",
    biodiversityLossPercent: 12,
    message: "A smart environmental approach balances global resource consumption, slowing the decay rate of glaciers.",
    earthVisualState: "optimistic",
  });

  // 5. Game Badges State
  const [badges, setBadges] = useState<AchievementBadge[]>(INTIAL_BADGES);
  const [greenPoints, setGreenPoints] = useState(100);
  const [achievementSparkle, setAchievementSparkle] = useState<string | null>(null);

  // Trigger calculator logic
  const handleCalculateEmissions = async () => {
    setCalculating(true);
    try {
      const response = await fetch("/api/gemini/analyze-carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        const data = await response.json();
        setAuditResult(data);
        
        // Dynamically adjust globe stage based on sustainability score
        if (data.sustainabilityScore >= 80) {
          setGlobeStage("optimized");
        } else if (data.sustainabilityScore < 50) {
          setGlobeStage("polluted");
        } else {
          setGlobeStage("healthy");
        }

        // Unlock badges
        unlockBadge("1");
        if (data.sustainabilityScore > 75) unlockBadge("2");
        if (profile.electricity.greenEnergyProvider) unlockBadge("3");
        if (data.sustainabilityScore > 90) unlockBadge("4");

        // Award points
        setGreenPoints(prev => prev + 150);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  // Run initial calculator update when app boots
  useEffect(() => {
    handleCalculateEmissions();
  }, []);

  const unlockBadge = (id: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === id && !b.unlocked) {
        setAchievementSparkle(`Unlocked Achievement: ${b.title}! +${b.points} Eco Points`);
        setTimeout(() => setAchievementSparkle(null), 4500);
        return { ...b, unlocked: true };
      }
      return b;
    }));
  };

  // AI chat send
  const handleSendChat = async (textToSend?: string) => {
    const finalMsg = textToSend || chatInput;
    if (!finalMsg.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: finalMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setCoachStatus("typing");

    try {
      const response = await fetch("/api/gemini/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatMessages.concat(userMsg),
          score: auditResult.sustainabilityScore
        })
      });
      if (response.ok) {
        const reply = await response.json();
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: reply.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCoachStatus("idle");
    }
  };

  // Interactive slider/Time machine calculator trigger
  const runTimeMachineSimulation = async () => {
    setSimulating(true);
    try {
      const response = await fetch("/api/gemini/future-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: simulationYear,
          scenario: simScenario,
          carbonActions: {
            score: auditResult.sustainabilityScore,
            greenPower: profile.electricity.greenEnergyProvider,
            meatCount: profile.food.meatServingsWeekly
          }
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSimResult(data);
        // Change globe backdrop
        if (data.earthVisualState === "optimistic") {
          setGlobeStage("optimized");
        } else if (data.earthVisualState === "pessimistic") {
          setGlobeStage("polluted");
        } else {
          setGlobeStage("healthy");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // Auto trigger time machine when year or scenario changes
  useEffect(() => {
    runTimeMachineSimulation();
  }, [simulationYear, simScenario]);

  // Handle bill scanner simulate
  const handleBillScanFile = async () => {
    setScanning(true);
    setScanResult(null);

    // Provide pre-computed image or simulate processing raw metadata
    try {
      const response = await fetch("/api/gemini/scan-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Pass simulated visual mock data representing image upload
          imageBase64: "SimulatedBase64RawDataStringGoesHere...",
          mimeType: "image/png",
          billType: scanType
        })
      });
      if (response.ok) {
        const data = await response.json();
        setScanResult(data);
        unlockBadge("5");
        setGreenPoints(prev => prev + 100);
        // Prepend file to history list
        setScannedFiles(prev => [SCAN_PRESETS[scanType].name, ...prev]);

        // Integrate scanned data feedback as suggestion in chatbot
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "assistant",
          content: `📊 AI Receipt Scan Audit complete! Analyzed "${data.merchantTitle}" with estimated ${data.estimatedEmissionsKg}kg emissions. Recommendation: ${data.alternativeEcoOption}. Would you like help planning this?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  // Butterfly Effect presets
  const triggerButterflyEffect = (action: string, reduction: number) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "user",
      content: `Butterfly effect of: ${action}`,
      timestamp: "Now"
    }, {
      id: Date.now().toString() + "-sys",
      role: "assistant",
      content: `✨ Butterfly Ecology Sequence triggered! By choosing "${action}", you directly prevent ${reduction}kg CO₂ of deep atmosphere combustion. This preserves approximately ${(reduction * 0.05).toFixed(1)} square meters of polar glacial ice volume this year alone!`,
      timestamp: "Now"
    }]);
    setActiveTab("coach");
  };

  // Compute category percentages
  const emissions = auditResult.categoryEmissions;
  const totalCategory = (emissions.transport + emissions.diet + emissions.energy + emissions.consumption) || 1;
  const transportPct = Math.round((emissions.transport / totalCategory) * 100);
  const dietPct = Math.round((emissions.diet / totalCategory) * 100);
  const energyPct = Math.round((emissions.energy / totalCategory) * 100);
  const consumptionPct = Math.round((emissions.consumption / totalCategory) * 100);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F4F6] font-sans flex flex-col relative overflow-x-hidden aurora-bg" id="app_root">
      
      {/* Dynamic Slide In Toast for unlocked achievements */}
      {achievementSparkle && (
        <div className="fixed top-20 right-6 z-50 bg-zinc-950 border-2 border-[#00FF88] text-white rounded-2xl p-4 shadow-[0_0_30px_rgba(0,255,136,0.3)] flex items-center gap-3 animate-bounce" id="toast_achievement">
          <div className="w-10 h-10 bg-emerald-950/80 rounded-full flex items-center justify-center text-xl">🎉</div>
          <div>
            <div className="text-xs text-[#00FF88] font-bold font-mono tracking-widest uppercase">ECOLOGICAL MILESTONE</div>
            <div className="text-sm font-bold">{achievementSparkle}</div>
          </div>
        </div>
      )}

      {/* 🚀 TOP HEADLESS HUD DEADBORT */}
      <header className="inset-x-0 top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5 relative" id="main_header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo brand & Science rating */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Globe2 className="w-5 h-5 text-black" />
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 opacity-30 blur-sm pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">VR-1 AI</span>
                <span className="text-[10px] bg-[#00FF88]/20 text-[#00FF88] px-1.5 py-0.5 rounded font-mono font-semibold">V2.4</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono tracking-wider">CARBON INTELLIGENCE PLATFORM</div>
            </div>
          </div>

          {/* Center telemetry indicators (NASA Design Concept) */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-mono border-x border-white/5 px-6">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-400">SESSION: <span className="text-zinc-200">{liveUTC}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400 font-bold text-emerald-400 uppercase">TELEMETRY: EST-03 ONLINE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
              <span className="text-zinc-400">SYS_CO₂: <span className="text-[#00D4FF]">419.2 PPM</span></span>
            </div>
          </div>

          {/* Right Actionable Badge Panel */}
          <div className="flex items-center gap-4">
            <div className="bg-zinc-900/80 border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-300">
                ECO COINS: <span className="text-amber-400">{greenPoints}</span>
              </span>
            </div>

            <div className="text-xs bg-zinc-950 px-3 py-1 rounded-md border border-emerald-500/20 text-[#00FF88] font-mono">
              SCORE: {auditResult.sustainabilityScore}/100
            </div>
          </div>

        </div>
      </header>

      {/* 🚀 TWO-COLUMN HERO AND GLOBAL SPHERE INTRO */}
      <section className="relative px-4 md:px-8 py-8 md:py-16 max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center" id="hero_section">
        
        {/* Background glow orb */}
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Cinematic Pitch (Apple Vision Pro & Tesla style) */}
          <div className="lg:col-span-7 flex flex-col gap-6" id="hero_pitch">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1.5 px-3.5 self-start">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] md:text-xs tracking-widest text-[#00FF88] font-mono uppercase">
                "Every Action Leaves a Mark on Earth"
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
              Your Lifestyle Shapes <br />
              The <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent underline decoration-cyan-500/30">Future of Earth</span>
            </h1>

            {/* Description */}
            <p className="text-base text-zinc-400 leading-relaxed max-w-xl">
              VR-1 AI is a next-generation neural climate platform that maps transportation energy, food choices, 
              and electricity bills to real-world carbon parameters. Use specialized Gemini simulation models, 
              eco-twin analytics, and real-time scanning tools to reduce baseline atmospheric decay.
            </p>

            {/* Quick dashboard shortcuts info */}
            <div className="grid grid-cols-3 gap-3 max-w-lg font-mono text-[11px] bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
              <div>
                <div className="text-zinc-500">YEARLY BASKET</div>
                <div className="text-xl font-bold font-display text-white">{auditResult.yearlyFootprint.toLocaleString()} <span className="text-[10px] text-zinc-400 font-mono">KG</span></div>
              </div>
              <div className="border-l border-white/5 pl-4">
                <div className="text-zinc-500">SAVINGS ROUTE</div>
                <div className="text-xl font-bold font-display text-emerald-400">-{auditResult.recommendations.reduce((acc, r) => acc + r.carbonSavings, 0)} <span className="text-[10px] text-emerald-300 font-mono">KG</span></div>
              </div>
              <div className="border-l border-white/5 pl-4">
                <div className="text-zinc-500">ECO RANKING</div>
                <div className="text-xl font-bold font-display text-cyan-400">Top 12%</div>
              </div>
            </div>

            {/* Buttons & Scroll CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="#control_center" 
                className="bg-gradient-to-r from-[#00FF88] to-[#00D4FF] text-black px-6 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transform transition hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,255,136,0.25)]"
                onClick={() => setActiveTab("analytics")}
              >
                <span>Start My Carbon Journey</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <button 
                onClick={() => {
                  setGlobeStage(globeStage === "healthy" ? "polluted" : globeStage === "polluted" ? "optimized" : "healthy");
                }}
                className="bg-zinc-900 border border-white/10 hover:border-[#00FF88]/30 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <span>Cycle Earth Phase</span>
                <Globe2 className="w-4 h-4 text-[#00FF88]" />
              </button>
            </div>
          </div>

          {/* Right Holographic Globe Screen Container */}
          <div className="lg:col-span-5 flex justify-center" id="hero_globe_widget">
            <HolographicGlobe stage={globeStage} />
          </div>

        </div>
      </section>

      {/* 🚀 INTERACTIVE NAV TAB CONTROLS (Tesla/Arc layout look and feel) */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto w-full mb-8" id="control_center">
        <div className="bg-zinc-950/80 backdrop-blur-md border border-white/5 p-2 rounded-2xl flex flex-wrap gap-2 justify-between items-center whitespace-nowrap overflow-x-auto">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition font-mono ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400"
                  : "hover:bg-white/5 border border-transparent text-zinc-400 hover:text-white"
              }`}
              id="tab_analytics"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Carbon Habits Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab("coach")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition font-mono ${
                activeTab === "coach"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400"
                  : "hover:bg-white/5 border border-transparent text-zinc-400 hover:text-white"
              }`}
              id="tab_coach"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Green AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab("timemachine")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition font-mono ${
                activeTab === "timemachine"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400"
                  : "hover:bg-white/5 border border-transparent text-zinc-400 hover:text-white"
              }`}
              id="tab_timemachine"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Climate Time Machine</span>
            </button>

            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition font-mono ${
                activeTab === "community"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400"
                  : "hover:bg-white/5 border border-transparent text-zinc-400 hover:text-white"
              }`}
              id="tab_community"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Global Rankings</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-zinc-500 pr-2">
            <span>MODEL INTENT: ACTIVE PROMPTING</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

        </div>
      </section>

      {/* 🚀 TAB WORKSPACES CONTAINER */}
      <main className="px-4 md:px-8 max-w-7xl mx-auto w-full pb-20 flex-grow" id="dashboard_workspace">
        
        {/* ======================================================================
          1. CARBON HABITS ANALYZER & REAL-TIME DIGITAL TWIN TAB
          ====================================================================== */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="view_analytics">
            
            {/* Left side: Form Habits Editor */}
            <div className="lg:col-span-7 flex flex-col gap-6 bg-[#09090b]/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88] tracking-widest uppercase mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>NEURAL FOOTPRINT LOGGER v2</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-white">Configure Your Lifestyle Variables</h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Adjust metrics dynamically to evaluate monthly output against regional baselines.
                </p>
              </div>

              {/* Grid split of categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 🚗 Transport Habits block */}
                <div className="space-y-4 bg-zinc-950/45 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-white font-medium border-b border-white/5 pb-2">
                    <Car className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs tracking-wider uppercase font-mono">1. Transportation</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Weekly Driving Dist:</span>
                      <span className="text-emerald-400 font-bold">{profile.transport.carHomeToWorkWeekly} km</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="800" 
                      value={profile.transport.carHomeToWorkWeekly}
                      onChange={(e) => setProfile({
                        ...profile,
                        transport: { ...profile.transport, carHomeToWorkWeekly: Number(e.target.value) }
                      })}
                      className="w-full accent-[#00FF88]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1">Fuel Type / Vehicle Engine</label>
                    <select
                      value={profile.transport.carFuelType}
                      onChange={(e) => setProfile({
                        ...profile,
                        transport: { ...profile.transport, carFuelType: e.target.value as any }
                      })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#00FF88]"
                    >
                      <option value="petrol">Internal Combustion (Petrol)</option>
                      <option value="diesel">Heavy Compression (Diesel)</option>
                      <option value="hybrid">Efficient Synergy (Hybrid)</option>
                      <option value="electric">Zero Emission (Electric EV)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Annual Flights Count:</span>
                      <span className="text-cyan-400 font-bold">{profile.transport.flightsYearly} flights</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={profile.transport.flightsYearly}
                      onChange={(e) => setProfile({
                        ...profile,
                        transport: { ...profile.transport, flightsYearly: Number(e.target.value) }
                      })}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>

                {/* 🍔 Diet & Agriculture Habits block */}
                <div className="space-y-4 bg-zinc-950/45 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-white font-medium border-b border-white/5 pb-2">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs tracking-wider uppercase font-mono">2. Diet & Agriculture</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Ruminant Meat Servings:</span>
                      <span className="text-red-400 font-bold">{profile.food.meatServingsWeekly} /wk</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="21" 
                      value={profile.food.meatServingsWeekly}
                      onChange={(e) => setProfile({
                        ...profile,
                        food: { ...profile.food, meatServingsWeekly: Number(e.target.value) }
                      })}
                      className="w-full accent-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Local & Organic Food:</span>
                      <span className="text-[#00FF88] font-bold">{profile.food.localFoodPercent}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={profile.food.localFoodPercent}
                      onChange={(e) => setProfile({
                        ...profile,
                        food: { ...profile.food, localFoodPercent: Number(e.target.value) }
                      })}
                      className="w-full accent-[#00FF88]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-zinc-400 font-mono">Low-Waste Cooking Habits</span>
                    <button
                      type="button"
                      onClick={() => setProfile({
                        ...profile,
                        food: { ...profile.food, lowWasteCooking: !profile.food.lowWasteCooking }
                      })}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                        profile.food.lowWasteCooking ? "bg-emerald-500" : "bg-zinc-800"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.food.lowWasteCooking ? "translate-x-5" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                </div>

                {/* ⚡ Electricity & Water Usage block */}
                <div className="space-y-4 bg-zinc-950/45 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-white font-medium border-b border-white/5 pb-2">
                    <CloudLightning className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs tracking-wider uppercase font-mono">3. Home Grid & Water</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Monthly Electric Consumption:</span>
                      <span className="text-emerald-400 font-bold">{profile.electricity.kwhMonthly} kWh</span>
                    </label>
                    <input 
                      type="range" 
                      min="50" 
                      max="1500" 
                      value={profile.electricity.kwhMonthly}
                      onChange={(e) => setProfile({
                        ...profile,
                        electricity: { ...profile.electricity, kwhMonthly: Number(e.target.value) }
                      })}
                      className="w-full accent-[#00FF88]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-mono">Green Energy Grid Provider</span>
                    <button
                      type="button"
                      onClick={() => setProfile({
                        ...profile,
                        electricity: { ...profile.electricity, greenEnergyProvider: !profile.electricity.greenEnergyProvider }
                      })}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                        profile.electricity.greenEnergyProvider ? "bg-emerald-500" : "bg-zinc-800"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.electricity.greenEnergyProvider ? "translate-x-5" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Daily Shower Runs:</span>
                      <span className="text-cyan-400 font-bold">{profile.electricity.showersDaily} index</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={profile.electricity.showersDaily}
                      onChange={(e) => setProfile({
                        ...profile,
                        electricity: { ...profile.electricity, showersDaily: Number(e.target.value) }
                      })}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>

                {/* 🛍️ Consumer Goods & clothing purchase */}
                <div className="space-y-4 bg-zinc-950/45 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-white font-medium border-b border-white/5 pb-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs tracking-wider uppercase font-mono">4. Consumption Goods</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>Clothing Purchases /mo:</span>
                      <span className="text-[#00D4FF] font-bold">{profile.shopping.clothingPurchasedMonthly} items</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="15" 
                      value={profile.shopping.clothingPurchasedMonthly}
                      onChange={(e) => setProfile({
                        ...profile,
                        shopping: { ...profile.shopping, clothingPurchasedMonthly: Number(e.target.value) }
                      })}
                      className="w-full accent-[#00D4FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1 flex justify-between">
                      <span>High-End Tech Goods /yr:</span>
                      <span className="text-emerald-400 font-bold">{profile.shopping.gadgetsYearly} units</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="6" 
                      value={profile.shopping.gadgetsYearly}
                      onChange={(e) => setProfile({
                        ...profile,
                        shopping: { ...profile.shopping, gadgetsYearly: Number(e.target.value) }
                      })}
                      className="w-full accent-[#00FF88]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 font-mono mb-1">Recycled & Used Preference</label>
                    <select
                      value={profile.shopping.recycledChoiceFrequency}
                      onChange={(e) => setProfile({
                        ...profile,
                        shopping: { ...profile.shopping, recycledChoiceFrequency: e.target.value as any }
                      })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#00FF88]"
                    >
                      <option value="never">Never (Always original new)</option>
                      <option value="sometimes">Sometimes (Hybrid mix)</option>
                      <option value="always">Always (Circular sustainable priority)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Submit triggers dynamic audit report */}
              <button
                type="button"
                onClick={handleCalculateEmissions}
                disabled={calculating}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold text-xs tracking-widest uppercase hover:opacity-90 active:scale-[0.99] transition disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
                id="btn_recalculate"
              >
                {calculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Processing Gemini Climate Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Run Multi-Faceted AI Carbon Audit</span>
                  </>
                )}
              </button>

            </div>

            {/* Right side: Modern NASA-style Real-time Dashboard & DIGITAL ECO TWIN */}
            <div className="lg:col-span-5 flex flex-col gap-6" id="dashboard_results_hud">
              
              {/* Digital Twin Card representation */}
              <div className="bg-gradient-to-tr from-zinc-950 to-zinc-900 border border-white/10 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between" id="twin_eco_indicator">
                
                {/* Background matrix mesh layout */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

                {/* Score gauge circle indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#00D4FF] tracking-widest uppercase">DIGITAL EARTH ECO-TWIN</span>
                    <h3 className="font-display font-bold text-lg text-white">Twin State: 
                      <span className={auditResult.sustainabilityScore >= 80 ? "text-[#00FF88]" : auditResult.sustainabilityScore < 50 ? "text-red-400" : "text-amber-400"}>
                        {auditResult.sustainabilityScore >= 80 ? " Lush Rainforest" : auditResult.sustainabilityScore < 50 ? " Severe Acidification" : " Intermediary Forest"}
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10.5px] font-mono text-zinc-500">RESIST_VEC:</span>
                    <div className="text-xs font-mono font-bold text-white">{auditResult.sustainabilityScore * 10} PSI</div>
                  </div>
                </div>

                {/* Aesthetic Eco Twin Canvas rendering based on current score */}
                <div className="w-full h-32 bg-black/60 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center mb-4">
                  {/* Digital Twin interactive rendering lines */}
                  {auditResult.sustainabilityScore >= 80 ? (
                    <div className="text-center space-y-1.5 p-4 animate-pulse">
                      <div className="text-3xl">🌳🌲🌲🐦🌻</div>
                      <div className="text-[10px] font-mono text-[#00FF88]">ECOSYSTEM HEALING ACTIVE [+85%]</div>
                      <div className="text-[9px] text-zinc-500 font-mono">Wildlife index high. Rivers clean & dynamic.</div>
                    </div>
                  ) : auditResult.sustainabilityScore < 50 ? (
                    <div className="text-center space-y-1.5 p-4 animate-bounce">
                      <div className="text-3xl">☣️💨🍂🌫️🌋</div>
                      <div className="text-[10px] font-mono text-red-400">ATMOSPHERIC POLLUTION THREAT TRIGGERED</div>
                      <div className="text-[9px] text-zinc-500 font-mono">Trees decayed. Critical CO₂ absorption ceiling reached.</div>
                    </div>
                  ) : (
                    <div className="text-center space-y-1.5 p-4">
                      <div className="text-3xl">🌿🏡🌳🚜💦</div>
                      <div className="text-[10px] font-mono text-amber-400">TERRESTRIAL STABLE HARMONY [60%]</div>
                      <div className="text-[9px] text-zinc-500 font-mono">Active carbon baseline under gradual normalization.</div>
                    </div>
                  )}

                  {/* Flowing binary grid overlays */}
                  <div className="absolute bottom-2 left-3 text-[8.5px] font-mono text-zinc-500">
                    ECO_MUTATION: {(100 - auditResult.sustainabilityScore).toFixed(1)}% Decay
                  </div>
                </div>

                {/* Emissions meter values representation */}
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-500">TOTAL EST. IMPACT LEVEL:</span>
                      <span className="text-zinc-300 font-bold">{auditResult.yearlyFootprint.toLocaleString()} kg CO₂/yr</span>
                    </div>
                    
                    {/* Visual gradient slider bars split by categories */}
                    <div className="h-2 w-full bg-zinc-900 rounded-full flex overflow-hidden">
                      <div style={{ width: `${transportPct}%` }} className="bg-emerald-400 h-full transition-all" title="Transport" />
                      <div style={{ width: `${dietPct}%` }} className="bg-red-400 h-full transition-all" title="Diet" />
                      <div style={{ width: `${energyPct}%` }} className="bg-cyan-400 h-full transition-all" title="Energy" />
                      <div style={{ width: `${consumptionPct}%` }} className="bg-purple-400 h-full transition-all" title="Consumption" />
                    </div>
                  </div>

                  {/* Metric Legend table */}
                  <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-400">
                    <div className="flex flex-col">
                      <span className="text-emerald-400 font-bold">🚍 Transport</span>
                      <span>{transportPct}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-red-400 font-bold">🥩 Diet</span>
                      <span>{dietPct}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-cyan-400 font-bold">💡 Energy</span>
                      <span>{energyPct}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-purple-400 font-bold">🛍️ Goods</span>
                      <span>{consumptionPct}%</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Climate scientist smart summary response */}
              <div className="bg-[#09090b]/80 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl" />
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-900/30 text-[#00FF88] rounded-xl font-bold font-mono text-sm">
                    AI
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      CLIMATE INTEL SUMMARY
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed italic">
                      "{auditResult.aiExplanation}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Carbon Reduction Steps Section */}
              <div className="space-y-3" id="reduction_roadmap">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  RECOMMENDED DEPOSIT NEUTRALIZATION STEPS
                </span>

                {auditResult.recommendations.map((rec, idx) => (
                  <div 
                    key={idx}
                    className="bg-zinc-950 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4 transition hover:border-[#00FF88]/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-xs text-emerald-400 mt-1">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{rec.title}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{rec.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 font-mono">
                      <div className="text-xs font-bold text-[#00FF88] opacity-90">
                        -{rec.carbonSavings} kg/mo
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        rec.impactLevel === "High" ? "bg-red-950/80 text-red-400" : "bg-yellow-950/80 text-yellow-400"
                      }`}>
                        {rec.impactLevel} Impact
                      </span>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================================
          2. GREEN AI ASSISTANT CHAT & BILL SCANNER v2
          ====================================================================== */}
        {activeTab === "coach" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="view_coach">
            
            {/* Left Box: GPT-powered Sustainability Coach Chat */}
            <div className="lg:col-span-7 bg-[#09090b]/80 border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[600px] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-ping" />
                  <div>
                    <h3 className="font-display font-semibold text-sm text-white">AI Green Coach Terminal</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">GPT MODEL GROUNDING IN CRITICAL CLIMATE BASINS</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChatMessages([
                    { id: "init", role: "assistant", content: "Chat timeline re-indexed. Ask me anything about mitigating carbon emissions!", timestamp: "08:30" }
                  ])}
                  className="text-zinc-500 hover:text-white transition text-[10px] font-mono border border-white/10 px-2.5 py-1 rounded-md"
                >
                  RESET PORT
                </button>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-grow overflow-y-auto space-y-4 pt-16 pb-4 px-2" id="chat_messages_container">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={msg.id || index}
                    className={`flex gap-3 max-w-[85%] ${
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* Role Icon container */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                      msg.role === "user" ? "bg-zinc-800 text-white" : "bg-emerald-950/80 text-[#00FF88] border border-emerald-500/25"
                    }`}>
                      {msg.role === "user" ? "U" : "AI"}
                    </div>

                    <div className={`rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                      msg.role === "user" ? "bg-[#18181b] text-white" : "bg-zinc-950 border border-white/5 text-zinc-300"
                    }`}>
                      <p>{msg.content}</p>
                      <div className="text-right text-[8px] font-mono text-zinc-500">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {coachStatus === "typing" && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-[#00FF88] border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-xs">
                      AI
                    </div>
                    <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 text-xs text-zinc-400 font-mono animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Analyzing sustainable alternatives & models...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Immediate shortcut prompts */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    onClick={() => handleSendChat("How do I reduce meat agricultural emissions?")}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-white/10 hover:border-emerald-500/20 text-zinc-300 px-3 py-1.5 rounded-xl text-[10px] font-mono transition"
                  >
                    🥩 Reducing Diet Carbon?
                  </button>
                  <button 
                    onClick={() => handleSendChat("What's the best way to reduce electricity draft load?")}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-white/10 hover:border-emerald-500/20 text-zinc-300 px-3 py-1.5 rounded-xl text-[10px] font-mono transition"
                  >
                    💡 Energy Draft Load?
                  </button>
                  <button 
                    onClick={() => handleSendChat("Explain the math behind flight altitude carbon burned")}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-white/10 hover:border-emerald-500/20 text-zinc-300 px-3 py-1.5 rounded-xl text-[10px] font-mono transition"
                  >
                    ✈️ Altitude Burn Calculus?
                  </button>
                </div>

                {/* Form Input elements */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
                  className="flex gap-2"
                >
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type an environmental query (e.g., 'How to offset heating burn?')"
                    className="flex-grow bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#00FF88] font-mono"
                  />
                  <button
                    type="submit"
                    disabled={coachStatus === "typing" || !chatInput.trim()}
                    className="bg-[#00FF88] text-black px-4 rounded-xl hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center font-bold text-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>

            {/* Right Box: AI GREEN SCAN CARD & Bill Upload audit engine */}
            <div className="lg:col-span-5 flex flex-col gap-6" id="bill_scanner_panel">
              
              <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between" id="visual_file_scanner">
                <div>
                  <div className="flex items-center gap-1.5 text-[#00FF88] font-mono text-[10.5px] tracking-widest uppercase mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>GREEN VISION AI SCAN v4.9</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">Utility Bill & Receipt Inspector</h3>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    Instantly extract and identify direct and indirect carbon emissions by auditing utility statements, flights, or consumer orders.
                  </p>
                </div>

                {/* Quick tab Selector for sample testing receipts */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-1 rounded-xl my-4 text-center font-mono">
                  <button
                    onClick={() => { setScanType("electric"); setScanResult(null); }}
                    className={`py-1.5 rounded-lg text-[10px] uppercase font-semibold transition ${
                      scanType === "electric" ? "bg-zinc-850 border border-white/10 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Electric
                  </button>
                  <button
                    onClick={() => { setScanType("grocery"); setScanResult(null); }}
                    className={`py-1.5 rounded-lg text-[10px] uppercase font-semibold transition ${
                      scanType === "grocery" ? "bg-zinc-850 border border-white/10 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Grocery
                  </button>
                  <button
                    onClick={() => { setScanType("travel"); setScanResult(null); }}
                    className={`py-1.5 rounded-lg text-[10px] uppercase font-semibold transition ${
                      scanType === "travel" ? "bg-zinc-850 border border-white/10 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Travel
                  </button>
                </div>

                {/* Drag-drop or Preset File Viewer Mock container */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer ${
                    scanning ? "border-emerald-500/50 bg-[#00FF88]/5 animate-pulse" : "border-white/10 hover:border-emerald-500/30 bg-[#070709]"
                  }`}
                  onClick={handleBillScanFile}
                >
                  <Upload className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition" />
                  
                  <div className="space-y-1">
                    <p className="text-xs text-white font-semibold font-mono">{SCAN_PRESETS[scanType].name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono italic max-w-xs">{SCAN_PRESETS[scanType].img}</p>
                  </div>

                  <span className="text-[9.5px] px-2 py-1 bg-zinc-900 text-zinc-400 font-mono rounded-md border border-white/5 uppercase font-bold mt-2">
                    {scanning ? "PRObing Visual Matrices..." : "Simulate File Upload & Audit"}
                  </span>
                </div>

                {/* Scanned Results representation */}
                {scanResult && (
                  <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 mt-4 space-y-3 font-mono text-[11px] animate-fadeIn" id="scan_outcome">
                    
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-white font-bold text-xs">{scanResult.merchantTitle}</span>
                      <span className="text-zinc-500">{scanResult.scannedDate}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-zinc-500 uppercase tracking-widest text-[9px]">EST. CARBON VOLUME</div>
                        <div className="text-sm font-bold text-red-400">{scanResult.estimatedEmissionsKg} kg CO₂</div>
                      </div>
                      <div>
                        <div className="text-zinc-500 uppercase tracking-widest text-[9px]">SUBST_POTENTIAL SAVINGS</div>
                        <div className="text-sm font-bold text-[#00FF88]">{scanResult.carbonReductionPotentialKg} kg CO₂</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 uppercase tracking-widest text-[9px]">RECOMMENDED MITIGATION OPTION</div>
                      <p className="text-zinc-300 mt-0.5 italic">"{scanResult.alternativeEcoOption}"</p>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <div className="text-zinc-500 uppercase tracking-widest text-[9px] mb-1">KEY DETECTED ATTRIBUTES</div>
                      <div className="space-y-1">
                        {scanResult.detectedItems.map((item, id) => (
                          <div key={id} className="flex justify-between text-[10px] bg-black/45 p-1.5 rounded border border-white/5">
                            <span className="text-zinc-400">{item.label}</span>
                            <span className="text-zinc-200 font-semibold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Visual Scanner Log History list */}
                {scannedFiles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">SESSION SCAN LOGS HISTORY:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {scannedFiles.map((f, i) => (
                        <span key={i} className="text-[9.5px] font-mono bg-zinc-900 border border-white/5 py-1 px-2.5 rounded-lg text-zinc-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ======================================================================
          3. CLIMATE TIME MACHINE & BUTTERFLY SIMULATOR
          ====================================================================== */}
        {activeTab === "timemachine" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="view_timemachine">
            
            {/* Left Column: environmental dials & machine controls */}
            <div className="lg:col-span-7 bg-[#09090b]/80 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10.5px] tracking-widest uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ATMOSPHERIC SIMULATION MODULE</span>
                </div>
                
                <h3 className="font-display font-bold text-2xl text-white">Environmental Time Machine</h3>
                <p className="text-zinc-400 text-xs">
                  Slide parameters dynamically over coordinates from 2025 to 2050. Watch how decisions recursively affect air thresholds, biodiversity percentages, and planetary temperatures.
                </p>

                {/* Interactive Slider */}
                <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5 relative overflow-hidden space-y-4 my-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">SIMULATED YEAR COORD</span>
                      <span className="text-3xl font-display font-bold text-[#00D4FF]">{simulationYear} AD</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase block">ACTIVE TIMELINE STATUS</span>
                      <span className={`text-xs font-mono font-bold uppercase rounded px-2 py-0.5 ${
                        simScenario === "optimistic" ? "bg-emerald-950 text-emerald-400" : simScenario === "business-as-usual" ? "bg-yellow-950 text-yellow-400" : "bg-red-950 text-red-300"
                      }`}>
                        {simScenario === "optimistic" ? "Optimized Policy Grid" : simScenario === "business-as-usual" ? "Business As Usual" : "Extreme Inaction"}
                      </span>
                    </div>
                  </div>

                  {/* Range Slider for Year */}
                  <input 
                    type="range"
                    min="2025"
                    max="2050"
                    step="1"
                    value={simulationYear}
                    onChange={(e) => setSimulationYear(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
                  />

                  {/* Scenarios selective radio grid */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <button
                      onClick={() => setSimScenario("optimistic")}
                      className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase border transition ${
                        simScenario === "optimistic" ? "bg-[#00FF88]/10 border-[#00FF88] text-[#00FF88]" : "bg-zinc-900/50 border-white/10 text-zinc-500"
                      }`}
                    >
                      🌱 Eco Innovation
                    </button>
                    <button
                      onClick={() => setSimScenario("business-as-usual")}
                      className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase border transition ${
                        simScenario === "business-as-usual" ? "bg-yellow-500/10 border-yellow-500 text-yellow-400" : "bg-zinc-900/50 border-white/10 text-zinc-500"
                      }`}
                    >
                      🚜 Moderate Delay
                    </button>
                    <button
                      onClick={() => setSimScenario("pessimistic")}
                      className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase border transition ${
                        simScenario === "pessimistic" ? "bg-red-500/10 border-red-500 text-red-400" : "bg-zinc-900/50 border-white/10 text-zinc-500"
                      }`}
                    >
                      ☣️ Fossil Reliance
                    </button>
                  </div>

                </div>

                {/* Simulator feedback outcomes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5 font-mono">
                  
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 uppercase block">Atmos CO₂ PPM</span>
                    <span className="text-xl font-display font-semibold text-white mt-1 block">
                      {simResult.co2Ppm} <span className="text-xs text-zinc-500">PPM</span>
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 uppercase block">Temp Anomaly</span>
                    <span className={`text-xl font-display font-semibold mt-1 block ${
                      simResult.globalTempAnomaly > 1.8 ? "text-red-400" : "text-emerald-400"
                    }`}>
                      +{simResult.globalTempAnomaly}°C
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 uppercase block">Air Quality Scale</span>
                    <span className="text-xs font-semibold text-zinc-200 mt-2 block uppercase">
                      {simResult.globalAirQuality}
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[10px] text-zinc-500 uppercase block">Canopy stressed</span>
                    <span className="text-xl font-display font-semibold text-white mt-1 block">
                      {simResult.biodiversityLossPercent}%
                    </span>
                  </div>

                </div>

                <div className="bg-zinc-950/70 p-4 rounded-2xl border border-white/5 text-xs text-zinc-400 italic">
                  🐾 "{simResult.message}"
                </div>

              </div>

              {/* Butterfly Ecology sequences presets list */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3" id="butterfly_sequence_interactive">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                  🔗 Butterfly Effect Sequence Presets:
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div 
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/20 rounded-xl cursor-pointer transition flex justify-between items-center"
                    onClick={() => triggerButterflyEffect("Replacing 3 beef steaks with garden grains weekly", 680)}
                  >
                    <span>🍔 Swapping Beef Steaks</span>
                    <span className="text-[#00FF88] font-bold">Get Effect →</span>
                  </div>
                  <div 
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/20 rounded-xl cursor-pointer transition flex justify-between items-center"
                    onClick={() => triggerButterflyEffect("Converting central heating draft thermostat down 1.5°C", 410)}
                  >
                    <span>🌡️ Boiler Set Down 1.5°</span>
                    <span className="text-[#00FF88] font-bold">Get Effect →</span>
                  </div>
                  <div 
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/20 rounded-xl cursor-pointer transition flex justify-between items-center"
                    onClick={() => triggerButterflyEffect("Ditching regional puddle jet flight for high-speed train route", 1850)}
                  >
                    <span>🚆 Puddle Jet to Train Route</span>
                    <span className="text-[#00FF88] font-bold">Get Effect →</span>
                  </div>
                  <div 
                    className="p-3 bg-zinc-950 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/20 rounded-xl cursor-pointer transition flex justify-between items-center"
                    onClick={() => triggerButterflyEffect("Disconnecting home entertainment consoles from passive standby power", 120)}
                  >
                    <span>⚡ Standby Draft Off</span>
                    <span className="text-[#00FF88] font-bold">Get Effect →</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Virtual forests growing with milestones */}
            <div className="lg:col-span-5 flex flex-col gap-6" id="forest_growing_dashboard">
              
              <div className="bg-zinc-950 border border-white/10 p-6 rounded-3xl relative overflow-hidden" id="virtual_achievement_forest">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase block mb-1">
                    🌳 VIRTUAL CO₂ ABATEMENT CANOPY
                  </span>
                  <h3 className="font-display font-bold text-lg text-white">Your Virtual Forest Canopy</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mt-1">
                    Every landmark reduction and habit correction plants and grows real-time mature trees in your digital ecosystem interface.
                  </p>
                </div>

                {/* Forest grid rendering mapping to points/badges */}
                <div className="bg-black/65 rounded-2xl border border-white/5 p-4 my-5 h-56 flex flex-col justify-between">
                  
                  {/* Row of visual canopy trees */}
                  <div className="bg-grid-pattern p-4 rounded-xl flex-grow flex items-center justify-center relative">
                    <div className="grid grid-cols-5 gap-3 text-2xl text-center">
                      <div className="floating-item">🌳</div>
                      {greenPoints >= 150 ? <div className="floating-item" style={{ animationDelay: '1s' }}>🌲</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {greenPoints >= 250 ? <div className="floating-item" style={{ animationDelay: '2s' }}>🌴</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {badges[2].unlocked ? <div className="floating-item" style={{ animationDelay: '1.5s' }}>🌳</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {badges[3].unlocked ? <div className="floating-item" style={{ animationDelay: '0.5s' }}>🌸</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {badges[0].unlocked ? <div className="floating-item">🌿</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {greenPoints >= 350 ? <div className="floating-item" style={{ animationDelay: '1.2s' }}>🌵</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {greenPoints >= 450 ? <div className="floating-item" style={{ animationDelay: '2.5s' }}>🌴</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {greenPoints >= 550 ? <div className="floating-item" style={{ animationDelay: '3s' }}>🌻</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                      {badges[4].unlocked ? <div className="floating-item">🌳</div> : <div className="opacity-15 font-mono text-xs flex items-center justify-center">🔒</div>}
                    </div>

                    <div className="absolute top-2 right-3 text-[9px] font-mono text-emerald-400">
                      LIVE CANOPY ABSORPTION RATE: +{(greenPoints / 16).toFixed(1)} KG/MO
                    </div>
                  </div>

                  {/* Achievements and points counter details */}
                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                    <div>Trees Planted: {Math.max(1, Math.round(greenPoints / 100))}</div>
                    <div>Abated baseline: {Math.round(greenPoints * 1.8)} Kg CO₂</div>
                  </div>

                </div>

                {/* Subheading Badge milestones details */}
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                  ECO-BADGES EARNED TRACKING:
                </span>

                <div className="grid grid-cols-1 gap-2.5 mt-2">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={`p-3 rounded-2xl flex items-center gap-3 border ${
                        badge.unlocked 
                          ? "bg-zinc-900/80 border-emerald-500/20 text-white" 
                          : "bg-zinc-950/45 border-white/5 text-zinc-500"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{badge.icon}</span>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <span className="text-xs font-semibold">{badge.title}</span>
                          <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                            +{badge.points} PTS
                          </span>
                        </div>
                        <p className="text-[10px] leading-snug mt-0.5">{badge.description}</p>
                      </div>
                      <div className="text-right">
                        {badge.unlocked ? (
                          <span className="text-emerald-400 text-xs font-mono">UNLOCKED</span>
                        ) : (
                          <span className="text-zinc-600 text-xs font-mono">LOCKED</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ======================================================================
          4. GLOBAL COMMUNITY IMPACT LEADERS & PODIUM
          ====================================================================== */}
        {activeTab === "community" && (
          <div className="bg-[#09090b]/80 border border-white/5 rounded-3xl p-6 md:p-8 animate-fadeIn" id="view_community_ranking">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="text-xs font-mono text-[#00FF88] tracking-widest uppercase mb-1">
                  🌐 GLOBAL COMMUNITY CLIMATE PODIUM
                </div>
                <h3 className="font-display font-bold text-2xl text-white">Carbon Mitigation Standings</h3>
                <p className="text-zinc-400 text-xs mt-1">
                  Real-time leaderboard metrics of forward-thinking cities and university campus clusters.
                </p>
              </div>

              {/* Dynamic submit action for user */}
              <button
                type="button"
                onClick={() => {
                  setGreenPoints(prev => prev + 50);
                  alert("Thank you! Your active lifestyle baseline carbon reduction data has been logged with coordinates globally!");
                }}
                className="bg-zinc-900 border border-white/10 hover:border-emerald-500/30 text-white font-mono text-xs p-3.5 rounded-xl transition flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#00FF88]" />
                <span>Submit My Footprint Baseline Globally</span>
              </button>
            </div>

            {/* Podium Graphics Grid (Tesla & Stripe animations style) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-10 bg-black/40 p-6 rounded-3xl border border-white/5">
              
              {/* Leader Left (#3) */}
              <div className="lg:col-span-4 flex flex-col items-center gap-3">
                <span className="text-lg">🌾</span>
                <div className="text-center">
                  <div className="font-semibold text-white">Copenhagen Ecolife</div>
                  <div className="text-[10px] font-mono text-zinc-500">DK Baseline Group</div>
                </div>
                {/* Visual block */}
                <div className="w-full h-24 bg-gradient-to-t from-zinc-900 to-emerald-950 border-t border-white/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center font-mono">
                    <span className="text-zinc-500 block">3rd Place</span>
                    <span className="text-xl font-bold text-emerald-400 font-display">84/100 Rating</span>
                  </div>
                </div>
              </div>

              {/* Leader Center (#1) High visual block */}
              <div className="lg:col-span-4 flex flex-col items-center gap-3 order-first lg:order-none">
                <span className="text-2xl floating-item">👑</span>
                <div className="text-center">
                  <div className="font-semibold text-white text-md">Zurich Eco-Hub Campus</div>
                  <div className="text-[10px] font-mono text-[#00FF88]">CH Baseline Group</div>
                </div>
                {/* Visual block */}
                <div className="w-full h-40 bg-gradient-to-t from-zinc-800 to-emerald-900/60 border-2 border-[#00FF88] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00FF88]/5 animate-pulse pointer-events-none" />
                  <div className="text-center font-mono">
                    <span className="text-[#00FF88] font-bold block uppercase tracking-widest text-[10px]">CHAMPION RATING</span>
                    <span className="text-2xl font-bold text-white font-display">96/100</span>
                  </div>
                </div>
              </div>

              {/* Leader Right (#2) */}
              <div className="lg:col-span-4 flex flex-col items-center gap-3">
                <span className="text-lg">🍃</span>
                <div className="text-center">
                  <div className="font-semibold text-white">Vancouver West Greenways</div>
                  <div className="text-[10px] font-mono text-zinc-500">CA Baseline Group</div>
                </div>
                {/* Visual block */}
                <div className="w-full h-32 bg-gradient-to-t from-zinc-900 to-cyan-950 border-t border-white/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center font-mono">
                    <span className="text-zinc-500 block">2nd Place</span>
                    <span className="text-xl font-bold text-cyan-400 font-display">91/100 Rating</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Flat list ranking board details */}
            <div className="space-y-2 mt-6 max-w-4xl mx-auto">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                OTHER PARTICIPATING CLUSTERS Standings:
              </span>

              {[
                { rank: 4, name: "Tokyo Autonomous Metro Grid", score: 81, co2Saved: "8,240 kg", member: "12,942 members" },
                { rank: 5, name: "Seattle Green District Coalition", score: 78, co2Saved: "6,910 kg", member: "8,340 members" },
                { rank: 6, name: "Austin Off-Grid Collective", score: 75, co2Saved: "5,440 kg", member: "4,210 members" },
                { rank: 7, name: "Hamburg Marine Wind District", score: 73, co2Saved: "4,120 kg", member: "2,380 members" },
              ].map((club) => (
                <div 
                  key={club.rank}
                  className="bg-zinc-950 border border-white/5 px-6 py-4 rounded-2xl flex items-center justify-between font-mono text-xs hover:border-[#00FF88]/15 hover:bg-zinc-900/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500 font-bold w-6">#{club.rank}</span>
                    <div>
                      <div className="font-sans font-semibold text-white">{club.name}</div>
                      <div className="text-[10px] text-zinc-500">{club.member}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">TOTAL LOGGED REDUCTION</span>
                      <span className="text-emerald-400 font-bold">{club.co2Saved}</span>
                    </div>
                    
                    <div className="text-right font-display text-white font-bold text-sm bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5">
                      {club.score}/100
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* 🚀 FOOTER TRADING LINES */}
      <footer className="mt-auto bg-black border-t border-white/5 py-8 px-4" id="main_footer_hud">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span>VR-1 AI Carbon Intelligence Corp © 2026. Next-Generation Science.</span>
          </div>

          <div className="flex flex-wrap gap-4 text-[10.5px]">
            <a href="#control_center" className="hover:text-white transition">HACKATHON SCHEMATIC</a>
            <a href="#control_center" className="hover:text-white transition">NASA DATA TERMS</a>
            <a href="#control_center" className="hover:text-white transition">GEMINI PROMPT CLOUD</a>
          </div>

          <div>
            <span>PORT_OPERATION_VEC: <span className="text-white">PORT_3000</span></span>
          </div>

        </div>
      </footer>

    </div>
  );
}
