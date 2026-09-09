/**
 * Comprehensive Syllabus Data for JEE Main, JEE Advanced, and KCET
 * Covers 11th and 12th standard Physics, Chemistry, and Mathematics.
 */

const SYLLABUS = [
    // ==========================================
    // PHYSICS - 11TH STANDARD
    // ==========================================
    {
        id: "phy_11_01",
        subject: "physics",
        standard: 11,
        title: "Units & Measurements",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 45,
        topics: [
            "Units of Measurement & SI Units",
            "Dimensional Analysis & Applications",
            "Errors in Measurement & Significant Figures",
            "Vernier Callipers & Screw Gauge"
        ]
    },
    {
        id: "phy_11_02",
        subject: "physics",
        standard: 11,
        title: "Motion in a Straight Line",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Position, Distance, Displacement & Speed",
            "Kinematic Equations of Motion",
            "Relative Velocity in 1D",
            "Motion Under Gravity & Graphs"
        ]
    },
    {
        id: "phy_11_03",
        subject: "physics",
        standard: 11,
        title: "Motion in a Plane",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Vector Addition & Components",
            "Projectile Motion (Ground & Incline)",
            "Uniform & Non-Uniform Circular Motion",
            "Relative Velocity in 2D"
        ]
    },
    {
        id: "phy_11_04",
        subject: "physics",
        standard: 11,
        title: "Laws of Motion",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Newton's Laws of Motion & Momentum",
            "Free Body Diagrams & Pulley Systems",
            "Friction (Static, Kinetic, Rolling)",
            "Circular Dynamics & Banking of Roads"
        ]
    },
    {
        id: "phy_11_05",
        subject: "physics",
        standard: 11,
        title: "Work, Energy & Power",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Work Done by Constant & Variable Forces",
            "Work-Energy Theorem",
            "Conservative & Non-Conservative Forces",
            "Potential Energy & Spring Dynamics",
            "Collisions (Elastic & Inelastic)"
        ]
    },
    {
        id: "phy_11_06",
        subject: "physics",
        standard: 11,
        title: "System of Particles & Rotational Motion",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 70,
        topics: [
            "Center of Mass & Motion",
            "Torque, Angular Momentum & Conservation",
            "Moment of Inertia & Parallel/Perpendicular Axes",
            "Rigid Body Rotation & Rolling Motion"
        ]
    },
    {
        id: "phy_11_07",
        subject: "physics",
        standard: 11,
        title: "Gravitation",
        category: "Mechanics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Universal Law of Gravitation",
            "Acceleration due to Gravity & Variations",
            "Gravitational Potential & Potential Energy",
            "Kepler's Laws of Planetary Motion",
            "Escape Velocity & Satellite Motion"
        ]
    },
    {
        id: "phy_11_08",
        subject: "physics",
        standard: 11,
        title: "Properties of Bulk Matter",
        category: "Properties of Matter",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Elasticity, Stress-Strain & Young's Modulus",
            "Pressure, Pascal's & Archimedes' Principle",
            "Viscosity, Stoke's Law & Terminal Velocity",
            "Surface Tension, Capillarity & Excess Pressure",
            "Bernoulli's Theorem & Applications"
        ]
    },
    {
        id: "phy_11_09",
        subject: "physics",
        standard: 11,
        title: "Thermodynamics",
        category: "Thermal Physics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Thermal Equilibrium & Zeroth Law",
            "First Law of Thermodynamics & Processes",
            "Work Done in Isothermal & Adiabatic Processes",
            "Second Law, Heat Engines & Carnot Cycle"
        ]
    },
    {
        id: "phy_11_10",
        subject: "physics",
        standard: 11,
        title: "Kinetic Theory",
        category: "Thermal Physics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 40,
        topics: [
            "Ideal Gas Laws & Postulates",
            "RMS, Average & Most Probable Speeds",
            "Degrees of Freedom & Equipartition of Energy",
            "Mean Free Path"
        ]
    },
    {
        id: "phy_11_11",
        subject: "physics",
        standard: 11,
        title: "Oscillations",
        category: "Waves & Oscillations",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Simple Harmonic Motion (SHM) Equations",
            "Energy in SHM (Kinetic & Potential)",
            "Simple & Spring Pendulums",
            "Damped & Forced Oscillations, Resonance"
        ]
    },
    {
        id: "phy_11_12",
        subject: "physics",
        standard: 11,
        title: "Waves",
        category: "Waves & Oscillations",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Transverse & Longitudinal Waves",
            "Wave Speed in Solids & Gases",
            "Superposition Principle & Beats",
            "Standing Waves in Strings & Organ Pipes",
            "Doppler Effect"
        ]
    },

    // ==========================================
    // PHYSICS - 12TH STANDARD
    // ==========================================
    {
        id: "phy_12_01",
        subject: "physics",
        standard: 12,
        title: "Electric Charges & Fields",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Coulomb's Law & Principle of Superposition",
            "Electric Field & Field Lines",
            "Electric Dipole & Torque in Uniform Field",
            "Electric Flux & Gauss's Law Applications"
        ]
    },
    {
        id: "phy_12_02",
        subject: "physics",
        standard: 12,
        title: "Electrostatic Potential & Capacitance",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Electric Potential due to Point Charge & Dipole",
            "Equipotential Surfaces & Potential Energy",
            "Capacitance of Parallel Plate Capacitors",
            "Combination of Capacitors & Dielectrics"
        ]
    },
    {
        id: "phy_12_03",
        subject: "physics",
        standard: 12,
        title: "Current Electricity",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 75,
        topics: [
            "Ohm's Law, Drift Velocity & Resistance",
            "Resistor Combinations & Color Code",
            "Kirchhoff's Laws & Circuit Solving",
            "Wheatstone Bridge, Meter Bridge & Potentiometer"
        ]
    },
    {
        id: "phy_12_04",
        subject: "physics",
        standard: 12,
        title: "Moving Charges & Magnetism",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Biot-Savart Law & Circular Coil Field",
            "Ampere's Circuital Law & Solenoid/Toroid",
            "Lorentz Force & Motion in Magnetic Field",
            "Galvanometer Conversion (Ammeter/Voltmeter)"
        ]
    },
    {
        id: "phy_12_05",
        subject: "physics",
        standard: 12,
        title: "Magnetism & Matter",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 40,
        topics: [
            "Bar Magnet & Magnetic Dipole Moment",
            "Earth's Magnetic Field Components",
            "Para, Dia & Ferromagnetic Materials",
            "Hysteresis Loop & Permanent Magnets"
        ]
    },
    {
        id: "phy_12_06",
        subject: "physics",
        standard: 12,
        title: "Electromagnetic Induction",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Faraday's Law & Lenz's Law",
            "Motional EMF & Eddy Currents",
            "Self & Mutual Inductance",
            "AC Generator Principle"
        ]
    },
    {
        id: "phy_12_07",
        subject: "physics",
        standard: 12,
        title: "Alternating Current",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Peak & RMS Values of AC",
            "Purely R, L, C Circuits & Phasors",
            "Series LCR Circuit & Resonance",
            "Power Factor & Transformers"
        ]
    },
    {
        id: "phy_12_08",
        subject: "physics",
        standard: 12,
        title: "Electromagnetic Waves",
        category: "Electromagnetism",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 35,
        topics: [
            "Displacement Current & Maxwell's Equations",
            "EM Wave Properties & Transverse Nature",
            "EM Spectrum Characteristics & Uses"
        ]
    },
    {
        id: "phy_12_09",
        subject: "physics",
        standard: 12,
        title: "Ray Optics & Optical Instruments",
        category: "Optics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 70,
        topics: [
            "Reflection, Spherical Mirrors & Formula",
            "Refraction, Total Internal Reflection & Prism",
            "Thin Lens Formula & Lens Maker's Formula",
            "Microscopes & Astronomical Telescopes"
        ]
    },
    {
        id: "phy_12_10",
        subject: "physics",
        standard: 12,
        title: "Wave Optics",
        category: "Optics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Huygens' Principle & Wavefronts",
            "Young's Double Slit Interference",
            "Single Slit Diffraction",
            "Polarization & Brewster's Law"
        ]
    },
    {
        id: "phy_12_11",
        subject: "physics",
        standard: 12,
        title: "Dual Nature of Radiation & Matter",
        category: "Modern Physics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Photoelectric Effect & Einstein's Equation",
            "Work Function & Cutoff Potential",
            "de Broglie Hypothesis & Matter Waves",
            "Davisson-Germer Experiment"
        ]
    },
    {
        id: "phy_12_12",
        subject: "physics",
        standard: 12,
        title: "Atoms",
        category: "Modern Physics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 45,
        topics: [
            "Alpha-particle Scattering & Rutherford Model",
            "Bohr Model of Hydrogen Atom",
            "Energy Levels & Atomic Spectra (Lyman, Balmer)",
            "de Broglie Explanation of Bohr Quantization"
        ]
    },
    {
        id: "phy_12_13",
        subject: "physics",
        standard: 12,
        title: "Nuclei",
        category: "Modern Physics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 45,
        topics: [
            "Nuclear Size, Composition & Density",
            "Mass Defect & Binding Energy Curve",
            "Radioactive Decay Law & Half-Life",
            "Nuclear Fission & Fusion"
        ]
    },
    {
        id: "phy_12_14",
        subject: "physics",
        standard: 12,
        title: "Semiconductor Electronics",
        category: "Modern Physics",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Energy Bands in Solids (Intrinsic & Extrinsic)",
            "p-n Junction Diode V-I Characteristics",
            "Half Wave & Full Wave Rectifiers",
            "Zener Diode as Voltage Regulator & Logic Gates"
        ]
    },

    // ==========================================
    // CHEMISTRY - 11TH STANDARD
    // ==========================================
    {
        id: "chem_11_01",
        subject: "chemistry",
        standard: 11,
        title: "Some Basic Concepts of Chemistry",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Mole Concept & Molar Mass",
            "Stoichiometry & Limiting Reagent",
            "Concentration Terms (Molarity, Molality, Mole Fraction)",
            "Empirical & Molecular Formulae"
        ]
    },
    {
        id: "chem_11_02",
        subject: "chemistry",
        standard: 11,
        title: "Structure of Atom",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Bohr Model of Hydrogen Atom",
            "Quantum Numbers & Electronic Configuration",
            "de Broglie Wavelength & Heisenberg Uncertainty",
            "Shapes of Atomic Orbitals & Aufbau Principle"
        ]
    },
    {
        id: "chem_11_03",
        subject: "chemistry",
        standard: 11,
        title: "Classification of Elements & Periodicity",
        category: "Inorganic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 45,
        topics: [
            "Periodic Trends in Atomic/Ionic Radii",
            "Ionization Enthalpy & Electron Gain Enthalpy",
            "Electronegativity & Valency Trends",
            "Periodic Classification of Elements"
        ]
    },
    {
        id: "chem_11_04",
        subject: "chemistry",
        standard: 11,
        title: "Chemical Bonding & Molecular Structure",
        category: "Inorganic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 70,
        topics: [
            "Lewis Structures & Formal Charge",
            "VSEPR Theory & Molecular Geometry",
            "Hybridization & Bond Angles",
            "Molecular Orbital Theory (MOT) & Bond Order",
            "Hydrogen Bonding & Dipole Moment"
        ]
    },
    {
        id: "chem_11_05",
        subject: "chemistry",
        standard: 11,
        title: "Thermodynamics",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "First Law of Thermodynamics, Enthalpy & Heat Capacity",
            "Hess's Law & Thermochemical Equations",
            "Second Law, Entropy & Spontaneity",
            "Gibbs Free Energy & Equilibrium"
        ]
    },
    {
        id: "chem_11_06",
        subject: "chemistry",
        standard: 11,
        title: "Equilibrium",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Law of Mass Action, Kp & Kc Relationships",
            "Le Chatelier's Principle & Applications",
            "pH Calculations, Weak Acids/Bases & Buffer Solutions",
            "Solubility Product (Ksp) & Common Ion Effect"
        ]
    },
    {
        id: "chem_11_07",
        subject: "chemistry",
        standard: 11,
        title: "Redox Reactions",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 40,
        topics: [
            "Oxidation Number Calculations",
            "Balancing Redox Reactions (Ion-Electron Method)",
            "Electrochemical Series Basics",
            "Redox Titrations"
        ]
    },
    {
        id: "chem_11_08",
        subject: "chemistry",
        standard: 11,
        title: "Organic Chemistry – Basic Principles",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 75,
        topics: [
            "IUPAC Nomenclature of Organic Compounds",
            "Inductive, Electromeric, Resonance & Hyperconjugation Effects",
            "Carbocations, Carbanions & Free Radicals",
            "Isomerism (Structural & Stereoisomerism)",
            "Purification & Qualitative/Quantitative Analysis"
        ]
    },
    {
        id: "chem_11_09",
        subject: "chemistry",
        standard: 11,
        title: "Hydrocarbons",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Alkanes: Preparation, Conformational Analysis",
            "Alkenes: Electrophilic Addition & Markovnikov's Rule",
            "Alkynes: Acidic Character & Addition Reactions",
            "Aromatic Hydrocarbons: Benzene Structure & Electrophilic Substitution"
        ]
    },

    // ==========================================
    // CHEMISTRY - 12TH STANDARD
    // ==========================================
    {
        id: "chem_12_01",
        subject: "chemistry",
        standard: 12,
        title: "Solutions",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Henry's Law & Raoult's Law",
            "Ideal & Non-Ideal Solutions",
            "Colligative Properties (Vapor Pressure, Boiling, Freezing, Osmotic)",
            "van 't Hoff Factor & Abnormal Molar Mass"
        ]
    },
    {
        id: "chem_12_02",
        subject: "chemistry",
        standard: 12,
        title: "Electrochemistry",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Galvanic Cells & Nernst Equation",
            "Conductance, Molar Conductivity & Kohlrausch's Law",
            "Faraday's Laws of Electrolysis",
            "Batteries, Fuel Cells & Corrosion"
        ]
    },
    {
        id: "chem_12_03",
        subject: "chemistry",
        standard: 12,
        title: "Chemical Kinetics",
        category: "Physical Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Rate of Reaction, Order & Molecularity",
            "Integrated Rate Equations (Zero & First Order)",
            "Half-Life Calculations",
            "Arrhenius Equation & Activation Energy",
            "Collision Theory of Reaction Rates"
        ]
    },
    {
        id: "chem_12_04",
        subject: "chemistry",
        standard: 12,
        title: "d & f Block Elements",
        category: "Inorganic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Electronic Configuration & General Trends of 3d Series",
            "Oxidation States, Catalytic & Magnetic Properties",
            "Potassium Dichromate & Potassium Permanganate",
            "Lanthanoids & Actinoids (Lanthanoid Contraction)"
        ]
    },
    {
        id: "chem_12_05",
        subject: "chemistry",
        standard: 12,
        title: "Coordination Compounds",
        category: "Inorganic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 70,
        topics: [
            "Werner's Theory & IUPAC Nomenclature",
            "Valence Bond Theory (VBT) & Hybridization",
            "Crystal Field Theory (CFT) & Octahedral/Tetrahedral Splitting",
            "Isomerism in Coordination Compounds",
            "Organometallics & Metal Carbonyls"
        ]
    },
    {
        id: "chem_12_06",
        subject: "chemistry",
        standard: 12,
        title: "Haloalkanes & Haloarenes",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Nomenclature & Preparation Methods",
            "SN1 & SN2 Mechanisms & Stereochemistry",
            "Elimination Reactions (Saytzeff Rule)",
            "Electrophilic Substitution of Haloarenes & Grignard Reagent"
        ]
    },
    {
        id: "chem_12_07",
        subject: "chemistry",
        standard: 12,
        title: "Alcohols, Phenols & Ethers",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Acidic Nature of Alcohols & Phenols",
            "Preparation & Distinguishing Tests (Lucas, Victor Meyer)",
            "Reimer-Tiemann & Kolbe's Reactions of Phenol",
            "Williamson Ether Synthesis & Cleavage by HI"
        ]
    },
    {
        id: "chem_12_08",
        subject: "chemistry",
        standard: 12,
        title: "Aldehydes, Ketones & Carboxylic Acids",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 75,
        topics: [
            "Nucleophilic Addition Reactions (HCN, NaHSO3, Grignard)",
            "Aldol Condensation & Cannizzaro Reaction",
            "Tollens' & Fehling's Tests for Aldehydes",
            "Acidic Strength of Carboxylic Acids & HVZ Reaction"
        ]
    },
    {
        id: "chem_12_09",
        subject: "chemistry",
        standard: 12,
        title: "Amines",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Basicity of Aliphatic & Aromatic Amines",
            "Hoffmann Bromamide Degradation & Gabriel Phthalimide",
            "Carbylamine Test & Hinsberg Test",
            "Diazonium Salts: Preparation & Synthetic Applications"
        ]
    },
    {
        id: "chem_12_10",
        subject: "chemistry",
        standard: 12,
        title: "Biomolecules",
        category: "Organic Chemistry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 45,
        topics: [
            "Carbohydrates: Glucose Structure, Anomers & Mutarotation",
            "Amino Acids, Peptide Bonds & Protein Structures",
            "Enzymes, Vitamins & Deficiencies",
            "Nucleic Acids (DNA, RNA Structures)"
        ]
    },

    // ==========================================
    // MATHEMATICS - 11TH STANDARD
    // ==========================================
    {
        id: "math_11_01",
        subject: "maths",
        standard: 11,
        title: "Sets",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 40,
        topics: [
            "Types of Sets, Subsets & Power Set",
            "Venn Diagrams & Set Operations",
            "Union, Intersection & Difference of Sets",
            "Practical Problems on Set Operations"
        ]
    },
    {
        id: "math_11_02",
        subject: "maths",
        standard: 11,
        title: "Relations & Functions",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Cartesian Product & Relations",
            "Domain, Codomain & Range of Functions",
            "Standard Graphs (Modulus, Greatest Integer, Signum)",
            "Algebra of Real Functions"
        ]
    },
    {
        id: "math_11_03",
        subject: "maths",
        standard: 11,
        title: "Trigonometric Functions",
        category: "Trigonometry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Radian & Degree Conversions",
            "Trigonometric Ratios & Compound Angle Formulae",
            "Multiple & Submultiple Angles",
            "Trigonometric Equations & General Solutions"
        ]
    },
    {
        id: "math_11_04",
        subject: "maths",
        standard: 11,
        title: "Complex Numbers",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Algebraic Properties & Modulus/Argument",
            "Polar & Euler Form of Complex Numbers",
            "Square Root of Complex Number",
            "De Moivre's Theorem & Cube Roots of Unity"
        ]
    },
    {
        id: "math_11_05",
        subject: "maths",
        standard: 11,
        title: "Linear Inequalities",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 35,
        topics: [
            "Linear Inequalities in One & Two Variables",
            "Graphical Solution of System of Inequalities",
            "Wavy Curve Method for Rational Inequalities"
        ]
    },
    {
        id: "math_11_06",
        subject: "maths",
        standard: 11,
        title: "Permutations & Combinations",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Fundamental Principle of Counting",
            "Permutations (Linear & Circular)",
            "Combinations & Properties of nCr",
            "Grouping, Distribution & Derangements"
        ]
    },
    {
        id: "math_11_07",
        subject: "maths",
        standard: 11,
        title: "Binomial Theorem",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Binomial Expansion for Positive Integral Index",
            "General & Middle Term Calculations",
            "Properties of Binomial Coefficients",
            "Binomial Theorem for Any Index Basics"
        ]
    },
    {
        id: "math_11_08",
        subject: "maths",
        standard: 11,
        title: "Sequences & Series",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Arithmetic Progression (AP) & Means",
            "Geometric Progression (GP) & Infinite GP",
            "Arithmetico-Geometric Progression (AGP)",
            "Sum to n terms of Special Series (Σn, Σn², Σn³)"
        ]
    },
    {
        id: "math_11_09",
        subject: "maths",
        standard: 11,
        title: "Straight Lines",
        category: "Coordinate Geometry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Slope, Angle between Lines & Collinearity",
            "Various Forms of Equation of a Line",
            "Distance of Point from a Line & Foot of Perpendicular",
            "Pair of Straight Lines Basics"
        ]
    },
    {
        id: "math_11_10",
        subject: "maths",
        standard: 11,
        title: "Conic Sections",
        category: "Coordinate Geometry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 70,
        topics: [
            "Circle: Center-Radius, General Form & Tangents",
            "Parabola: Standard Equations, Focus, Directrix, Tangent",
            "Ellipse: Standard Form, Eccentricity & Focus Properties",
            "Hyperbola: Standard Form, Asymptotes & Rectangular Hyperbola"
        ]
    },
    {
        id: "math_11_11",
        subject: "maths",
        standard: 11,
        title: "Introduction to 3D Geometry",
        category: "Coordinate Geometry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 35,
        topics: [
            "Coordinate Axes & Octants in 3D Space",
            "Distance Formula in 3D",
            "Section Formula in 3D"
        ]
    },
    {
        id: "math_11_12",
        subject: "maths",
        standard: 11,
        title: "Limits & Derivatives",
        category: "Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Intuitive Idea of Limits & L'Hopital's Rule",
            "Standard Limits (Algebraic, Trig, Exponential)",
            "First Principle of Differentiation",
            "Product & Quotient Rules of Derivatives"
        ]
    },
    {
        id: "math_11_13",
        subject: "maths",
        standard: 11,
        title: "Statistics",
        category: "Statistics & Probability",
        jeeMain: true,
        jeeAdvanced: false,
        kcet: true,
        targetPyqs: 40,
        topics: [
            "Measures of Central Tendency (Mean, Median, Mode)",
            "Mean Deviation & Standard Deviation",
            "Variance & Coefficient of Variation"
        ]
    },
    {
        id: "math_11_14",
        subject: "maths",
        standard: 11,
        title: "Probability",
        category: "Statistics & Probability",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 45,
        topics: [
            "Sample Space & Events",
            "Axiomatic Approach to Probability",
            "Addition Theorem of Probability"
        ]
    },

    // ==========================================
    // MATHEMATICS - 12TH STANDARD
    // ==========================================
    {
        id: "math_12_01",
        subject: "maths",
        standard: 12,
        title: "Relations & Functions (12th)",
        category: "Algebra & Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Types of Relations: Reflexive, Symmetric, Transitive & Equivalence",
            "Types of Functions: One-one (Injective), Onto (Surjective) & Bijective",
            "Composition of Functions & Invertible Functions",
            "Binary Operations"
        ]
    },
    {
        id: "math_12_02",
        subject: "maths",
        standard: 12,
        title: "Inverse Trigonometric Functions",
        category: "Trigonometry",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 50,
        topics: [
            "Domain, Range & Principal Value Branches",
            "Graphs of Inverse Trigonometric Functions",
            "Properties of Inverse Trigonometric Functions",
            "Simplification & Equation Solving"
        ]
    },
    {
        id: "math_12_03",
        subject: "maths",
        standard: 12,
        title: "Matrices",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Types of Matrices & Matrix Operations",
            "Transpose, Symmetric & Skew-Symmetric Matrices",
            "Elementary Row/Column Operations",
            "Invertible Matrices & Uniqueness of Inverse"
        ]
    },
    {
        id: "math_12_04",
        subject: "maths",
        standard: 12,
        title: "Determinants",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Expansion of Determinants & Properties",
            "Minors, Cofactors & Adjoint of Matrix",
            "Inverse of Matrix using Adjoint",
            "Cramer's Rule & Matrix Method for System of Linear Equations"
        ]
    },
    {
        id: "math_12_05",
        subject: "maths",
        standard: 12,
        title: "Continuity & Differentiability",
        category: "Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 70,
        topics: [
            "Continuity of Functions at a Point & Interval",
            "Differentiability & Chain Rule of Derivatives",
            "Implicit Differentiation & Logarithmic Differentiation",
            "Parametric Differentiation & Second Order Derivatives",
            "Rolle's & Lagrange's Mean Value Theorems"
        ]
    },
    {
        id: "math_12_06",
        subject: "maths",
        standard: 12,
        title: "Applications of Derivatives",
        category: "Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 75,
        topics: [
            "Rate of Change of Quantities",
            "Increasing & Decreasing Functions",
            "Tangents & Normals Equations",
            "Maxima & Minima (First & Second Derivative Tests)",
            "Applied Word Problems on Maxima/Minima"
        ]
    },
    {
        id: "math_12_07",
        subject: "maths",
        standard: 12,
        title: "Integrals",
        category: "Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 80,
        topics: [
            "Indefinite Integrals & Standard Forms",
            "Integration by Substitution, Parts & Partial Fractions",
            "Definite Integrals as Limit of a Sum",
            "Properties of Definite Integrals & King's Property",
            "Reduction Formulae Basics"
        ]
    },
    {
        id: "math_12_08",
        subject: "maths",
        standard: 12,
        title: "Applications of Integrals",
        category: "Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 55,
        topics: [
            "Area Under Simple Curves (Parabolas, Circles, Ellipses)",
            "Area Between Two Curves",
            "Symmetrical Area Calculations"
        ]
    },
    {
        id: "math_12_09",
        subject: "maths",
        standard: 12,
        title: "Differential Equations",
        category: "Calculus",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 60,
        topics: [
            "Order & Degree of Differential Equations",
            "Formation of Differential Equations",
            "Variable Separable & Homogeneous Differential Equations",
            "First Order Linear Differential Equations (Integrating Factor)"
        ]
    },
    {
        id: "math_12_10",
        subject: "maths",
        standard: 12,
        title: "Vector Algebra",
        category: "Vectors & 3D",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Types of Vectors, Position Vectors & Direction Cosines",
            "Dot (Scalar) Product & Projection of Vectors",
            "Cross (Vector) Product & Area of Parallelogram/Triangle",
            "Scalar Triple Product & Vector Triple Product"
        ]
    },
    {
        id: "math_12_11",
        subject: "maths",
        standard: 12,
        title: "Three Dimensional Geometry",
        category: "Vectors & 3D",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 75,
        topics: [
            "Direction Cosines & Direction Ratios",
            "Equation of Line in 3D (Vector & Cartesian)",
            "Shortest Distance between Skew Lines",
            "Equation of Plane in Various Forms",
            "Angle between Lines/Planes & Line of Intersection"
        ]
    },
    {
        id: "math_12_12",
        subject: "maths",
        standard: 12,
        title: "Linear Programming",
        category: "Algebra",
        jeeMain: true,
        jeeAdvanced: false,
        kcet: true,
        targetPyqs: 35,
        topics: [
            "Mathematical Formulation of LPP",
            "Feasible Region & Corner Point Method",
            "Bounded & Unbounded Region Solutions"
        ]
    },
    {
        id: "math_12_13",
        subject: "maths",
        standard: 12,
        title: "Probability (12th)",
        category: "Statistics & Probability",
        jeeMain: true,
        jeeAdvanced: true,
        kcet: true,
        targetPyqs: 65,
        topics: [
            "Conditional Probability & Multiplication Theorem",
            "Independent Events & Total Probability Theorem",
            "Baye's Theorem & Applications",
            "Random Variables, Probability Distribution & Mean/Variance",
            "Binomial Distribution (Bernoulli Trials)"
        ]
    }
];

// Helper utilities for syllabus
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SYLLABUS;
}
