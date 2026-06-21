import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, ShieldCheck, Sun, Compass } from "lucide-react";

interface GlobeProps {
  stage: "healthy" | "polluted" | "optimized";
}

interface Hotspot {
  lat: number;
  lng: number;
  label: string;
  intensity: number; // 0 to 1
  isEco: boolean;
  metric: string;
}

export default function HolographicGlobe({ stage }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredSpot, setHoveredSpot] = useState<Hotspot | null>(null);

  // Sample Earth hotspots
  const hotspots: Hotspot[] = [
    { lat: 35.6762, lng: 139.6503, label: "Tokyo Eco-transit Hub", intensity: 0.9, isEco: true, metric: "89% EV Adoption Rate" },
    { lat: 40.7128, lng: -74.006, label: "NYC Urban Congestion", intensity: 0.8, isEco: false, metric: "240g/km CO₂ Average" },
    { lat: -3.4653, lng: -62.2159, label: "Amazon Rain Canopy Loss", intensity: 0.95, isEco: false, metric: "+18% Canopy stress" },
    { lat: 28.6139, lng: 77.209, label: "New Delhi Industrial Smog", intensity: 0.85, isEco: false, metric: "AQI Index: 342 Fine particles" },
    { lat: 51.5074, lng: -0.1278, label: "London Smart Offshore Grid", intensity: 0.88, isEco: true, metric: "Powering 14M homes with Wind" },
    { lat: -33.8688, lng: 151.2093, label: "Sydney Coastal Marine Hub", intensity: 0.7, isEco: true, metric: "Sea-kelp Carbon sink active" }
  ];

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Coordinate projection helper
    // 3D rotation around Y axis
    const project = (lat: number, lng: number, rad: number, angleOffset: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + angleOffset) * (Math.PI / 180);

      const x = rad * Math.sin(phi) * Math.sin(theta);
      const y = rad * Math.cos(phi);
      // z is depth. Facing side has positive z
      const z = rad * Math.sin(phi) * Math.cos(theta);

      return { x, y, z };
    };

    let rotAngle = 0;
    let particles: Array<{ x: number; y: number; z: number; speed: number; size: number; alpha: number }> = [];

    // Initialize environment particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 360,
        y: (Math.random() - 0.5) * 180,
        z: Math.random() * 80 + 100,
        speed: Math.random() * 0.3 + 0.1,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;

      rotAngle += 0.25; // Speed of rotation

      // Set colors based on stage
      let globeColor = "rgba(0, 212, 255, 0.2)"; // Teal/Blue default
      let atmosphereColor = "rgba(0, 212, 255, 0.05)";
      let strokeColor = "rgba(0, 212, 255, 0.15)";
      let connectionColor = "rgba(0, 255, 136, 0.3)";

      if (stage === "healthy") {
        globeColor = "rgba(0, 255, 136, 0.15)";
        atmosphereColor = "rgba(0, 255, 136, 0.03)";
        strokeColor = "rgba(0, 255, 136, 0.1)";
        connectionColor = "rgba(0, 255, 136, 0.4)";
      } else if (stage === "polluted") {
        globeColor = "rgba(239, 68, 68, 0.18)";
        atmosphereColor = "rgba(239, 68, 68, 0.05)";
        strokeColor = "rgba(239, 68, 68, 0.12)";
        connectionColor = "rgba(249, 115, 22, 0.4)";
      } else if (stage === "optimized") {
        globeColor = "rgba(0, 255, 255, 0.25)";
        atmosphereColor = "rgba(0, 255, 255, 0.08)";
        strokeColor = "rgba(0, 255, 255, 0.15)";
        connectionColor = "rgba(0, 255, 136, 0.6)";
      }

      // Draw outer atmosphere glow circle
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.25);
      if (stage === "healthy") {
        gradient.addColorStop(0, "rgba(5, 5, 5, 0)");
        gradient.addColorStop(0.3, "rgba(0, 255, 136, 0.08)");
        gradient.addColorStop(0.6, "rgba(0, 212, 255, 0.05)");
        gradient.addColorStop(1, "rgba(5, 5, 5, 0)");
      } else if (stage === "polluted") {
        gradient.addColorStop(0, "rgba(5, 5, 5, 0)");
        gradient.addColorStop(0.3, "rgba(249, 115, 22, 0.12)");
        gradient.addColorStop(0.6, "rgba(239, 68, 68, 0.08)");
        gradient.addColorStop(1, "rgba(5, 5, 5, 0)");
      } else {
        gradient.addColorStop(0, "rgba(5, 5, 5, 0)");
        gradient.addColorStop(0.3, "rgba(0, 255, 255, 0.15)");
        gradient.addColorStop(0.6, "rgba(0, 255, 136, 0.05)");
        gradient.addColorStop(1, "rgba(5, 5, 5, 0)");
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Draw backing ocean circle
      ctx.fillStyle = "rgba(5, 5, 5, 0.6)";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw latitude lines (3D grid)
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 10) {
          const { x, y, z } = project(lat, lng, radius, rotAngle);
          if (z >= 0) { // On front face of hemisphere
            if (lng === -180) ctx.moveTo(cx + x, cy + y);
            else ctx.lineTo(cx + x, cy + y);
          }
        }
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lng = 0; lng < 360; lng += 20) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const { x, y, z } = project(lat, lng, radius, rotAngle);
          if (z >= 0) {
            if (lat === -90) ctx.moveTo(cx + x, cy + y);
            else ctx.lineTo(cx + x, cy + y);
          }
        }
        ctx.stroke();
      }

      // Draw schematic continents (mock landmasses as simple polygon paths)
      const mockContinents = [
        // North America
        [ {lat: 60, lng: -120}, {lat: 53, lng: -110}, {lat: 41, lng: -90}, {lat: 25, lng: -85}, {lat: 10, lng: -75}, {lat: 20, lng: -100}, {lat: 45, lng: -125}, {lat: 60, lng: -120} ],
        // South America
        [ {lat: 10, lng: -75}, {lat: -5, lng: -50}, {lat: -25, lng: -45}, {lat: -50, lng: -70}, {lat: -40, lng: -75}, {lat: -15, lng: -75}, {lat: 10, lng: -75} ],
        // Eurasia
        [ {lat: 70, lng: 30}, {lat: 60, lng: 90}, {lat: 55, lng: 130}, {lat: 35, lng: 120}, {lat: 15, lng: 100}, {lat: 10, lng: 80}, {lat: 25, lng: 45}, {lat: 40, lng: 30}, {lat: 50, lng: 5}, {lat: 70, lng: 30} ],
        // Africa
        [ {lat: 30, lng: 15}, {lat: 30, lng: 32}, {lat: 10, lng: 45}, {lat: -30, lng: 25}, {lat: -30, lng: 18}, {lat: 5, lng: 8}, {lat: 15, lng: -10}, {lat: 30, lng: 15} ],
        // Australia
        [ {lat: -20, lng: 120}, {lat: -15, lng: 140}, {lat: -35, lng: 145}, {lat: -35, lng: 115}, {lat: -20, lng: 120} ]
      ];

      ctx.fillStyle = globeColor;
      mockContinents.forEach(polygon => {
        let drawing = false;
        ctx.beginPath();
        polygon.forEach(point => {
          const { x, y, z } = project(point.lat, point.lng, radius, rotAngle);
          if (z >= 0) {
            if (!drawing) {
              ctx.moveTo(cx + x, cy + y);
              drawing = true;
            } else {
              ctx.lineTo(cx + x, cy + y);
            }
          }
        });
        if (drawing) {
          ctx.closePath();
          ctx.fill();
        }
      });

      // Draw global grid connections (hologram node lines matching Space Agency design)
      if (stage === "optimized") {
        ctx.strokeStyle = "rgba(0, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < hotspots.length; i++) {
          const p1 = project(hotspots[i].lat, hotspots[i].lng, radius, rotAngle);
          if (p1.z >= 0) {
            for (let j = i + 1; j < hotspots.length; j++) {
              const p2 = project(hotspots[j].lat, hotspots[j].lng, radius, rotAngle);
              if (p2.z >= 0) {
                ctx.moveTo(cx + p1.x, cy + p1.y);
                ctx.lineTo(cx + p2.x, cy + p2.y);
              }
            }
          }
        }
        ctx.stroke();
      }

      // Draw Hotspots
      let currentHovered: Hotspot | null = null;
      hotspots.forEach(spot => {
        const { x, y, z } = project(spot.lat, spot.lng, radius, rotAngle);
        if (z >= 0) {
          const screenX = cx + x;
          const screenY = cy + y;

          // Spot color logic
          let color = "rgba(0, 255, 136, 1)"; // Eco Green
          let pulseColor = "rgba(0, 255, 136, 0.2)";
          if (!spot.isEco) {
            color = stage === "healthy" ? "rgba(249, 115, 22, 0.7)" : "rgba(239, 68, 68, 1)";
            pulseColor = stage === "healthy" ? "rgba(249, 115, 22, 0.15)" : "rgba(239, 68, 68, 0.2)";
          }

          if (stage === "optimized" && !spot.isEco) {
            // Under AI regulation, everything is optimizing
            color = "rgba(0, 255, 255, 1)";
            pulseColor = "rgba(0, 255, 255, 0.3)";
          }

          // Draw neon pulse ring
          const ringRadius = 6 + Math.sin(Date.now() / 200) * 4;
          ctx.strokeStyle = pulseColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(screenX, screenY, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Core dot
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Interactive target checking (distance to center mouse)
          // Simple mouse vector distance (needs canvas mouse track, we can simulate)
        }
      });

      // Draw flowing external particles/satellites
      particles.forEach(p => {
        p.x += p.speed;
        if (p.x > 180) p.x = -180;
        const projected = project(p.y, p.x, radius * 1.08, rotAngle);
        if (projected.z >= 0) {
          ctx.fillStyle = stage === "polluted" ? `rgba(249, 115, 22, ${p.alpha})` : `rgba(0, 255, 136, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(cx + projected.x, cy + projected.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw subtle orbital satellite track
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.15, radius * 0.4, -0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Satellite node
      const satTime = Date.now() * 0.0006;
      const satX = cx + Math.cos(satTime) * radius * 1.15;
      const satY = cy + Math.sin(satTime) * radius * 0.4;
      ctx.fillStyle = "#00FF88";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00FF88";
      ctx.beginPath();
      ctx.arc(satX, satY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Overlay text markers on the side to look professional
      ctx.font = "10px JetBrains Mono";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillText(`ROTATIONAL_VEC: ${rotAngle.toFixed(1)}°`, 20, 30);
      ctx.fillText(`ORBIT_SAT_C_ID: VR-1_LEO`, 20, 45);
      ctx.fillText(`GEO_FOCUS: AUTONOMOUS`, 20, 60);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [stage]);

  return (
    <div className="relative w-full aspect-square md:max-w-md lg:max-w-lg mx-auto flex flex-col justify-between items-center bg-[#070709] border border-white/5 rounded-3xl p-6 group overflow-hidden box-border">
      {/* Absolute futuristic HUD elements */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-10 font-mono text-[10px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-teal-400" />
          <span>SENSORY FEED: EST-03</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-emerald-400">LIVE CO₂ GROUNDING</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-zinc-500 pointer-events-none z-10">
        <div>ORBIT_RAD: 6,371 KM</div>
        <div>SYS_RESONANCE: OK [99.8%]</div>
      </div>

      {/* Actual Drawing Canvas */}
      <div className="w-full flex-grow flex items-center justify-center relative">
        <canvas ref={canvasRef} className="w-full max-h-[380px] cursor-grab active:cursor-grabbing" />
        
        {/* Absolute Glowing Backdrop */}
        <div className={`absolute inset-0 bg-radial from-transparent via-transparent to-black pointer-events-none`} />
      </div>

      {/* Interactive Phase/Stage UI Readout */}
      <div className="w-full relative z-10 bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#00FF88] font-mono">
            Globe Phase: {stage === "healthy" ? "STAGE_01 (Healthy)" : stage === "polluted" ? "STAGE_02 (Polluted)" : "STAGE_03 (Optimized)"}
          </span>
          {stage === "polluted" ? (
            <AlertTriangle className="text-red-400 w-4 h-4 animate-bounce" />
          ) : stage === "optimized" ? (
            <Sun className="text-cyan-400 w-4 h-4 animate-spin-slow" />
          ) : (
            <ShieldCheck className="text-emerald-400 w-4 h-4" />
          )}
        </div>
        <p className="text-xs text-zinc-400">
          {stage === "healthy"
            ? "Dynamic baseline parameters representing pristine ecological feedback loops without human surplus emissions."
            : stage === "polluted"
            ? "Severe alert triggers in Amazon basin, Industrial Smog in Delhi, and coastal acidification indicators showing 2.8x standard threat levels."
            : "Dynamic carbon-neutral grid established. Atmospheric particles rebalancing dynamically via smart multi-system reduction models."}
        </p>

        {/* Dynamic mini-metric panel */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500">
          <div>Avg Temp: <span className={stage === 'polluted' ? 'text-red-400 font-bold' : stage === 'optimized' ? 'text-cyan-400' : 'text-emerald-400'}>{stage === 'polluted' ? '+2.8°C' : stage === 'optimized' ? '+1.1°C' : '+0.8°C'}</span></div>
          <div>Forest Index: <span className="text-zinc-300 font-bold">{stage === 'polluted' ? '42%' : stage === 'optimized' ? '92%' : '85%'}</span></div>
        </div>
      </div>
    </div>
  );
}
