// Written guides: formula sheets, career paths, how-tos and the usual yearly exam calendar.

export interface Guide {
  id: string;
  title: string;
  ur: string;
  icon: string;
  colors: [string, string];
  sections: { h: string; items: string[] }[];
}

export const GUIDES: Guide[] = [
  {
    id: 'career', title: 'What after Matric & Inter?', ur: 'میٹرک اور انٹر کے بعد کیا کریں؟', icon: 'map-marker-path', colors: ['#7C3AED', '#C084FC'],
    sections: [
      { h: 'After Matric (choose your Inter group)', items: [
        'FSc Pre-Medical (Biology, Chemistry, Physics) → MBBS, BDS, Pharm-D, DPT, Nursing, BS Biology fields (via MDCAT for MBBS/BDS)',
        'FSc Pre-Engineering (Maths, Physics, Chemistry) → BE / BSc Engineering (ECAT, NET, ETEA...), BS Physics/Maths, Architecture',
        'ICS (Computer Science, Maths, Physics or Statistics) → BS Computer Science, Software Engineering, IT, AI, Data Science, also engineering via ECAT',
        'I.Com (Commerce) → B.Com, BBA, ACCA / CA / CMA, banking and finance',
        'FA (Arts / Humanities) → BA / BS Social Sciences, LLB (with LAT), Mass Communication, Education, CSS later',
        'DAE (3-year diploma, Technical Board) → jobs as sub-engineer/technician, or BSc Engineering Technology',
        'Matric Tech / TEVTA / NAVTTC short courses → skilled trades and freelancing',
      ] },
      { h: 'After Inter', items: [
        'Medical: MDCAT → MBBS (5 years) / BDS (4 years). Also Pharm-D, DPT, MLT, Nursing (some need MDCAT, some their own test)',
        'Engineering: ECAT (UET), NET (NUST), GIKI, PIEAS, FAST, ETEA (KP), NED/MUET (Sindh) tests',
        'Computer Science: BS CS / SE / AI at FAST, NUST, COMSATS, ITU, PU and others',
        'Business: BBA / BS Accounting & Finance (IBA, LUMS, NUST, PU...) or ACCA / CA',
        'Law: 5-year LLB after passing LAT (HEC)',
        'Armed Forces: PMA Long Course, Navy, PAF after FSc (initial test + ISSB)',
        'Teaching / Education: BS Education, ADE / B.Ed',
      ] },
      { h: 'After Graduation', items: [
        'CSS (FPSC) or PMS / CCE (provincial commissions) for BS-17 officer posts',
        'PPSC / FPSC / SPSC / KPPSC / BPSC posts in your field',
        'MS / MPhil (HAT / GAT) and PhD; HEC and foreign scholarships',
        'Private sector, freelancing, startups',
      ] },
    ],
  },
  {
    id: 'result', title: 'How to Check Result & Roll No Slip', ur: 'رزلٹ اور رول نمبر سلپ کیسے دیکھیں', icon: 'clipboard-search-outline', colors: ['#0369A1', '#38BDF8'],
    sections: [
      { h: 'Result', items: [
        'Open your board from the Boards tab and tap "Result" – it opens the official site',
        'Enter your roll number (and sometimes name or CNIC/B-form) on the board\'s result page',
        'On result day board sites are slow: try again after a few minutes or early morning',
        'Most boards also publish the full gazette and position holders',
        'Boards also send results by SMS on their announced short code – the code is printed in the board\'s result notice',
      ] },
      { h: 'Roll Number Slip', items: [
        'Regular students usually get the slip from their school/college; private candidates download it from the board site',
        'You need your registration number / form number, or name + date of birth / CNIC',
        'Check your name, father\'s name, subjects, centre and photo. Report errors to the board before the exam',
        'Entry to the exam hall is not allowed without the roll number slip',
      ] },
      { h: 'Rechecking', items: [
        'Apply within the deadline (usually 10–15 days after the result) on the board\'s website or office',
        'Rechecking means re-counting marks and checking unmarked questions – papers are not re-marked',
        'Fee is per paper; keep your challan copy',
      ] },
    ],
  },
  {
    id: 'examday', title: 'Exam Day Checklist & Study Tips', ur: 'امتحان کی تیاری اور ٹپس', icon: 'checkbox-marked-circle-outline', colors: ['#047857', '#34D399'],
    sections: [
      { h: 'Take with you', items: ['Roll number slip (and a photocopy)', 'Original CNIC / B-form (entry tests and job tests)', 'Blue/black pens, pencil, eraser, sharpener, scale', 'Simple calculator only if allowed', 'Water and a light snack', 'Reach the centre 45–60 minutes early'] },
      { h: 'Never take', items: ['Mobile phone or smart watch (strictly banned in most tests)', 'Notes, chits or any written paper', 'Bluetooth / electronic devices'] },
      { h: 'Study plan that works', items: [
        'Make a timetable: hard subjects in the morning, revision at night',
        'Study 50 minutes, rest 10 (use the Study Timer in Tools)',
        'Do 30–50 MCQs a day per subject and review every wrong answer',
        'Solve at least 5 full past papers under exam time before the real exam',
        'Sleep 7–8 hours – memory is built while you sleep',
      ] },
      { h: 'MCQ technique', items: [
        'Read the full question and all four options',
        'Eliminate clearly wrong options first',
        'If there is no negative marking, never leave a question blank',
        'Mark doubtful questions and come back at the end',
        'Watch the clock: about 1 minute per MCQ',
      ] },
    ],
  },
  {
    id: 'physics', title: 'Physics Formula Sheet', ur: 'فزکس فارمولے', icon: 'atom', colors: ['#1D4ED8', '#60A5FA'],
    sections: [
      { h: 'Motion', items: ['v = u + at', 'S = ut + ½at²', 'v² = u² + 2aS', 'F = ma', 'p = mv,  Impulse = FΔt = Δp', 'Centripetal force F = mv²/r', 'Projectile: R = v²sin2θ/g,  H = v²sin²θ/2g,  T = 2v sinθ/g', 'W = mg,  g ≈ 9.8 m/s²', 'F = Gm₁m₂/r²'] },
      { h: 'Work & Energy', items: ['W = Fd cosθ', 'K.E. = ½mv²', 'P.E. = mgh', 'P = W/t = Fv', 'Efficiency = output / input × 100%', 'Hooke\'s law F = kx', 'Pressure P = F/A,  P = ρgh'] },
      { h: 'Waves & Optics', items: ['v = fλ', 'T = 1/f', 'Simple pendulum T = 2π√(l/g)', 'Mass-spring T = 2π√(m/k)', 'Lens/mirror: 1/f = 1/u + 1/v', 'Magnification m = v/u', 'Power of lens P = 1/f (metres)', 'Refractive index n = sin i / sin r = c/v'] },
      { h: 'Electricity & Magnetism', items: ['V = IR', 'P = VI = I²R = V²/R', 'Series R = R₁ + R₂ + …', 'Parallel 1/R = 1/R₁ + 1/R₂ + …', 'Q = It', 'Coulomb F = kq₁q₂/r²,  k = 9 × 10⁹', 'C = Q/V,  Energy = ½CV²', 'F = BIL sinθ,  F = qvB sinθ', 'Transformer Vs/Vp = Ns/Np', 'emf = −N ΔΦ/Δt'] },
      { h: 'Modern Physics', items: ['E = hf = hc/λ', 'E = mc²', 'Photoelectric: hf = φ + K.E.max', 'de Broglie λ = h/p', 'Half-life: N = N₀(½)^(t/T½)'] },
      { h: 'Heat', items: ['Q = mcΔT', 'Q = mL (latent heat)', 'K = °C + 273', '°F = 9/5 °C + 32', 'PV = nRT', 'Carnot efficiency η = 1 − T₂/T₁'] },
    ],
  },
  {
    id: 'chemistry', title: 'Chemistry Formula Sheet', ur: 'کیمسٹری فارمولے', icon: 'flask-outline', colors: ['#B45309', '#F59E0B'],
    sections: [
      { h: 'Mole concept', items: ['Moles = mass / molar mass', 'Moles = particles / 6.02 × 10²³', 'Moles of gas at STP = volume (dm³) / 22.4', 'Molarity M = moles of solute / volume of solution (dm³)', 'Dilution M₁V₁ = M₂V₂', '% yield = actual / theoretical × 100'] },
      { h: 'Gases', items: ['Boyle: P₁V₁ = P₂V₂', 'Charles: V₁/T₁ = V₂/T₂', 'General: P₁V₁/T₁ = P₂V₂/T₂', 'PV = nRT,  R = 8.314 J mol⁻¹ K⁻¹', 'Graham: r₁/r₂ = √(M₂/M₁)', 'Dalton: P_total = P₁ + P₂ + …'] },
      { h: 'Atomic structure', items: ['Max electrons in shell = 2n²', 'Order of filling: 1s 2s 2p 3s 3p 4s 3d 4p 5s …', 'E = hf,  c = fλ', 'Bohr radius rₙ = 0.529 n² Å'] },
      { h: 'Equilibrium & acids', items: ['Kc = [products]/[reactants] (powers = coefficients)', 'pH = −log[H⁺],  pOH = −log[OH⁻]', 'pH + pOH = 14 (25 °C)', 'Kw = [H⁺][OH⁻] = 1 × 10⁻¹⁴'] },
      { h: 'Thermo & kinetics', items: ['ΔH = ΣH(products) − ΣH(reactants)', 'Exothermic: ΔH negative; endothermic: ΔH positive', 'Rate = k[A]ᵐ[B]ⁿ', 'First-order half-life t½ = 0.693/k'] },
      { h: 'Electrochemistry', items: ['E°cell = E°cathode − E°anode', 'Oxidation at anode, reduction at cathode (OIL RIG)', 'Faraday: m = ZIt'] },
    ],
  },
  {
    id: 'maths', title: 'Maths Formula Sheet', ur: 'ریاضی فارمولے', icon: 'calculator-variant-outline', colors: ['#7C3AED', '#C084FC'],
    sections: [
      { h: 'Algebra', items: ['(a + b)² = a² + 2ab + b²', '(a − b)² = a² − 2ab + b²', 'a² − b² = (a + b)(a − b)', '(a + b)³ = a³ + 3a²b + 3ab² + b³', 'Quadratic: x = [−b ± √(b² − 4ac)] / 2a', 'Sum of roots = −b/a,  product = c/a', 'AP: aₙ = a + (n − 1)d,  Sₙ = n/2 [2a + (n − 1)d]', 'GP: aₙ = arⁿ⁻¹,  Sₙ = a(rⁿ − 1)/(r − 1)', 'ⁿPᵣ = n!/(n − r)!,  ⁿCᵣ = n!/[r!(n − r)!]'] },
      { h: 'Trigonometry', items: ['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = cosec²θ', 'sin 2θ = 2 sinθ cosθ', 'cos 2θ = cos²θ − sin²θ', 'sin(A ± B) = sinA cosB ± cosA sinB', 'π rad = 180°', 'Law of sines: a/sinA = b/sinB = c/sinC', 'Law of cosines: a² = b² + c² − 2bc cosA'] },
      { h: 'Coordinate geometry', items: ['Distance = √[(x₂ − x₁)² + (y₂ − y₁)²]', 'Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2)', 'Slope m = (y₂ − y₁)/(x₂ − x₁)', 'Line: y = mx + c', 'Circle: (x − h)² + (y − k)² = r²'] },
      { h: 'Calculus', items: ['d/dx xⁿ = nxⁿ⁻¹', 'd/dx sin x = cos x,  d/dx cos x = −sin x', 'd/dx eˣ = eˣ,  d/dx ln x = 1/x', 'Product rule: (uv)\' = u\'v + uv\'', 'Quotient rule: (u/v)\' = (u\'v − uv\')/v²', '∫xⁿ dx = xⁿ⁺¹/(n + 1) + c', '∫ 1/x dx = ln|x| + c'] },
      { h: 'Mensuration', items: ['Circle: area πr², circumference 2πr', 'Triangle area = ½ × base × height', 'Cylinder volume πr²h, curved surface 2πrh', 'Cone volume ⅓πr²h', 'Sphere volume 4/3 πr³, surface 4πr²', 'Simple interest = PRT/100', 'Compound amount = P(1 + R/100)ᵀ'] },
    ],
  },
  {
    id: 'biology', title: 'Biology Quick Revision', ur: 'بیالوجی فوری دہرائی', icon: 'dna', colors: ['#047857', '#34D399'],
    sections: [
      { h: 'Must-remember numbers', items: ['Human chromosomes: 46 (23 pairs)', 'Bones in adult: 206', 'RBC life: about 120 days', 'Normal BP: 120/80 mmHg', 'Normal body temperature: 37 °C', 'Heart chambers: 4', 'Glycolysis net ATP: 2', 'Aerobic respiration: about 36–38 ATP per glucose'] },
      { h: 'Organelles in one line', items: ['Mitochondria – ATP (powerhouse)', 'Ribosome – protein synthesis', 'Golgi – packaging and secretion', 'Lysosome – digestion (suicide bags)', 'Chloroplast – photosynthesis', 'Nucleolus – rRNA / ribosome assembly', 'Centriole – spindle in animal cells', 'Smooth ER – lipids, detoxification'] },
      { h: 'Vitamins & deficiency', items: ['A – night blindness', 'B1 – beriberi', 'B3 – pellagra', 'B12 – pernicious anaemia', 'C – scurvy', 'D – rickets (children), osteomalacia (adults)', 'K – poor blood clotting'] },
      { h: 'Hormones', items: ['Insulin (pancreas β-cells) – lowers blood glucose', 'Glucagon (α-cells) – raises blood glucose', 'Thyroxine (thyroid) – metabolism, needs iodine', 'ADH (posterior pituitary) – water reabsorption', 'Adrenaline (adrenal medulla) – fight or flight', 'Auxin – plant growth & tropisms; Ethylene – fruit ripening; ABA – stomata closing'] },
    ],
  },
];

export const guideById = (id: string) => GUIDES.find((g) => g.id === id);

/** The usual yearly calendar. Exact dates come from each board/body; this tells you what to watch for. */
export const CALENDAR: { months: string; items: string[] }[] = [
  { months: 'Jan – Feb', items: ['Matric/Inter admission forms & late-fee schedules close', 'Pre-board / send-up exams in schools & colleges', 'CSS written exam (FPSC) usually starts in February', 'NUST NET early series registration'] },
  { months: 'Mar – Apr', items: ['Matric (SSC) annual exams in most boards', 'Roll number slips issued 1–3 weeks before papers', 'NUST NET series continue'] },
  { months: 'Apr – Jun', items: ['Inter (HSSC) annual exams', 'University admission ads start (BS programmes)', 'Summer vacations – best time for entry-test preparation'] },
  { months: 'Jul – Aug', items: ['Matric results (Punjab and many boards)', 'ECAT (UET) is usually held in July', 'MDCAT registration (PMDC)', 'University BS admissions open widely'] },
  { months: 'Aug – Sep', items: ['Inter results', 'MDCAT test day (PMDC)', 'Supplementary exam forms after results', 'Merit lists of universities'] },
  { months: 'Oct – Dec', items: ['Supplementary (2nd annual) exams', 'Medical college merit lists & admissions', 'CSS MPT / application window (FPSC)', 'HEC & foreign scholarships deadlines (Fulbright, Chevening...)'] },
];

/** Grading schemes boards use. The new IBCC scheme is being rolled out board by board. */
export const GRADING = {
  ibcc: [
    ['96 – 100%', 'A++', 'Extraordinary'], ['91 – 95%', 'A+', 'Exceptional'], ['86 – 90%', 'A', 'Outstanding'], ['81 – 85%', 'B++', 'Excellent'],
    ['76 – 80%', 'B+', 'Very Good'], ['71 – 75%', 'B', 'Good'], ['61 – 70%', 'C', 'Fair'], ['51 – 60%', 'D', 'Satisfactory'],
    ['40 – 50%', 'E', 'Pass'], ['Below 40%', 'U', 'Ungraded / Fail'],
  ] as [string, string, string][],
  old: [
    ['80% and above', 'A-1', 'Outstanding'], ['70 – 79%', 'A', 'Excellent'], ['60 – 69%', 'B', 'Very Good'], ['50 – 59%', 'C', 'Good'],
    ['40 – 49%', 'D', 'Fair'], ['33 – 39%', 'E', 'Pass'], ['Below 33%', 'F', 'Fail'],
  ] as [string, string, string][],
};

export function gradeFor(pct: number, scheme: 'ibcc' | 'old'): string {
  if (scheme === 'old') {
    return pct >= 80 ? 'A-1' : pct >= 70 ? 'A' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : pct >= 33 ? 'E' : 'F';
  }
  const p = Math.round(pct);
  return p >= 96 ? 'A++' : p >= 91 ? 'A+' : p >= 86 ? 'A' : p >= 81 ? 'B++' : p >= 76 ? 'B+' : p >= 71 ? 'B' : p >= 61 ? 'C' : p >= 51 ? 'D' : p >= 40 ? 'E' : 'U';
}
