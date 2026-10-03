/**
 * PixelScene — layered SVG pixel-art night scene.
 * Matches Main_UI.png composition: deep navy sky, stars, moon, city skyline,
 * utility poles, neon signs building (left), developer at desk (foreground).
 * All layers are aria-hidden decorative elements.
 * Subtle CSS animations: star twinkle, shooting star, lamp glow.
 */
export function PixelScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox="0 0 1768 889"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* ── Sky gradient ── */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020810" />
            <stop offset="40%" stopColor="#050B14" />
            <stop offset="100%" stopColor="#0A1428" />
          </linearGradient>
          <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2EE59D" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2EE59D" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#2EE59D" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2EE59D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cityFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D1B2A" />
            <stop offset="100%" stopColor="#060E18" />
          </linearGradient>
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="windowBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1768" height="889" fill="url(#skyGrad)" />

        {/* ── Stars (various sizes, twinkle animation) ── */}
        {/* Large stars */}
        <g>
          {[
            [120, 45], [280, 30], [450, 60], [600, 25], [720, 75], [850, 40], [950, 20],
            [1050, 55], [1150, 35], [1280, 65], [1400, 28], [1520, 50], [1650, 38],
            [180, 90], [380, 110], [520, 85], [680, 115], [800, 95], [1000, 105],
            [1200, 88], [1350, 120], [1500, 95], [1620, 110],
          ].map(([x, y], i) => (
            <rect
              key={`star-lg-${i}`}
              x={x} y={y} width="2" height="2"
              fill="white"
              opacity={0.4 + (i % 5) * 0.12}
              style={{
                animation: `twinkle ${2.5 + (i % 4) * 0.8}s ease-in-out infinite`,
                animationDelay: `${(i * 0.37) % 3}s`,
              }}
            />
          ))}
          {/* Small stars */}
          {[
            [90, 55], [220, 80], [340, 45], [500, 95], [650, 65], [780, 30],
            [880, 80], [1000, 45], [1100, 75], [1300, 50], [1450, 85], [1580, 45],
            [155, 125], [260, 140], [420, 160], [570, 130], [730, 155], [900, 140],
            [1050, 160], [1210, 135], [1380, 150], [1530, 130],
          ].map(([x, y], i) => (
            <rect
              key={`star-sm-${i}`}
              x={x} y={y} width="1" height="1"
              fill="white"
              opacity={0.2 + (i % 6) * 0.08}
              style={{
                animation: `twinkle ${3 + (i % 5) * 0.6}s ease-in-out infinite`,
                animationDelay: `${(i * 0.5) % 4}s`,
              }}
            />
          ))}
        </g>

        {/* ── Shooting star ── */}
        <g style={{ animation: 'shooting-star 10s linear infinite', animationDelay: '3s' }}>
          <line x1="950" y1="80" x2="1020" y2="45" stroke="#B0E8FF" strokeWidth="1.5" opacity="0.9" />
          <line x1="952" y1="82" x2="1000" y2="60" stroke="white" strokeWidth="0.5" opacity="0.6" />
        </g>

        {/* ── Crescent moon (upper center-right) ── */}
        <g transform="translate(960, 55)">
          <circle cx="0" cy="0" r="28" fill="#1A2A44" />
          <circle cx="12" cy="-5" r="22" fill="#060E18" />
          {/* Pixel glow around moon */}
          <circle cx="-6" cy="3" r="30" fill="none" stroke="#2A4870" strokeWidth="1" opacity="0.4" />
        </g>

        {/* ── Distant mountains / hills (dark) ── */}
        <polygon
          points="0,540 120,420 240,480 360,395 480,460 600,410 680,450 760,380 880,430 960,360 1050,420 1150,370 1280,410 1400,350 1500,400 1650,360 1768,420 1768,560 0,560"
          fill="#060D18"
          opacity="0.9"
        />
        <polygon
          points="0,570 80,500 180,530 300,485 440,510 560,490 680,515 800,480 920,510 1080,478 1200,505 1350,485 1500,510 1650,490 1768,515 1768,580 0,580"
          fill="#080F1C"
        />

        {/* ── City skyline (center-right, mid-ground) ── */}
        {/* Building cluster 1 */}
        <rect x="780" y="440" width="60" height="140" fill="#0A1520" />
        <rect x="840" y="460" width="45" height="120" fill="#0D1B28" />
        <rect x="885" y="430" width="55" height="150" fill="#091219" />
        <rect x="940" y="450" width="50" height="130" fill="#0B1722" />
        <rect x="990" y="420" width="65" height="160" fill="#0A1520" />
        <rect x="1055" y="445" width="48" height="135" fill="#0C1924" />
        <rect x="1103" y="435" width="42" height="145" fill="#081018" />
        {/* Windows - warm (amber) */}
        {[
          [790, 455, 8, 6], [808, 455, 8, 6], [790, 475, 8, 6], [808, 475, 8, 6],
          [790, 495, 8, 6], [826, 495, 8, 6], [808, 515, 8, 6],
          [895, 445, 8, 6], [912, 445, 8, 6], [895, 465, 8, 6],
          [895, 485, 8, 6], [912, 485, 8, 6], [895, 505, 8, 6], [912, 505, 8, 6],
          [950, 465, 8, 6], [968, 465, 8, 6], [950, 485, 8, 6],
          [1000, 435, 10, 7], [1020, 435, 10, 7], [1000, 452, 10, 7], [1020, 452, 10, 7],
          [1000, 469, 10, 7], [1040, 469, 10, 7], [1000, 486, 10, 7],
          [1065, 460, 8, 6], [1082, 460, 8, 6], [1065, 480, 8, 6],
          [1113, 450, 8, 6], [1130, 450, 8, 6], [1113, 470, 8, 6], [1130, 470, 8, 6],
        ].map(([x, y, w, h], i) => (
          <rect key={`w-amber-${i}`} x={x} y={y} width={w} height={h}
            fill="url(#windowGlow)" opacity={0.5 + (i % 3) * 0.15} />
        ))}
        {/* Windows - cool (blue) */}
        {[
          [848, 475, 8, 6], [866, 475, 8, 6], [848, 495, 8, 6],
          [850, 515, 8, 6], [868, 515, 8, 6],
          [968, 485, 8, 6], [968, 505, 8, 6],
          [1040, 452, 10, 7], [1040, 486, 10, 7],
          [1082, 480, 8, 6],
        ].map(([x, y, w, h], i) => (
          <rect key={`w-blue-${i}`} x={x} y={y} width={w} height={h}
            fill="url(#windowBlue)" opacity={0.4 + (i % 2) * 0.2} />
        ))}

        {/* ── Utility poles (crossing the scene) ── */}
        {/* Main pole (left area, supporting lamp) */}
        <rect x="598" y="300" width="4" height="280" fill="#0D1B2A" />
        {/* Cross arm */}
        <rect x="560" y="300" width="80" height="3" fill="#0D1B2A" />
        {/* Wires from pole */}
        <line x1="560" y1="303" x2="0" y2="370" stroke="#0A1528" strokeWidth="1.5" opacity="0.7" />
        <line x1="640" y1="303" x2="900" y2="340" stroke="#0A1528" strokeWidth="1.5" opacity="0.7" />
        <line x1="580" y1="303" x2="0" y2="420" stroke="#0A1528" strokeWidth="1.2" opacity="0.5" />
        {/* Second utility pole (right) */}
        <rect x="1140" y="340" width="4" height="240" fill="#0D1B2A" />
        <rect x="1110" y="342" width="68" height="3" fill="#0D1B2A" />
        <line x1="1110" y1="345" x2="650" y2="305" stroke="#0A1528" strokeWidth="1.2" opacity="0.5" />
        <line x1="1178" y1="345" x2="1768" y2="390" stroke="#0A1528" strokeWidth="1.2" opacity="0.5" />

        {/* ── Street lamp ── */}
        {/* Lamp post */}
        <rect x="600" y="280" width="3" height="25" fill="#2EE59D" opacity="0.7" />
        {/* Lamp head */}
        <rect x="594" y="275" width="16" height="6" rx="2" fill="#1A6B4A" />
        <rect x="597" y="278" width="10" height="4" fill="#2EE59D" opacity="0.9" />
        {/* Lamp glow cone */}
        <polygon
          points="594,281 610,281 630,380 574,380"
          fill="url(#lampCone)"
          style={{ animation: 'lamp-glow 4s ease-in-out infinite' }}
          filter="url(#softGlow)"
        />
        {/* Ground glow circle */}
        <ellipse cx="602" cy="380" rx="40" ry="12" fill="#2EE59D" opacity="0.06" />

        {/* ── Left building with neon signs ── */}
        {/* Building */}
        <rect x="0" y="260" width="130" height="310" fill="#06101A" />
        <rect x="0" y="260" width="128" height="308" fill="none" stroke="#0D2035" strokeWidth="1" />
        {/* Windows */}
        {[
          [12, 280, 20, 14], [42, 280, 20, 14], [72, 280, 20, 14], [102, 280, 20, 14],
          [12, 310, 20, 14], [42, 310, 20, 14], [72, 310, 20, 14], [102, 310, 14, 14],
          [12, 340, 20, 14], [42, 340, 20, 14], [72, 340, 20, 14],
          [12, 370, 20, 14], [42, 370, 20, 14], [102, 370, 20, 14],
          [12, 400, 20, 14], [72, 400, 20, 14], [102, 400, 20, 14],
          [12, 430, 20, 14], [42, 430, 20, 14], [72, 430, 20, 14], [102, 430, 20, 14],
        ].map(([x, y, w, h], i) => (
          <rect key={`lb-win-${i}`} x={x} y={y} width={w} height={h}
            fill={i % 3 === 0 ? 'url(#windowGlow)' : 'url(#windowBlue)'}
            opacity={0.45 + (i % 4) * 0.1} />
        ))}
        {/* Neon sign 1: OPEN SOURCE */}
        <rect x="0" y="465" width="135" height="32" rx="2" fill="#071A0E" stroke="#2EE59D" strokeWidth="1" />
        <text
          x="68" y="486" textAnchor="middle"
          style={{ fill: '#2EE59D', fontSize: '9px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.12em' }}
        >
          OPEN SOURCE
        </text>
        {/* Neon sign 2: BUILDS BETTER */}
        <rect x="0" y="503" width="135" height="32" rx="2" fill="#071A0E" stroke="#2EE59D" strokeWidth="1" />
        <text
          x="68" y="524" textAnchor="middle"
          style={{ fill: '#2EE59D', fontSize: '9px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.08em' }}
        >
          BUILDS BETTER
        </text>
        {/* Neon sign 3: DEVELOPERS */}
        <rect x="0" y="541" width="135" height="32" rx="2" fill="#071A0E" stroke="#2EE59D" strokeWidth="1" />
        <text
          x="68" y="562" textAnchor="middle"
          style={{ fill: '#2EE59D', fontSize: '9px', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '0.15em' }}
        >
          DEVELOPERS
        </text>
        {/* Foliage at bottom left */}
        <ellipse cx="30" cy="580" rx="35" ry="20" fill="#061510" />
        <ellipse cx="70" cy="575" rx="28" ry="16" fill="#071812" />
        <ellipse cx="110" cy="578" rx="25" ry="14" fill="#061510" />
        <ellipse cx="15" cy="570" rx="20" ry="12" fill="#081A14" />

        {/* ── Foreground developer (silhouette, bottom center-left) ── */}
        {/* Desk */}
        <rect x="260" y="660" width="250" height="8" fill="#0A1A28" />
        <rect x="265" y="668" width="4" height="80" fill="#081520" />
        <rect x="501" y="668" width="4" height="80" fill="#081520" />
        {/* Monitor */}
        <rect x="300" y="590" width="120" height="75" rx="3" fill="#050D18" stroke="#1A3040" strokeWidth="1.5" />
        <rect x="306" y="596" width="108" height="61" fill="#040D1A" />
        {/* Screen content (code glow) */}
        <rect x="308" y="598" width="80" height="3" fill="#2EE59D" opacity="0.6" />
        <rect x="308" y="604" width="60" height="3" fill="#2EE59D" opacity="0.4" />
        <rect x="308" y="610" width="90" height="3" fill="#38BDF8" opacity="0.3" />
        <rect x="308" y="616" width="50" height="3" fill="#2EE59D" opacity="0.5" />
        <rect x="308" y="622" width="70" height="3" fill="#38BDF8" opacity="0.3" />
        <rect x="308" y="628" width="40" height="3" fill="#2EE59D" opacity="0.6" />
        <rect x="308" y="634" width="65" height="3" fill="#2EE59D" opacity="0.4" />
        <rect x="308" y="640" width="55" height="3" fill="#38BDF8" opacity="0.3" />
        {/* Screen glow on desk */}
        <ellipse cx="360" cy="668" rx="55" ry="8" fill="#2EE59D" opacity="0.04" />
        {/* Monitor stand */}
        <rect x="352" y="665" width="16" height="6" fill="#0A1A28" />
        {/* Keyboard */}
        <rect x="295" y="655" width="90" height="10" rx="2" fill="#080F1C" stroke="#1A2A3C" strokeWidth="1" />
        {/* Mug */}
        <rect x="410" y="645" width="18" height="20" rx="2" fill="#0A1A28" stroke="#1A3040" strokeWidth="1" />
        <rect x="428" y="650" width="6" height="8" fill="none" stroke="#1A3040" strokeWidth="1" />
        {/* Developer silhouette - body/hoodie */}
        <ellipse cx="370" cy="645" rx="38" ry="50" fill="#040A14" />
        {/* Head */}
        <ellipse cx="360" cy="590" rx="22" ry="25" fill="#040A14" />
        {/* Backpack */}
        <rect x="388" y="600" width="35" height="45" rx="4" fill="#050C18" stroke="#0D2035" strokeWidth="1" />
        {/* GitHub logo on backpack */}
        <circle cx="405" cy="620" r="10" fill="none" stroke="#2EE59D" strokeWidth="1.5" opacity="0.6" />
        <circle cx="405" cy="617" r="4" fill="none" stroke="#2EE59D" strokeWidth="1" opacity="0.5" />
        {/* Sticker 1 */}
        <rect x="390" y="635" width="10" height="6" rx="1" fill="#14B8A6" opacity="0.4" />
        {/* Sticker 2 */}
        <rect x="403" y="635" width="8" height="6" rx="1" fill="#2EE59D" opacity="0.3" />
        {/* GFG text on hoodie */}
        <text
          x="363" y="650" textAnchor="middle"
          style={{ fill: '#2EE59D', fontSize: '8px', fontFamily: 'Space Mono, monospace', fontWeight: 700, opacity: 0.5 }}
        >
          GFG
        </text>

        {/* ── Black cat silhouette ── */}
        {/* Body */}
        <ellipse cx="440" cy="662" rx="16" ry="10" fill="#030810" />
        {/* Head */}
        <circle cx="453" cy="652" r="10" fill="#030810" />
        {/* Left ear */}
        <polygon points="446,644 443,636 450,643" fill="#030810" />
        {/* Right ear */}
        <polygon points="459,644 462,636 456,643" fill="#030810" />
        {/* Eyes */}
        <ellipse cx="449" cy="652" rx="2" ry="1.5" fill="#2EE59D" opacity="0.7" />
        <ellipse cx="457" cy="652" rx="2" ry="1.5" fill="#2EE59D" opacity="0.7" />
        {/* Tail */}
        <path d="M 425,660 Q 415,640 420,630" stroke="#030810" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* ── Dark overlay (left side over scene for text readability) ── */}
        <linearGradient id="leftOverlay" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#050B14" stopOpacity="0.72" />
          <stop offset="55%" stopColor="#050B14" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#050B14" stopOpacity="0" />
        </linearGradient>
        <rect x="0" y="0" width="700" height="889" fill="url(#leftOverlay)" />

        {/* ── Bottom ground/floor ── */}
        <rect x="0" y="740" width="1768" height="149" fill="#040912" />
        <rect x="0" y="740" width="1768" height="2" fill="#0A1E30" opacity="0.6" />
      </svg>
    </div>
  )
}
