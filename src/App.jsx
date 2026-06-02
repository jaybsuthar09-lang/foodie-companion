import { useState, useEffect, useRef, useCallback } from "react";

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#f59e0b","#ef4444","#10b981","#3b82f6","#ec4899","#8b5cf6","#f97316"];
    particles.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 6 + 3,
      d: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.d + 1;
        p.x += Math.sin(p.tiltAngle) * 1.5;
        p.tiltAngle += p.tiltSpeed;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => cancelAnimationFrame(raf.current), 4000);
    return () => { cancelAnimationFrame(raf.current); clearTimeout(t); };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, pointerEvents:"none", zIndex:9999 }} />;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background:"#1c1412", color:"#fef3c7", padding:"12px 24px",
      borderRadius:999, fontSize:14, fontWeight:500, zIndex:9000,
      boxShadow:"0 4px 24px rgba(0,0,0,0.3)", animation:"fadeUp 0.3s ease",
    }}>{msg}</div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MOODS = [
  { id:"happy", emoji:"😊", label:"Happy", color:"#f59e0b", bg:"#fffbeb" },
  { id:"sad", emoji:"😢", label:"Sad", color:"#6366f1", bg:"#eef2ff" },
  { id:"stressed", emoji:"😤", label:"Stressed", color:"#ef4444", bg:"#fef2f2" },
  { id:"tired", emoji:"😴", label:"Tired", color:"#8b5cf6", bg:"#f5f3ff" },
  { id:"excited", emoji:"🤩", label:"Excited", color:"#f97316", bg:"#fff7ed" },
  { id:"neutral", emoji:"😐", label:"Neutral", color:"#10b981", bg:"#ecfdf5" },
];

const MOOD_DATA = {
  happy: {
    message: "Your happiness is contagious — you light up every room you walk into! Keep shining, because the world is better when you're this joyful.",
    food: "Pani Puri 🥣",
    foodNote: "Celebrate with a round of crispy puris bursting with tangy water — one per pop of joy!",
    quote: "Joy shared is joy doubled. — Unknown",
  },
  sad: {
    message: "Even the best days have clouds, and that's okay. You're allowed to feel this. But remember — you have a warmth inside that no sadness can ever fully reach.",
    food: "Cheese Maggi 🍜",
    foodNote: "Warm, gooey, utterly comforting. A bowl of cheesy Maggi fixes more things than medicine ever could.",
    quote: "After every storm comes a rainbow — and a snack. — Your Best Friend",
  },
  stressed: {
    message: "You're carrying a lot right now, and I see that. You're stronger than the stress, and you've handled harder things before. Breathe. One step at a time.",
    food: "Pav Bhaji 🥘",
    foodNote: "Thick, spiced bhaji with buttered pav — the ultimate stress-relief comfort food. Everything tastes better with extra butter.",
    quote: "You don't have to be perfect to be amazing. — Unknown",
  },
  tired: {
    message: "Rest is not giving up — it's fuelling up. You work so hard and give so much. You deserve to rest without guilt. Take your time.",
    food: "Kulfi 🍦",
    foodNote: "Cool, creamy, dreamy kulfi. Lie down, eat slowly, and let the cold sweetness remind you that some things in life are wonderfully simple.",
    quote: "Even the moon takes breaks. So can you. — Unknown",
  },
  excited: {
    message: "That electric energy you have right now? It's rare and beautiful. Channel it, celebrate it, and let it carry you somewhere magical today!",
    food: "Dabeli 🥪",
    foodNote: "Bold, sweet, tangy, spiced — just like your excitement right now. Every bite is a party in your mouth!",
    quote: "The best things in life are felt before they happen. — Unknown",
  },
  neutral: {
    message: "Not every day has to be extraordinary. Peaceful, ordinary days are their own kind of beautiful. You exist, and that's more than enough.",
    food: "Vada Pav Sandwich 🥙",
    foodNote: "The steady, dependable classic — crispy vada, soft pav, the perfect everyday champion. Just like you.",
    quote: "Ordinary days are the ones we remember most fondly. — Unknown",
  },
};

const FOODS = [
  {
    id:"panipuri", name:"Pani Puri", emoji:"🥣", color:"#f97316",
    desc:"The crown jewel of Indian street food — thin crispy puris filled with spiced water, tamarind, and potatoes.",
    fact:"Did you know Pani Puri is known by over 8 different names across India? Golgappa, Phuchka, Gupchup, Pakodi... but they all hit the same spot.",
    surprise:"💫 Legend says a true Pani Puri lover can eat 15 in under 3 minutes. Your personal record?",
  },
  {
    id:"dabeli", name:"Dabeli", emoji:"🥪", color:"#d97706",
    desc:"A Kutchi street food masterpiece — sweet-spiced potato filling in a soft bun, topped with pomegranate seeds, sev, and chutneys.",
    fact:"Dabeli was invented in Mandvi, Kutch, Gujarat. The word 'dabeli' literally means 'pressed' — and yes, it's pressed between two soft buns of happiness.",
    surprise:"🌟 The pomegranate seeds on Dabeli aren't just decoration — they add a burst of freshness that makes every bite unforgettable.",
  },
  {
    id:"maggi", name:"Cheese Maggi", emoji:"🍜", color:"#eab308",
    desc:"The ultimate college-life comfort — Maggi noodles elevated with melting cheese, vegetables, and extra masala love.",
    fact:"India consumes nearly 4.5 billion packets of Maggi every year. That's roughly 3 packets for every single person in the country.",
    surprise:"🧀 The moment you add cheese before the water evaporates completely — that's the secret to perfect gooey Cheese Maggi.",
  },
  {
    id:"sandwich", name:"Bombay Sandwich", emoji:"🥗", color:"#22c55e",
    desc:"A Mumbai classic — layers of boiled potato, beets, cucumber, and green chutney on soft bread, grilled to golden perfection.",
    fact:"The Bombay Sandwich is a complete meal — carbs, vegetables, protein, and pure soul. Mumbai's dabbawalas have delivered versions of this to offices for over 125 years.",
    surprise:"💚 The secret is the green chutney — coriander, mint, green chilli, and a squeeze of lemon. That's the flavour of Mumbai street magic.",
  },
  {
    id:"pavbhaji", name:"Pav Bhaji", emoji:"🥘", color:"#ef4444",
    desc:"A fiery, buttery mash of vegetables and spices served with toasted pav dripping in butter — Maharashtra's greatest gift to mankind.",
    fact:"Pav Bhaji was originally created by textile mill workers in Mumbai in the 1850s who needed a quick, hearty meal during short breaks.",
    surprise:"🧈 The rule is: no such thing as too much butter on Pav Bhaji. The butter lake in the center is not optional — it's non-negotiable.",
  },
  {
    id:"kulfi", name:"Kulfi", emoji:"🍦", color:"#8b5cf6",
    desc:"India's answer to ice cream — rich, dense, hand-churned frozen dessert in flavours like malai, pistachio, rose, and mango.",
    fact:"Kulfi has been around since the Mughal era in the 16th century. It was made by hand-packing sweetened reduced milk in earthen pots and burying them in ice. That tradition is still alive today.",
    surprise:"🌸 Real Kulfi takes 6–8 hours to set. The slower the freeze, the denser and creamier the result. Patience is an ingredient.",
  },
];

const COMPLIMENTS = [
  "I don't know what it is about you, but somehow you make even my worst days feel a little lighter."
"You're becoming my favorite part of days that don't even involve you."
"I could spend hours talking to you and still wish we had more time."
"You make me smile at my phone in ways that are honestly embarrassing."
"Every conversation with you somehow becomes the best part of my day."
"I didn't mean to get attached, but you made that plan impossible."
"You have a way of making everything around you feel a little more exciting."
"I genuinely look forward to hearing from you."
"You're the kind of person people accidentally write paragraphs about."
"You make ordinary moments feel like memories worth keeping."
"I think you're beautiful, but it's your mind that keeps pulling me back."
"You're so easy to talk to that I forget to pretend I'm cool."
"You make me want to tell you every random thought that crosses my mind."
"I don't think you realize how naturally charming you are."
"Somehow, you always leave me wanting one more conversation."
"You have the kind of smile that can completely change someone's mood."
"The more I learn about you, the more fascinating you become."
"You make me feel comfortable and nervous at exactly the same time."
"Your attention feels like a reward."
"I could never get tired of hearing your thoughts."
"You make me laugh when I'm trying very hard not to."
"You have a habit of staying on my mind long after we've talked."
"Being around you feels suspiciously similar to happiness."
"You're proof that personality can be unbelievably attractive."
"I think my day automatically improves whenever you're part of it."
"You're the first person I want to tell things to."
"You somehow make even silence feel comfortable."
"You make me forget what I was supposed to be focusing on."
"You have a way of making people feel special without even realizing it."
"I honestly don't think you know how lovable you are."
"Your laugh is becoming one of my favorite sounds."
"You're the kind of person I'd choose in every room."
"I could listen to you talk about absolutely anything."
"You make me feel like the luckiest person when you choose to spend time with me."
"I didn't expect you to matter this much to me."
"You somehow manage to be both adorable and incredibly attractive."
"You make me miss you before you've even left."
"Every time I see your name pop up, my mood gets better."
"You have the kind of energy people naturally gravitate toward."
"I never get bored of you."
"You make my heart do things that are honestly a little inconvenient."
"You're one of those rare people who gets even better the more you know them."
"I like how safe you make honesty feel."
"You make me want to be the best version of myself."
"You somehow make everything feel less complicated."
"I could probably spend an entire day with you and still not want it to end."
"You're the reason my screen time report is embarrassing."
"You have no business being this attractive and this sweet at the same time."
"I love how your mind works."
"If liking you were a competition, I'd already be winning."
"You make me feel excited about the smallest things."
"I don't think you realize how much brighter you make my days."
"You're the kind of person I never get tired of talking to."
"I love how effortlessly you make people feel comfortable."
"You somehow manage to be my peace and my butterflies."
"I catch myself smiling when I think about you."
"You make me want to stay up a little longer just to keep talking."
"You're incredibly easy to care about."
"I like the way you see the world."
"You have a smile that could probably get away with anything."
"You make me feel like the luckiest person in the room."
"You're the reason random moments suddenly become good memories."
"I could read a hundred messages from you and still want one more."
"You make me feel seen in a way that very few people do."
"You're genuinely one of the most interesting people I've met."
"You make my heart feel a little fuller."
"I love how easy it is to be myself around you."
"You somehow make ordinary conversations feel special."
"I think the best part of my day is hearing from you."
"You make me forget every reason I had for playing it cool."
"Your presence has a way of making everything better."
"You make me feel like life is a little more fun."
"You have the kind of personality people secretly wish they had."
"I like you more than I probably should."
"You make me laugh in ways nobody else can."
"You're the first person I think of when something good happens."
"I don't know how you do it, but you always make me feel important."
"You make even the simplest moments feel worth remembering."
"There's something about you that's impossible to ignore."
"You somehow keep getting more attractive the more I know you."
"You have a way of making me feel at home."
"I don't think I've ever met someone quite like you."
"You make my heart feel ridiculously soft."
"You turn my bad moods into good ones without even trying."
"I could spend all day with you and still miss you afterward."
"You make me feel special in the smallest ways."
"You're the kind of person I could never get enough of."
"I love how your eyes light up when you're excited about something."
"You make me look forward to tomorrow."
"You have a way of making everything feel a little more meaningful."
"Being around you feels like my favorite place."
"You make me want to keep choosing you."
"I love how naturally kind you are."
"You make me feel like I'm exactly where I want to be."
"You're the kind of person people write love songs about."
"I think my heart recognizes you before my mind does."
"You make it impossible not to care about you."
"You're my favorite notification."
"You somehow make every day feel a little less ordinary."
"If I had to choose my favorite person to spend time with, it'd be you every single time." ❤️,
];

const OPEN_WHEN = [
  {
    id:"sad", title:"Open When You're Sad", emoji:"💙", color:"#6366f1",
    content: "Hey. I know right now things feel heavy, and that's okay. You don't have to fix your feelings — just feel them. But while you do, remember: you are someone who has survived every hard day so far. That's a 100% track record. I believe in you with my whole heart. And if a bowl of Cheese Maggi would help, please go make one. You deserve it.",
    extra: "P.S. Cry if you need to. Then eat something warm. Then know I'm thinking of you. 💙",
  },
  {
    id:"stressed", title:"Open When You're Stressed", emoji:"🌿", color:"#10b981",
    content: "Stop. Breathe. In through the nose, out through the mouth. The deadline is real, but so is your ability to handle it. You've done hard things before. Make a list if that helps. Eat something (Pav Bhaji recommended). You don't have to do everything today — just the next small thing. One step. Then another. You've got this.",
    extra: "P.S. Close three browser tabs. You'll feel better immediately. I promise.",
  },
  {
    id:"happy", title:"Open When You're Happy", emoji:"🌟", color:"#f59e0b",
    content: "YES!! You're happy and I am SO here for it. Hold this feeling. Savour it like the first bite of Pani Puri. Tell someone you love them today. Do something that matches your energy — dance alone, call an old friend, eat your favourite food. Happiness is most beautiful when it's shared. You deserve every bit of this joy.",
    extra: "P.S. Screenshot this feeling. You'll want to remember it. ✨",
  },
  {
    id:"exams", title:"Open When Exams Are Hard", emoji:"📚", color:"#d97706",
    content: "Listen. You are not your grades. But also — you can do this. Break it down: one chapter, one topic, one question at a time. Take a 5-minute break every 45 minutes. Eat properly (Dabeli break is mandatory). Sleep is not a waste of time — it's how your brain consolidates everything you've studied. You know more than you think you do. Go show that paper who's boss.",
    extra: "P.S. The exam will end. The knowledge stays. You're building something. 📖",
  },
  {
    id:"motivation", title:"Open When You Need Motivation", emoji:"🔥", color:"#ef4444",
    content: "Hey. Remember why you started. Remember who you're becoming. The version of you that achieves your goals is not some different person — it's you, making one better choice at a time. You are already extraordinary. Now add consistency to that, and nothing can stop you. Get up. Put on your favourite song. Start. Right now. I'll be cheering for you.",
    extra: "P.S. You are built different. Never forget that. 🔥",
  },
];

const ACHIEVEMENTS = [
  { id:"food_explorer", title:"Food Explorer", emoji:"🗺️", desc:"Viewed all 6 street food cards", req:6 },
  { id:"mood_master", title:"Mood Master", emoji:"🌈", desc:"Explored all 6 moods", req:6 },
  { id:"memory_collector", title:"Memory Collector", emoji:"📷", desc:"Added your first memory", req:1 },
  { id:"positivity_champion", title:"Positivity Champion", emoji:"🏆", desc:"Generated 10 compliments", req:10 },
  { id:"secret_finder", title:"Secret Finder", emoji:"🔮", desc:"Found the Secret Food Stall", req:1 },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useLS(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const set = useCallback(v => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key, val]);
  return [val, set];
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"home", label:"Home", emoji:"🏠" },
  { id:"mood", label:"Mood Corner", emoji:"🌈" },
  { id:"food", label:"Food Explorer", emoji:"🍽️" },
  { id:"compliments", label:"Compliments", emoji:"💌" },
  { id:"memories", label:"Memory Vault", emoji:"📸" },
  { id:"openwhen", label:"Open When...", emoji:"💌" },
  { id:"achievements", label:"Achievements", emoji:"🏆" },
];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function FoodieCompanion() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useLS("fc_dark", false);
  const [mobileNav, setMobileNav] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useLS("fc_progress", {
    foodViewed: [], moodsExplored: [], memoriesAdded: 0, complimentsGenerated: 0, secretFound: false,
  });

  const showConfetti = () => { setConfetti(true); setTimeout(() => setConfetti(false), 100); };
  const showToast = msg => setToast(msg);

  const navigate = (p) => {
    setPage(p);
    setMobileNav(false);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const updateProgress = useCallback((key, value) => {
    setProgress(prev => {
      const next = { ...prev };
      if (key === "foodViewed" && !prev.foodViewed.includes(value)) next.foodViewed = [...prev.foodViewed, value];
      if (key === "moodsExplored" && !prev.moodsExplored.includes(value)) next.moodsExplored = [...prev.moodsExplored, value];
      if (key === "memoriesAdded") next.memoriesAdded = (prev.memoriesAdded||0) + value;
      if (key === "complimentsGenerated") next.complimentsGenerated = (prev.complimentsGenerated||0) + value;
      if (key === "secretFound") next.secretFound = true;
      return next;
    });
  }, [setProgress]);

  const achievements = ACHIEVEMENTS.map(a => {
    let unlocked = false;
    if (a.id === "food_explorer") unlocked = progress.foodViewed.length >= a.req;
    if (a.id === "mood_master") unlocked = progress.moodsExplored.length >= a.req;
    if (a.id === "memory_collector") unlocked = (progress.memoriesAdded||0) >= a.req;
    if (a.id === "positivity_champion") unlocked = (progress.complimentsGenerated||0) >= a.req;
    if (a.id === "secret_finder") unlocked = !!progress.secretFound;
    return { ...a, unlocked };
  });

  const bg = dark ? "#0f0d0b" : "#fffaf5";
  const text = dark ? "#fef3c7" : "#1c1412";
  const surface = dark ? "#1c1917" : "#fff7ed";
  const border = dark ? "#292524" : "#fed7aa";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-16px) rotate(5deg); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .fadeUp { animation: fadeUp 0.6s ease both; }
    .float { animation: float 4s ease-in-out infinite; }
    .pulse { animation: pulse 2s ease-in-out infinite; }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #f97316; border-radius: 99px; }
  `;

  return (
    <div style={{ background:bg, color:text, minHeight:"100vh", fontFamily:"'DM Sans', sans-serif", transition:"all 0.3s ease" }}>
      <style>{css}</style>
      <Confetti active={confetti} />
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Top Bar */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background: dark ? "rgba(15,13,11,0.95)" : "rgba(255,250,245,0.95)",
        backdropFilter:"blur(12px)", borderBottom:`1px solid ${border}`,
        padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <button onClick={() => navigate("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:24 }}>🍽️</span>
          <span style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontWeight:700, color: dark ? "#fbbf24" : "#c2410c", letterSpacing:"-0.5px" }}>Foodie Companion</span>
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Secret trigger: double-click the spice emoji */}
          <button title="Secret..." style={{ background:"none", border:"none", cursor:"pointer", fontSize:20 }}
            onDoubleClick={() => { navigate("secret"); updateProgress("secretFound"); showConfetti(); showToast("🔮 Secret Food Stall unlocked!"); }}>
            🌶️
          </button>
          <button onClick={() => setDark(d => !d)} style={{ background:"none", border:`1px solid ${border}`, borderRadius:999, padding:"6px 12px", cursor:"pointer", fontSize:13, color:text, fontWeight:500 }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => setMobileNav(v => !v)} style={{ background:"none", border:`1px solid ${border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:18, color:text }}>
            {mobileNav ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNav && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:200,
          background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)",
        }} onClick={() => setMobileNav(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            position:"absolute", top:0, right:0, bottom:0, width:"75%", maxWidth:300,
            background: dark ? "#1c1917" : "#fffaf5",
            padding:"80px 24px 40px",
            display:"flex", flexDirection:"column", gap:4,
            animation:"fadeUp 0.2s ease",
          }}>
            <p style={{ fontSize:12, fontWeight:600, color:"#f97316", letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Navigation</p>
            {NAV.map(n => (
              <button key={n.id} onClick={() => navigate(n.id)} style={{
                background: page===n.id ? (dark?"#292524":"#fff7ed") : "none",
                border: page===n.id ? `1px solid #f97316` : "1px solid transparent",
                borderRadius:10, padding:"12px 16px", cursor:"pointer", textAlign:"left",
                color:text, fontFamily:"'DM Sans', sans-serif", fontSize:15, fontWeight:500,
                display:"flex", alignItems:"center", gap:10,
                transition:"all 0.2s",
              }}>
                <span style={{ fontSize:20 }}>{n.emoji}</span> {n.label}
              </button>
            ))}
            <div style={{ marginTop:"auto" }}>
              <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center" }}>Double-click 🌶️ for a secret</p>
            </div>
          </div>
        </div>
      )}

      {/* Pages */}
      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 0 80px" }}>
        {page === "home" && <HomePage dark={dark} navigate={navigate} />}
        {page === "mood" && <MoodPage dark={dark} surface={surface} border={border} text={text} updateProgress={updateProgress} showConfetti={showConfetti} />}
        {page === "food" && <FoodPage dark={dark} surface={surface} border={border} text={text} updateProgress={updateProgress} showToast={showToast} showConfetti={showConfetti} />}
        {page === "compliments" && <ComplimentsPage dark={dark} surface={surface} border={border} text={text} updateProgress={updateProgress} showConfetti={showConfetti} />}
        {page === "memories" && <MemoriesPage dark={dark} surface={surface} border={border} text={text} updateProgress={updateProgress} showToast={showToast} />}
        {page === "openwhen" && <OpenWhenPage dark={dark} surface={surface} border={border} text={text} />}
        {page === "achievements" && <AchievementsPage dark={dark} surface={surface} border={border} text={text} achievements={achievements} />}
        {page === "secret" && <SecretPage dark={dark} />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:100,
        background: dark ? "rgba(15,13,11,0.97)" : "rgba(255,250,245,0.97)",
        backdropFilter:"blur(12px)", borderTop:`1px solid ${border}`,
        padding:"8px 0 12px",
        display:"grid", gridTemplateColumns:`repeat(${NAV.length}, 1fr)`,
        maxWidth:480, margin:"0 auto",
      }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => navigate(n.id)} style={{
            background:"none", border:"none", cursor:"pointer", display:"flex",
            flexDirection:"column", alignItems:"center", gap:2, padding:"4px 2px",
          }}>
            <span style={{ fontSize:20 }}>{n.emoji}</span>
            <span style={{ fontSize:9, fontWeight:500, color: page===n.id ? "#f97316" : "#9ca3af", transition:"color 0.2s" }}>
              {n.label.split(" ")[0]}
            </span>
            {page===n.id && <div style={{ width:4, height:4, borderRadius:99, background:"#f97316", marginTop:2 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
function HomePage({ dark, navigate }) {
  const [typed, setTyped] = useState("");
  const full = "Hey Drashti ✨";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setTyped(full.slice(0,i)); if(i>=full.length) clearInterval(t); }, 80);
    return () => clearInterval(t);
  }, []);

  const floaters = ["🥣","🍜","🥪","🥘","🍦","🌶️","🧀","🍋","🌿","🥗"];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" }}>
      {/* Floating food emojis */}
      {floaters.map((f,i) => (
        <div key={i} style={{
          position:"absolute",
          left: `${5 + (i*9.5)}%`,
          top: `${10 + (i%3)*15}%`,
          fontSize: 28 + (i%3)*6,
          opacity: 0.15 + (i%4)*0.06,
          animation: `float ${3+i*0.4}s ease-in-out infinite`,
          animationDelay: `${i*0.3}s`,
          pointerEvents:"none",
          zIndex:0,
        }}>{f}</div>
      ))}

      <div style={{ position:"relative", zIndex:1, padding:"60px 24px 40px", textAlign:"center", animation:"fadeUp 0.8s ease" }}>
        {/* Big emoji */}
        <div style={{ fontSize:80, marginBottom:16, animation:"float 3s ease-in-out infinite" }}>🍽️</div>

        <h1 style={{
          fontFamily:"'Playfair Display', serif", fontWeight:700, fontSize:36,
          lineHeight:1.2, color: dark ? "#fbbf24" : "#c2410c",
          marginBottom:8, minHeight:50,
        }}>{typed}<span style={{ opacity: typed.length < full.length ? 1 : 0, transition:"opacity 0.1s", color:"#f97316" }}>|</span></h1>

        <div style={{
          fontFamily:"'Playfair Display', serif", fontStyle:"italic", fontSize:20,
          color: dark ? "#fdba74" : "#ea580c", marginBottom:24,
          animation:"fadeUp 0.8s ease 0.4s both",
        }}>Your Personalized Food Universe 🌟</div>

        <p style={{
          fontSize:15, lineHeight:1.7, color: dark ? "#d6d3d1" : "#57534e",
          maxWidth:340, margin:"0 auto 32px",
          animation:"fadeUp 0.8s ease 0.6s both",
        }}>
          A magical corner of the internet built just for you — full of street food stories, good vibes, and memories we've made together.
        </p>

        <button onClick={() => navigate("mood")} style={{
          background:"linear-gradient(135deg, #f97316, #c2410c)",
          color:"#fff", border:"none", borderRadius:999,
          padding:"14px 36px", fontSize:16, fontWeight:600,
          cursor:"pointer", letterSpacing:"0.5px",
          boxShadow:"0 8px 24px rgba(249,115,22,0.35)",
          animation:"fadeUp 0.8s ease 0.8s both, pulse 2s ease-in-out 1.6s infinite",
          fontFamily:"'DM Sans', sans-serif",
        }}>
          Start Your Journey →
        </button>
      </div>

      {/* Features grid */}
      <div style={{ padding:"0 20px", width:"100%", zIndex:1, animation:"fadeUp 0.8s ease 1s both" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:440, margin:"0 auto" }}>
          {[
            { emoji:"🌈", title:"Mood Corner", desc:"Food for every feeling", page:"mood" },
            { emoji:"🗺️", title:"Food Explorer", desc:"6 street food stories", page:"food" },
            { emoji:"💌", title:"Compliments", desc:"100 friendship notes", page:"compliments" },
            { emoji:"📸", title:"Memory Vault", desc:"Our favourite moments", page:"memories" },
            { emoji:"💙", title:"Open When...", desc:"Letters for every mood", page:"openwhen" },
            { emoji:"🏆", title:"Achievements", desc:"Unlock secret rewards", page:"achievements" },
          ].map(f => (
            <button key={f.page} onClick={() => navigate(f.page)} style={{
              background: dark ? "#1c1917" : "#fff7ed",
              border:`1px solid ${dark?"#292524":"#fed7aa"}`,
              borderRadius:16, padding:"16px 14px", cursor:"pointer", textAlign:"left",
              transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
            >
              <div style={{ fontSize:28, marginBottom:6 }}>{f.emoji}</div>
              <div style={{ fontSize:13, fontWeight:600, color: dark?"#fbbf24":"#c2410c", marginBottom:3 }}>{f.title}</div>
              <div style={{ fontSize:11, color: dark?"#78716c":"#9ca3af" }}>{f.desc}</div>
            </button>
          ))}
        </div>

        <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", margin:"24px 0 0", paddingBottom:20 }}>
          💡 Tip: Double-click 🌶️ in the top bar for a secret
        </p>
      </div>
    </div>
  );
}

// ── Mood ──────────────────────────────────────────────────────────────────────
function MoodPage({ dark, surface, border, text, updateProgress, showConfetti }) {
  const [selected, setSelected] = useState(null);
  const data = selected ? MOOD_DATA[selected.id] : null;

  const pick = m => {
    setSelected(m);
    updateProgress("moodsExplored", m.id);
    if (m.id === "happy" || m.id === "excited") showConfetti();
  };

  return (
    <div style={{ padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <SectionHeader emoji="🌈" title="Mood Corner" sub="How are you feeling right now?" dark={dark} />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:28 }}>
        {MOODS.map(m => (
          <button key={m.id} onClick={() => pick(m)} style={{
            background: selected?.id===m.id ? m.bg : (dark?"#1c1917":"#fffaf5"),
            border: `2px solid ${selected?.id===m.id ? m.color : (dark?"#292524":"#fed7aa")}`,
            borderRadius:14, padding:"16px 8px", cursor:"pointer", textAlign:"center",
            transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif",
            transform: selected?.id===m.id ? "scale(1.04)" : "scale(1)",
          }}>
            <div style={{ fontSize:32, marginBottom:4 }}>{m.emoji}</div>
            <div style={{ fontSize:12, fontWeight:600, color: selected?.id===m.id ? m.color : text }}>{m.label}</div>
          </button>
        ))}
      </div>

      {data && (
        <div key={selected.id} style={{ animation:"fadeUp 0.4s ease" }}>
          <div style={{ background: selected.bg, border:`1px solid ${selected.color}30`, borderRadius:20, padding:20, marginBottom:16 }}>
            <p style={{ fontSize:15, lineHeight:1.75, color:"#1c1412", fontStyle:"italic" }}>"{data.message}"</p>
          </div>

          <div style={{ background: dark?surface:"#fff7ed", border:`1px solid ${border}`, borderRadius:16, padding:16, marginBottom:12, display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:36 }}>🍽️</span>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:"#f97316", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Food for this mood</p>
              <p style={{ fontSize:16, fontWeight:600, color:text, marginBottom:4 }}>{data.food}</p>
              <p style={{ fontSize:13, color: dark?"#a8a29e":"#78716c", lineHeight:1.6 }}>{data.foodNote}</p>
            </div>
          </div>

          <div style={{ background: dark?"#1c1917":"#fffbeb", border:`1px solid #fef3c7`, borderRadius:16, padding:16 }}>
            <p style={{ fontSize:12, fontWeight:600, color:"#d97706", marginBottom:6 }}>✨ Quote for you</p>
            <p style={{ fontSize:14, color:text, fontStyle:"italic", lineHeight:1.6 }}>"{data.quote}"</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Food Explorer ─────────────────────────────────────────────────────────────
function FoodPage({ dark, surface, border, text, updateProgress, showToast, showConfetti }) {
  const [expanded, setExpanded] = useState(null);
  const [surprises, setSurprises] = useState({});

  const toggle = f => {
    const next = expanded===f.id ? null : f.id;
    setExpanded(next);
    if (next) updateProgress("foodViewed", f.id);
  };

  const reveal = (e, f) => {
    e.stopPropagation();
    setSurprises(p => ({ ...p, [f.id]: true }));
    showConfetti();
    showToast("🎉 Surprise revealed!");
  };

  return (
    <div style={{ padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <SectionHeader emoji="🗺️" title="Food Explorer" sub="Tap a card to discover street food stories" dark={dark} />

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {FOODS.map(f => (
          <div key={f.id} onClick={() => toggle(f)} style={{
            background: dark ? "#1c1917" : "#fff",
            border:`2px solid ${expanded===f.id ? f.color : (dark?"#292524":"#fed7aa")}`,
            borderRadius:20, overflow:"hidden", cursor:"pointer",
            transition:"all 0.3s ease",
            transform: expanded===f.id ? "scale(1.01)" : "scale(1)",
            boxShadow: expanded===f.id ? `0 8px 32px ${f.color}25` : "none",
          }}>
            {/* Card header */}
            <div style={{ display:"flex", alignItems:"center", padding:"16px 18px", gap:12 }}>
              <div style={{
                width:52, height:52, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:30, background:`${f.color}15`, border:`1px solid ${f.color}30`, flexShrink:0,
              }}>{f.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:17, fontWeight:700, color: dark?"#fbbf24":f.color }}>{f.name}</div>
                <div style={{ fontSize:12, color: dark?"#a8a29e":"#78716c", marginTop:2, lineHeight:1.5 }}>{f.desc}</div>
              </div>
              <div style={{ fontSize:20, transition:"transform 0.3s", transform: expanded===f.id?"rotate(180deg)":"rotate(0deg)", color:"#9ca3af" }}>⌄</div>
            </div>

            {/* Expanded content */}
            {expanded===f.id && (
              <div style={{ padding:"0 18px 18px", animation:"fadeUp 0.3s ease", borderTop:`1px solid ${f.color}20` }}>
                <div style={{ marginTop:14, padding:14, background:`${f.color}08`, borderRadius:12 }}>
                  <p style={{ fontSize:12, fontWeight:600, color:f.color, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>🧠 Fun Fact</p>
                  <p style={{ fontSize:13, color: dark?"#d6d3d1":"#44403c", lineHeight:1.7 }}>{f.fact}</p>
                </div>

                {surprises[f.id] ? (
                  <div style={{ marginTop:12, padding:14, background: dark?"#1f1d1b":"#fffbeb", border:"1px solid #fef3c7", borderRadius:12 }}>
                    <p style={{ fontSize:13, color: dark?"#fbbf24":"#92400e", lineHeight:1.7, fontStyle:"italic" }}>{f.surprise}</p>
                  </div>
                ) : (
                  <button onClick={e => reveal(e,f)} style={{
                    marginTop:12, width:"100%", background:`linear-gradient(135deg, ${f.color}, ${f.color}aa)`,
                    color:"#fff", border:"none", borderRadius:12, padding:"12px",
                    fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
                    letterSpacing:"0.5px",
                  }}>
                    ✨ Reveal Hidden Surprise
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compliments ───────────────────────────────────────────────────────────────
function ComplimentsPage({ dark, surface, border, text, updateProgress, showConfetti }) {
  const [shown, setShown] = useState([]);
  const [current, setCurrent] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const generate = () => {
    const pool = COMPLIMENTS.filter(c => !shown.includes(c));
    const pick = pool.length ? pool[Math.floor(Math.random()*pool.length)] : COMPLIMENTS[Math.floor(Math.random()*COMPLIMENTS.length)];
    setCurrent(pick);
    setShown(p => [...p, pick]);
    setAnimKey(k => k+1);
    updateProgress("complimentsGenerated", 1);
    if (shown.length % 9 === 8) showConfetti();
  };

  const colors = ["#f97316","#ef4444","#8b5cf6","#10b981","#3b82f6","#ec4899","#d97706"];
  const randomColor = current ? colors[COMPLIMENTS.indexOf(current) % colors.length] : "#f97316";

  return (
    <div style={{ padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <SectionHeader emoji="💌" title="Compliment Generator" sub="100 friendship notes, just for you" dark={dark} />

      <div style={{ textAlign:"center", marginBottom:28 }}>
        {current ? (
          <div key={animKey} style={{
            animation:"fadeUp 0.5s ease",
            background: dark ? "#1c1917" : "#fff",
            border:`2px solid ${randomColor}`,
            borderRadius:24, padding:"32px 24px", marginBottom:20,
            boxShadow:`0 12px 40px ${randomColor}20`,
          }}>
            <div style={{ fontSize:48, marginBottom:16 }}>💌</div>
            <p style={{
              fontFamily:"'Playfair Display', serif", fontSize:20, lineHeight:1.5,
              color: dark?"#fef3c7":"#1c1412", fontStyle:"italic",
            }}>
              "{current}"
            </p>
            <div style={{ marginTop:16, fontSize:12, color:"#9ca3af" }}>— Your Best Friend 🧡</div>
          </div>
        ) : (
          <div style={{
            background: dark?"#1c1917":"#fff7ed", border:`1px solid ${border}`,
            borderRadius:24, padding:"48px 24px", marginBottom:20,
          }}>
            <div style={{ fontSize:60, marginBottom:12, opacity:0.4 }}>💌</div>
            <p style={{ color: dark?"#78716c":"#9ca3af", fontSize:15 }}>Tap the button to receive a compliment</p>
          </div>
        )}

        <button onClick={generate} style={{
          background:"linear-gradient(135deg, #f97316, #ec4899)",
          color:"#fff", border:"none", borderRadius:999, padding:"14px 32px",
          fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
          boxShadow:"0 8px 24px rgba(249,115,22,0.35)", letterSpacing:"0.5px",
        }}>
          ✨ {current ? "Another One!" : "Generate Compliment"}
        </button>

        <div style={{ marginTop:16, display:"flex", gap:8, justifyContent:"center", alignItems:"center" }}>
          <div style={{ height:6, borderRadius:99, background:`linear-gradient(90deg, #f97316, #ec4899)`, width:`${(shown.length/COMPLIMENTS.length)*100}%`, maxWidth:200, transition:"width 0.5s ease" }} />
          <span style={{ fontSize:12, color:"#9ca3af" }}>{shown.length}/{COMPLIMENTS.length}</span>
        </div>
        {shown.length >= 10 && <p style={{ fontSize:12, color:"#f97316", marginTop:8 }}>🏆 Positivity Champion unlocked!</p>}
      </div>

      {shown.length > 1 && (
        <div>
          <p style={{ fontSize:12, fontWeight:600, color:"#9ca3af", letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>Previous ✨</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {shown.slice(-5).reverse().slice(1).map((c,i) => (
              <div key={i} style={{
                background: dark?"#1c1917":"#fffaf5", border:`1px solid ${border}`,
                borderRadius:12, padding:"12px 14px",
              }}>
                <p style={{ fontSize:13, color: dark?"#d6d3d1":"#57534e", fontStyle:"italic", lineHeight:1.6 }}>"{c}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Memory Vault ──────────────────────────────────────────────────────────────
function MemoriesPage({ dark, surface, border, text, updateProgress, showToast }) {
  const [memories, setMemories] = useLS("fc_memories", [
    { id:1, emoji:"🥣", title:"First Pani Puri Together", note:"Remember that first golgappa we had outside the college gate? The water was so spicy we both cried laughing. Best moment ever.", date:"2023", color:"#f97316" },
    { id:2, emoji:"🌙", title:"Late Night Maggi Sessions", note:"Those 2 AM Maggi bowls fixed everything — exam stress, heartbreak, boredom, you name it. The recipe was always the same: double masala, extra cheese, good company.", date:"2023", color:"#8b5cf6" },
    { id:3, emoji:"🚶‍♀️", title:"The Food Walk", note:"That Sunday we just walked around the city trying every street food stall we could find. We spent exactly ₹200 and it was the best day of the year.", date:"2024", color:"#10b981" },
  ]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title:"", note:"", emoji:"📸", color:"#f97316" });

  const save = () => {
    if (!form.title) return;
    const m = { ...form, id: Date.now(), date: new Date().getFullYear().toString() };
    setMemories(p => [m, ...p]);
    setAdding(false);
    setForm({ title:"", note:"", emoji:"📸", color:"#f97316" });
    updateProgress("memoriesAdded", 1);
    showToast("✨ Memory saved to the vault!");
  };

  const del = id => { setMemories(p => p.filter(m => m.id !== id)); showToast("Memory removed"); };

  const emojis = ["📸","🥣","🍜","🥪","🥘","🍦","🌙","☀️","🎉","💫","🌶️","🧀","🌿","💌","🏆"];
  const colors = ["#f97316","#ef4444","#8b5cf6","#10b981","#3b82f6","#ec4899","#d97706"];

  return (
    <div style={{ padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <SectionHeader emoji="📸" title="Memory Vault" sub="Our favourite moments, forever saved" dark={dark} />

      <button onClick={() => setAdding(v=>!v)} style={{
        width:"100%", background: adding ? (dark?"#292524":"#fef2f2") : "linear-gradient(135deg, #f97316, #c2410c)",
        color: adding ? "#ef4444" : "#fff",
        border: adding ? "1px solid #fecaca" : "none",
        borderRadius:16, padding:"14px", marginBottom:20,
        fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
        transition:"all 0.2s",
      }}>
        {adding ? "✕ Cancel" : "+ Add New Memory"}
      </button>

      {adding && (
        <div style={{
          background: dark?"#1c1917":"#fff7ed", border:`1px solid ${border}`,
          borderRadius:20, padding:20, marginBottom:20, animation:"fadeUp 0.3s ease",
        }}>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#f97316", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Choose an emoji</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {emojis.map(e => (
                <button key={e} onClick={() => setForm(f=>({...f,emoji:e}))} style={{
                  fontSize:20, padding:6, borderRadius:8, border:`1px solid ${form.emoji===e?"#f97316":(dark?"#292524":"#fed7aa")}`,
                  background: form.emoji===e ? "#fff7ed" : "transparent", cursor:"pointer",
                }}>{e}</button>
              ))}
            </div>
          </div>
          <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Memory title..." style={{
            width:"100%", padding:"12px 14px", borderRadius:12, border:`1px solid ${dark?"#292524":"#fed7aa"}`,
            background: dark?"#292524":"#fff", color:text, fontSize:14, marginBottom:10,
            fontFamily:"'DM Sans', sans-serif", outline:"none",
          }} />
          <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Write your memory..." rows={3} style={{
            width:"100%", padding:"12px 14px", borderRadius:12, border:`1px solid ${dark?"#292524":"#fed7aa"}`,
            background: dark?"#292524":"#fff", color:text, fontSize:14, resize:"none",
            fontFamily:"'DM Sans', sans-serif", marginBottom:10, outline:"none",
          }} />
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#f97316", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Colour</label>
            <div style={{ display:"flex", gap:8 }}>
              {colors.map(c => (
                <button key={c} onClick={() => setForm(f=>({...f,color:c}))} style={{
                  width:28, height:28, borderRadius:99, background:c, border:`3px solid ${form.color===c?"#1c1412":"transparent"}`,
                  cursor:"pointer",
                }} />
              ))}
            </div>
          </div>
          <button onClick={save} style={{
            width:"100%", background:"linear-gradient(135deg, #f97316, #c2410c)", color:"#fff",
            border:"none", borderRadius:12, padding:12, fontSize:15, fontWeight:600,
            cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
          }}>💾 Save Memory</button>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:16, position:"relative" }}>
        {/* Timeline line */}
        <div style={{ position:"absolute", left:28, top:0, bottom:0, width:2, background:`linear-gradient(180deg, #f97316, #8b5cf6)`, opacity:0.3, borderRadius:99 }} />

        {memories.map(m => (
          <div key={m.id} style={{ display:"flex", gap:14, animation:"fadeUp 0.4s ease" }}>
            <div style={{
              width:42, height:42, borderRadius:14, background:`${m.color}20`, border:`2px solid ${m.color}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, zIndex:1,
            }}>{m.emoji}</div>
            <div style={{
              flex:1, background: dark?"#1c1917":"#fff", border:`1px solid ${dark?"#292524":"#fed7aa"}`,
              borderRadius:16, padding:16, position:"relative",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color: dark?"#fbbf24":m.color }}>{m.title}</div>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>{m.date}</span>
                  <button onClick={() => del(m.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#9ca3af", padding:"0 2px" }}>✕</button>
                </div>
              </div>
              {m.note && <p style={{ fontSize:13, color: dark?"#a8a29e":"#78716c", lineHeight:1.7 }}>{m.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Open When ─────────────────────────────────────────────────────────────────
function OpenWhenPage({ dark, surface, border, text }) {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <SectionHeader emoji="💌" title="Open When..." sub="Letters written just for you" dark={dark} />

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {OPEN_WHEN.map(o => (
          <div key={o.id} style={{
            background: dark?"#1c1917":"#fff",
            border:`2px solid ${open===o.id ? o.color : (dark?"#292524":"#fed7aa")}`,
            borderRadius:20, overflow:"hidden", cursor:"pointer",
            transition:"all 0.3s", boxShadow: open===o.id ? `0 8px 32px ${o.color}20` : "none",
          }} onClick={() => setOpen(open===o.id ? null : o.id)}>
            <div style={{ padding:"18px 18px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:44, height:44, borderRadius:12, background:`${o.color}15`,
                border:`1px solid ${o.color}30`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:22, flexShrink:0,
              }}>{o.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color: dark?"#fbbf24":o.color }}>{o.title}</div>
              </div>
              <div style={{ fontSize:18, color:"#9ca3af", transition:"transform 0.3s", transform: open===o.id?"rotate(90deg)":"rotate(0deg)" }}>→</div>
            </div>
            {open===o.id && (
              <div key={o.id+"open"} style={{ padding:"0 18px 18px", animation:"fadeUp 0.3s ease", borderTop:`1px solid ${o.color}20` }}>
                <div style={{ background:`${o.color}08`, borderRadius:14, padding:16, marginTop:14 }}>
                  <p style={{ fontSize:14, lineHeight:1.85, color: dark?"#d6d3d1":"#374151", fontStyle:"italic", marginBottom:12 }}>{o.content}</p>
                  <p style={{ fontSize:13, color: o.color, fontWeight:500 }}>{o.extra}</p>
                </div>
                <div style={{ marginTop:10, textAlign:"right" }}>
                  <span style={{ fontSize:12, color:"#9ca3af" }}>— Written with love 💛</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Achievements ──────────────────────────────────────────────────────────────
function AchievementsPage({ dark, surface, border, text, achievements }) {
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div style={{ padding:"24px 20px", animation:"fadeUp 0.5s ease" }}>
      <SectionHeader emoji="🏆" title="Achievements" sub={`${unlocked}/${achievements.length} unlocked`} dark={dark} />

      <div style={{
        background: dark?"#1c1917":"#fff7ed", border:`1px solid ${border}`,
        borderRadius:20, padding:20, marginBottom:24, textAlign:"center",
      }}>
        <div style={{ fontSize:48, marginBottom:8 }}>{unlocked >= achievements.length ? "🌟" : "⭐"}</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color: dark?"#fbbf24":"#c2410c", marginBottom:4 }}>
          {unlocked >= achievements.length ? "All Unlocked!" : `${unlocked} of ${achievements.length}`}
        </div>
        <div style={{ height:8, background: dark?"#292524":"#fde68a", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg, #f97316, #c2410c)", borderRadius:99, width:`${(unlocked/achievements.length)*100}%`, transition:"width 0.6s ease" }} />
        </div>
        <p style={{ fontSize:12, color:"#9ca3af", marginTop:8 }}>{unlocked >= achievements.length ? "You're a Foodie Companion legend 🏆" : "Keep exploring to unlock more"}</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {achievements.map(a => (
          <div key={a.id} style={{
            background: a.unlocked ? (dark?"#1c1917":"#fff") : (dark?"#1c1917":"#fafaf9"),
            border:`2px solid ${a.unlocked ? "#f97316" : (dark?"#292524":"#e7e5e4")}`,
            borderRadius:16, padding:"16px 18px", display:"flex", alignItems:"center", gap:14,
            opacity: a.unlocked ? 1 : 0.55,
            transition:"all 0.3s",
          }}>
            <div style={{
              width:52, height:52, borderRadius:14,
              background: a.unlocked ? "#fff7ed" : (dark?"#292524":"#f5f5f4"),
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0,
              border:`1px solid ${a.unlocked?"#fed7aa":(dark?"#44403c":"#e7e5e4")}`,
            }}>{a.unlocked ? a.emoji : "🔒"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color: a.unlocked?(dark?"#fbbf24":"#c2410c"):(dark?"#57534e":"#9ca3af") }}>{a.title}</div>
              <div style={{ fontSize:12, color: dark?"#78716c":"#9ca3af", marginTop:2 }}>{a.desc}</div>
            </div>
            {a.unlocked && <div style={{ fontSize:22 }}>✅</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Secret ────────────────────────────────────────────────────────────────────
function SecretPage({ dark }) {
  const [stars] = useState(() => Array.from({length:20},(_,i)=>({
    x:Math.random()*100, y:Math.random()*80, size:Math.random()*8+4, delay:Math.random()*3,
  })));

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative", overflow:"hidden" }}>
      {stars.map((s,i) => (
        <div key={i} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          fontSize:s.size, animation:`float ${3+s.delay}s ease-in-out infinite`, animationDelay:`${s.delay}s`,
          opacity:0.4, pointerEvents:"none",
        }}>✨</div>
      ))}

      <div style={{ position:"relative", zIndex:1, textAlign:"center", animation:"fadeUp 0.8s ease" }}>
        <div style={{ fontSize:72, marginBottom:20, animation:"float 3s ease-in-out infinite" }}>🏮</div>

        <div style={{
          background: dark?"#1c1917":"#fff7ed",
          border:"2px solid #f97316", borderRadius:24, padding:"32px 28px",
          maxWidth:400, boxShadow:"0 20px 60px rgba(249,115,22,0.2)",
        }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🎉</div>
          <h1 style={{
            fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700,
            color: dark?"#fbbf24":"#c2410c", marginBottom:16, lineHeight:1.3,
          }}>
            Congratulations!
          </h1>
          <p style={{ fontSize:14, fontWeight:600, color: dark?"#fdba74":"#f97316", marginBottom:20, letterSpacing:1, textTransform:"uppercase" }}>
            You Found the Secret Food Stall 🌟
          </p>

          <div style={{
            background: dark?"#292524":"#fffbeb", border:"1px dashed #f59e0b",
            borderRadius:16, padding:20, marginBottom:20,
          }}>
            <p style={{ fontSize:13, lineHeight:1.85, color: dark?"#d6d3d1":"#374151", fontStyle:"italic" }}>
              "This special coupon is reserved for a future street-food adventure. Valid whenever life allows — whether it's a sunny Sunday, a random Tuesday, or the next time one of us is craving Pani Puri at midnight."
            </p>
          </div>

          <div style={{
            background:"linear-gradient(135deg, #f97316, #c2410c)",
            borderRadius:14, padding:"16px 20px",
            fontFamily:"'Playfair Display',serif", fontStyle:"italic",
            color:"#fff", fontSize:14, lineHeight:1.7, marginBottom:20,
          }}>
            🎟️ <strong>Secret Coupon #001</strong><br/>
            One unlimited street food adventure<br/>
            <span style={{ fontSize:11, opacity:0.8 }}>No expiry · Best enjoyed with best company</span>
          </div>

          <p style={{ fontSize:13, color: dark?"#a8a29e":"#78716c", lineHeight:1.7 }}>
            Until then, keep collecting smiles, memories, and great food. 🧡
          </p>

          <div style={{ marginTop:20, fontSize:24, letterSpacing:8 }}>🌶️🥣🍜🥪🥘🍦</div>
        </div>
      </div>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────
function SectionHeader({ emoji, title, sub, dark }) {
  return (
    <div style={{ marginBottom:24, textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:8 }}>{emoji}</div>
      <h2 style={{
        fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700,
        color: dark?"#fbbf24":"#c2410c", marginBottom:6, letterSpacing:"-0.5px",
      }}>{title}</h2>
      <p style={{ fontSize:14, color: dark?"#a8a29e":"#9ca3af" }}>{sub}</p>
    </div>
  );
}