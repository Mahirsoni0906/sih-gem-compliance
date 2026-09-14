export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  summary: string;
  keyTakeaways: string[];
  simulationStep?: {
    actionLabel: string;
    screenTitle: string;
    screenDescription: string;
    portalRoute?: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingCourse {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'buyer' | 'seller' | 'statutory' | 'msme';
  categoryLabel: string;
  targetAudience: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  duration: string;
  languages: string[];
  enrolledCount: number;
  rating: number;
  badge: string;
  isPopular?: boolean;
  isCertified?: boolean;
  certificationLevel?: string;
  overview: string;
  modules: CourseModule[];
  quiz: QuizQuestion[];
}

export interface WebinarSession {
  id: string;
  title: string;
  dayTime: string;
  date: string;
  targetRole: 'Buyer' | 'Seller' | 'All';
  trainerName: string;
  trainerTitle: string;
  language: string;
  seatsLeft: number;
  sessionLink: string;
}

export interface TrainingResource {
  id: string;
  title: string;
  format: 'PDF Manual' | 'SOP' | 'Gazette' | 'Checklist';
  size: string;
  category: string;
  description: string;
}

// ----------------------------------------------------------------------
// Master Course Catalog
// ----------------------------------------------------------------------
export const GEM_TRAINING_COURSES: TrainingCourse[] = [
  // 1. BUYER LEVEL 1
  {
    id: 'crs-b1',
    code: 'GEM-B101',
    title: 'GeM Buyer Foundation & Primary User Onboarding',
    subtitle: 'Official Level-1 Buyer Certification for Government Officials & HODs',
    category: 'buyer',
    categoryLabel: 'Buyer Certification',
    targetAudience: 'Primary Users, HODs, Central & State Govt Officers',
    level: 'Beginner',
    duration: '45 mins • 4 Modules',
    languages: ['English', 'Hindi', 'Gujarati', 'Bengali', 'Tamil'],
    enrolledCount: 38420,
    rating: 4.9,
    badge: 'Level-1 Certified',
    isPopular: true,
    isCertified: true,
    certificationLevel: 'Four-Level Buyer Certification: Level 1 (Foundation)',
    overview: 'Learn how to set up an official Government Department on GeM, manage organizational structure, create Secondary Users (Buyers, Consignees, DDOs, PAOs), and assign financial delegation limits strictly compliant with GFR 2017.',
    modules: [
      {
        id: 'b1-m1',
        title: 'Module 1: Sovereign Mandate & Legal Framework (GFR Rule 149)',
        duration: '10 mins',
        summary: 'Understanding the statutory mandate under Rule 149 of General Financial Rules (GFR 2017) which makes procurement through GeM mandatory for all Central Ministries and CPSEs.',
        keyTakeaways: [
          'Mandatory nature of GeM procurement under GFR 149',
          'Thresholds for Direct Purchase (up to ₹25,000 / ₹5,00,000 for automobiles)',
          'Role and accountability of the Primary User as Head of Office'
        ],
        simulationStep: {
          actionLabel: 'Verify Department Onboarding',
          screenTitle: 'Primary User Verification Console',
          screenDescription: 'Cross-checking official NIC/GOV email address with official government directory.',
          portalRoute: 'registration-page'
        }
      },
      {
        id: 'b1-m2',
        title: 'Module 2: Secondary User Creation & Role Hierarchy',
        duration: '12 mins',
        summary: 'Assigning Buyer, Consignee, and Paying Authority (PAO/DDO) roles with strict segregation of procurement duties.',
        keyTakeaways: [
          'Difference between Buyer (procuring) and Consignee (receiving goods)',
          'Mapping DDO PFMS codes for direct payment integration',
          'Enforcing Two-Person verification for large order approvals'
        ]
      },
      {
        id: 'b1-m3',
        title: 'Module 3: Procurement Modes Overview (Direct, L1 & Bids)',
        duration: '13 mins',
        summary: 'Step-by-step guidance on selecting the appropriate mode of procurement based on order value and product availability.',
        keyTakeaways: [
          'Direct Purchase for orders up to ₹25,000',
          'L1 comparison among at least 3 distinct OEMs for orders between ₹25,000 and ₹5,00,000',
          'Mandatory e-Bidding / Reverse Auction (RA) for orders above ₹5,00,000'
        ]
      },
      {
        id: 'b1-m4',
        title: 'Module 4: Incident Management & Governance',
        duration: '10 mins',
        summary: 'Managing disputes, logging seller delivery defaults, and issuing Show Cause notices via GeM Incident Management.',
        keyTakeaways: [
          'Timeline for resolving seller incidents (5 days)',
          'Auto-escalation of unresolved complaints to GeM Vigilance wing',
          'Audit trail logging for PAC and Direct Purchase decisions'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'Under GFR 2017 Rule 149, procurement of goods and services through GeM is:',
        options: [
          'Optional for Central Ministries',
          'Mandatory for all Central Government Ministries and CPSEs',
          'Applicable only for orders above ₹50 Lakhs',
          'Restricted only to State Governments'
        ],
        correctIndex: 1,
        explanation: 'GFR 2017 Rule 149 makes procurement of goods and services through the GeM portal strictly mandatory for all Central Ministries, Departments, and CPSEs.'
      },
      {
        id: 2,
        question: 'What is the maximum threshold for Direct Purchase without comparison on GeM?',
        options: [
          '₹5,000',
          '₹25,000 (up to ₹5 Lakhs for specialized items like automobiles)',
          '₹1,00,000',
          '₹2,50,000'
        ],
        correctIndex: 1,
        explanation: 'Under GeM procurement guidelines, Direct Purchase without formal comparison is permitted up to ₹25,000 through any available supplier meeting quality and specification parameters.'
      },
      {
        id: 3,
        question: 'Can the same user hold both Buyer and Consignee roles for the same procurement order?',
        options: [
          'Yes, in all situations without restriction',
          'Strictly prohibited to ensure separation of buying and receipt scrutiny, except in specific authorized small offices',
          'Allowed only for financial bids',
          'Never allowed under any circumstances'
        ],
        correctIndex: 1,
        explanation: 'Segregation of duties between Buyer (who issues contract) and Consignee (who inspects and signs CRAC) is enforced to ensure transparent governance.'
      }
    ]
  },

  // 2. BUYER LEVEL 2: L1 COMPARISON & DIRECT PURCHASE
  {
    id: 'crs-b2',
    code: 'GEM-B202',
    title: 'Direct Purchase, L1 Comparison Engine & PAC Buying',
    subtitle: 'Level-2 Buyer Certification: Algorithmic Comparison & Justification Protocols',
    category: 'buyer',
    categoryLabel: 'Buyer Certification',
    targetAudience: 'Secondary Buyers, Indent Approvers, Procurement Executives',
    level: 'Intermediate',
    duration: '50 mins • 4 Modules',
    languages: ['English', 'Hindi'],
    enrolledCount: 29150,
    rating: 4.85,
    badge: 'Level-2 Certified',
    isCertified: true,
    certificationLevel: 'Four-Level Buyer Certification: Level 2 (Direct & L1 Procurement)',
    overview: 'Master the automated L1 comparison engine, Proprietary Article Certificate (PAC) justification workflows, and ensure audit compliance for purchases between ₹25,000 and ₹5,00,000.',
    modules: [
      {
        id: 'b2-m1',
        title: 'Module 1: The GeM Automated L1 Comparison Matrix',
        duration: '15 mins',
        summary: 'How GeM selects and compares at least 3 distinct manufacturers matching required technical specifications.',
        keyTakeaways: [
          'Filtering by Golden Parameters and technical specs',
          'Mandatory representation of at least 3 distinct manufacturers (OEMs)',
          'Generating an automated system-stamped comparison report'
        ]
      },
      {
        id: 'b2-m2',
        title: 'Module 2: Make-in-India (MII) Preference in L1 Evaluation',
        duration: '12 mins',
        summary: 'Applying purchase preference to Class-I Local Suppliers (>=50% local content) within the 20% margin of purchase preference.',
        keyTakeaways: [
          'Class-I (>50%) vs Class-II (20-50%) local supplier rules',
          'Giving Class-I local suppliers the opportunity to match L1 if within L1+20%',
          'Documenting MII statutory verification'
        ]
      },
      {
        id: 'b2-m3',
        title: 'Module 3: Proprietary Article Certificate (PAC) Buying',
        duration: '13 mins',
        summary: 'When and how a buyer can legally issue a PAC order for single-source procurement under strict GFR justification.',
        keyTakeaways: [
          'Statutory grounds for PAC (technical compatibility, sole manufacturer)',
          'Uploading Competent Financial Authority approval',
          'Audit trail safeguards against restrictive specification tailoring'
        ]
      },
      {
        id: 'b2-m4',
        title: 'Module 4: Financial Approval & Cart Checkout',
        duration: '10 mins',
        summary: 'Drafting sanctions, committing budget funds, and generating official GeM Contract (GeM-C) documents.',
        keyTakeaways: [
          'Blocking sanctioned funds to prevent payment delays',
          'Generating digitally sealed contracts with QR verification codes'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'For L1 purchase between ₹25,000 and ₹5,00,000, how many distinct manufacturers (OEMs) must be compared?',
        options: ['At least 2', 'At least 3', 'At least 5', 'Only 1 if delivery is urgent'],
        correctIndex: 1,
        explanation: 'GeM mandates comparison between at least 3 products from 3 distinct manufacturers meeting common functional specifications.'
      },
      {
        id: 2,
        question: 'What is the margin of purchase preference given to Class-I Local Suppliers under Make in India Order?',
        options: ['5%', '10%', '20%', '30%'],
        correctIndex: 2,
        explanation: 'Eligible Class-I Local Suppliers whose quoted price falls within L1 + 20% are invited to match the L1 price to receive purchase preference.'
      }
    ]
  },

  // 3. BUYER LEVEL 3: CUSTOM BIDS & REVERSE AUCTIONS
  {
    id: 'crs-b3',
    code: 'GEM-B303',
    title: 'Custom Bid Formulation, BOQ Tenders & Reverse Auction (RA)',
    subtitle: 'Level-3 Buyer Certification: High-Value Public Tendering & Price Discovery',
    category: 'buyer',
    categoryLabel: 'Buyer Certification',
    targetAudience: 'Tender Scrutiny Officers, Chief Procurement Officers, Bid Evaluators',
    level: 'Advanced',
    duration: '65 mins • 5 Modules',
    languages: ['English', 'Hindi'],
    enrolledCount: 21800,
    rating: 4.95,
    badge: 'Level-3 Certified',
    isCertified: true,
    certificationLevel: 'Four-Level Buyer Certification: Level 3 (Bidding & Reverse Auction)',
    overview: 'In-depth mastery of formulating custom technical specifications, Bill of Quantities (BOQ) uploads, two-cover cryptographic bidding, technical qualification scrutinies, and dynamic Reverse Auctions (RA).',
    modules: [
      {
        id: 'b3-m1',
        title: 'Module 1: Creating Custom Specifications & Avoiding Tailoring Violations',
        duration: '15 mins',
        summary: 'Formulating objective technical parameters without restrictive criteria that stifle competition under GFR Rule 144.',
        keyTakeaways: [
          'Objective functional parameters vs restrictive brand names',
          'BOQ spreadsheet template upload and auto-validation',
          'Setting realistic turnover and experience criteria'
        ]
      },
      {
        id: 'b3-m2',
        title: 'Module 2: The Two-Cover Cryptographic System',
        duration: '15 mins',
        summary: 'How asymmetric PKI encryption isolates technical and financial envelopes until formal evaluation committee sign-off.',
        keyTakeaways: [
          'Cover-1 (Technical bid, EMD, MII, statutory certificates)',
          'Cover-2 (Financial price schedule cryptographically locked)',
          'Opening technical bids with dual-officer digital key verification'
        ]
      },
      {
        id: 'b3-m3',
        title: 'Module 3: Reverse Auction (RA) Rules & Auto-Extension Protocols',
        duration: '20 mins',
        summary: 'Configuring dynamic price discovery via Reverse Auction, minimum bid decrements, and automatic 15-minute extensions.',
        keyTakeaways: [
          'Elimination rules in Reverse Auction',
          'Minimum decrement percentage setting (0.5% to 2%)',
          'Dynamic timer auto-extensions upon bids within last 15 minutes'
        ]
      },
      {
        id: 'b3-m4',
        title: 'Module 4: Evaluation Committee Sign-off & Award of Contract',
        duration: '15 mins',
        summary: 'Recording formal technical qualification, discrepancy resolution, and generating the Final Acceptance Letter.',
        keyTakeaways: [
          'Documenting reasons for rejection in audit ledger',
          'Generating digitally signed Letter of Acceptance (LoA)'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'In a Two-Cover bid on GeM, when is the financial bid opened?',
        options: [
          'Simultaneously with the technical bid',
          'Only after the technical evaluation committee has evaluated and qualified eligible bidders',
          'Before EMD verification',
          'At the sole discretion of the seller'
        ],
        correctIndex: 1,
        explanation: 'Financial envelopes remain cryptographically locked and can only be decrypted for bidders who are formally qualified in technical scrutiny.'
      }
    ]
  },

  // 4. BUYER LEVEL 4: CONTRACTS, CRAC & PAYMENTS
  {
    id: 'crs-b4',
    code: 'GEM-B404',
    title: 'Contract Management, CRAC Generation & Timely Payment Mandates',
    subtitle: 'Level-4 Buyer Certification: Inspection Scrutiny & PFMS Integration',
    category: 'buyer',
    categoryLabel: 'Buyer Certification',
    targetAudience: 'Consignees, Drawing & Disbursing Officers (DDOs), Accounts Officers',
    level: 'Mastery',
    duration: '40 mins • 3 Modules',
    languages: ['English', 'Hindi'],
    enrolledCount: 18900,
    rating: 4.88,
    badge: 'Level-4 Certified',
    isCertified: true,
    certificationLevel: 'Four-Level Buyer Certification: Level 4 (Contract & Payments)',
    overview: 'Learn the strict statutory guidelines governing Consignee Receipt and Acceptance Certificates (CRAC), the 10-day deemed approval rule, PFMS penny-drop validation, and avoiding interest penalties under MSME Samadhaan.',
    modules: [
      {
        id: 'b4-m1',
        title: 'Module 1: Goods Receipt & 10-Day Statutory CRAC Mandate',
        duration: '15 mins',
        summary: 'Generating the Consignee Receipt and Acceptance Certificate (CRAC) within 10 calendar days of delivery.',
        keyTakeaways: [
          'Physical inspection vs testing certificates',
          'Generating partial CRAC for damaged or non-compliant lots',
          'The 10-day deemed acceptance rule under GeM GTC'
        ]
      },
      {
        id: 'b4-m2',
        title: 'Module 2: PFMS Bill Generation & Online Payment Pipelines',
        duration: '15 mins',
        summary: 'Direct PFMS integration for online bill passing and Treasury disbursement within 10 days of CRAC.',
        keyTakeaways: [
          'Automated bill pushing to PFMS / State IFMS',
          'Digital sanction generation with DSC signing',
          'Statutory penal interest of 1% per month for delays beyond 10 days of CRAC'
        ]
      },
      {
        id: 'b4-m3',
        title: 'Module 3: Post-Contract Amendments & Performance Bank Guarantees',
        duration: '10 mins',
        summary: 'Handling delivery period extensions, liquidated damages (LD) deductions, and e-PBG releases.',
        keyTakeaways: [
          'Calculating Liquidated Damages (0.5% per week up to 10%)',
          'Automatic electronic release of e-PBG via SFMS bank integration'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'Within how many days of delivery must a Consignee issue the CRAC (Consignee Receipt and Acceptance Certificate)?',
        options: ['3 days', '10 days', '30 days', '45 days'],
        correctIndex: 1,
        explanation: 'Under GeM GTC Clause 12, Consignees must inspect goods and issue CRAC within 10 calendar days of delivery, failing which the system triggers deemed acceptance.'
      }
    ]
  },

  // 5. SELLER TRACK 1: ONBOARDING & VERIFICATION
  {
    id: 'crs-s1',
    code: 'GEM-S101',
    title: 'Seller Onboarding, Sovereign Identity Verification & Profile Creation',
    subtitle: 'Mastering Profile Creation, CBDT PAN Validation & Discrepancy Prevention',
    category: 'seller',
    categoryLabel: 'Seller & MSME Track',
    targetAudience: 'New Bidders, MSE Entrepreneurs, Startups, Corporate Vendors',
    level: 'Beginner',
    duration: '45 mins • 4 Modules',
    languages: ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'],
    enrolledCount: 46200,
    rating: 4.92,
    badge: 'Official Seller Guide',
    isPopular: true,
    isCertified: true,
    certificationLevel: 'GeM Certified Sovereign Vendor (Level 1: Profile & Statutory Compliance)',
    overview: 'Understand the primary statutory reasons for automated rejection during initial profile creation, how to match CBDT PAN records letter-for-letter, GSTIN verification, authorized signatory Aadhaar e-KYC, and bank penny-drop validation.',
    modules: [
      {
        id: 's1-m1',
        title: 'Module 1: Pre-Requisites & Constitution Selection',
        duration: '10 mins',
        summary: 'Choosing the correct business constitution (Proprietorship, Partnership, Private Limited, Trust/Society) and gathering verified credentials.',
        keyTakeaways: [
          'Selecting exact business constitution matching ITD filing',
          'Primary Authorized Signatory designation',
          'Active mobile number linked with Aadhaar for OTP e-KYC'
        ]
      },
      {
        id: 's1-m2',
        title: 'Module 2: Preventing Automated Rejections (CBDT PAN & GSTN)',
        duration: '15 mins',
        summary: 'How to ensure zero discrepancies between business name on PAN, GSTIN Active Regular status, and MCA-21 company master data.',
        keyTakeaways: [
          'Exact legal name string matching with CBDT / NSDL database',
          'Verifying GSTIN is Active Regular and not under Composition Scheme',
          'MCA-21 active status verification for corporate directors'
        ]
      },
      {
        id: 's1-m3',
        title: 'Module 3: Bank Account PFMS Penny-Drop Verification',
        duration: '10 mins',
        summary: 'Ensuring seamless automated penny-drop testing by banks to link your verified bank account for payment receipts.',
        keyTakeaways: [
          'Bank account name matching PAN legal name',
          'Valid IFSC code and active account status',
          'Understanding micro-deposit confirmation'
        ]
      },
      {
        id: 's1-m4',
        title: 'Module 4: Self-Service Discrepancy Rectification',
        duration: '10 mins',
        summary: 'Using GeM Compliance tools to resolve flagged parameters and elevate your profile readiness score to 98%.',
        keyTakeaways: [
          'Using the Discrepancy Resolver Console',
          'Attaching CA UDIN certificates for turnover verification',
          'Achieving Green Compliance readiness score before bidding'
        ],
        simulationStep: {
          actionLabel: 'Test Discrepancy Resolver',
          screenTitle: 'Interactive Discrepancy Resolver',
          screenDescription: 'Try rectifying a simulated turnover deficit with CA UDIN certification.',
          portalRoute: 'seller-page'
        }
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the primary cause of automated rejection during initial GeM seller profile creation?',
        options: [
          'Slow internet connection',
          'Legal entity name mismatch between GeM input and Income Tax / CBDT PAN database',
          'Lack of physical stamp paper',
          'Browser cookie expiration'
        ],
        correctIndex: 1,
        explanation: 'Automated algorithms cross-reference the entered legal name with the CBDT PAN database in real time. Any discrepancy in spelling, abbreviation (e.g. Pvt Ltd vs Private Limited), or initials causes automated rejection.'
      },
      {
        id: 2,
        question: 'Are sellers under the GST Composition Scheme eligible to bid in standard government supply tenders?',
        options: [
          'Yes, without any limitation',
          'No, standard government procurement requires Active Regular GSTIN capable of issuing tax invoices with Input Tax Credit (ITC)',
          'Only for software items',
          'Only if tender value is under ₹1,000'
        ],
        correctIndex: 1,
        explanation: 'Composition GSTINs cannot charge GST or pass on Input Tax Credit (ITC), making them ineligible for standard B2B/B2G public procurement on GeM.'
      }
    ]
  },

  // 6. SELLER TRACK 2: CATALOG MANAGEMENT & BRAND APPROVAL
  {
    id: 'crs-s2',
    code: 'GEM-S202',
    title: 'Product Catalog Management, Golden Parameters & Brand Approval',
    subtitle: 'Upload Products, Reseller Authorization (MAF) & Avoid Catalog Delisting',
    category: 'seller',
    categoryLabel: 'Seller & MSME Track',
    targetAudience: 'Catalog Managers, Manufacturers (OEMs), Authorized Resellers',
    level: 'Intermediate',
    duration: '50 mins • 4 Modules',
    languages: ['English', 'Hindi'],
    enrolledCount: 34100,
    rating: 4.87,
    badge: 'Catalog Specialist',
    isCertified: true,
    certificationLevel: 'GeM Certified Catalog Manager',
    overview: 'Learn how to publish products to the GeM Marketplace catalog, pair with existing catalog items, request OEM brand approval, declare BIS/ISI certifications, and adhere to strict pricing rules (MRP capping).',
    modules: [
      {
        id: 's2-m1',
        title: 'Module 1: OEM Brand Registration vs Reseller Pairing',
        duration: '15 mins',
        summary: 'Publishing as an Original Equipment Manufacturer (OEM) vs obtaining a Manufacturer Authorization Form (MAF) to resell existing brands.',
        keyTakeaways: [
          'Brand ownership verification and trademark registration',
          'Generating and verifying OEM vendor codes',
          'Reseller pairing workflows without duplicate catalog creation'
        ]
      },
      {
        id: 's2-m2',
        title: 'Module 2: Golden Parameters & Specification Compliance',
        duration: '15 mins',
        summary: 'Understanding non-negotiable Golden Parameters that govern search ranking and tender eligibility.',
        keyTakeaways: [
          'Mandatory technical attributes for product categories',
          'Uploading BIS, CE, ISO, and test lab compliance certificates',
          'Avoiding misleading specification claims'
        ]
      },
      {
        id: 's2-m3',
        title: 'Module 3: Pricing Disciplines & The Maximum Retail Price (MRP) Cap',
        duration: '10 mins',
        summary: 'Statutory mandate that offered GeM price must be lower than prevailing retail and open market prices.',
        keyTakeaways: [
          'GeM Price capping at least 10% below MRP',
          'The "Most Favoured Customer" clause in GeM GTC',
          'Penalties for price escalation and delisting'
        ]
      },
      {
        id: 's2-m4',
        title: 'Module 4: Catalog Hygiene & Preventing Administrative Delisting',
        duration: '10 mins',
        summary: 'Maintaining active inventory, lead times, warranty commitments, and responding to buyer catalog queries.',
        keyTakeaways: [
          'Periodic catalog refresh mandates',
          'Resolving buyer discrepancy notices within 48 hours'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'Under GeM General Terms and Conditions (GTC), the price quoted on GeM must be:',
        options: [
          'Higher than market price to cover logistics',
          'Lower than or equal to the price at which the seller sells to any other customer in India',
          'Equal to the MRP without discounts',
          'Negotiable post-contract'
        ],
        correctIndex: 1,
        explanation: 'GeM GTC enforces the Most Favoured Customer principle: the offered price on GeM must not exceed the price offered to any other buyer under similar conditions.'
      }
    ]
  },

  // 7. STATUTORY TRACK: GFR RULE 144(XI) & MII LOCAL CONTENT
  {
    id: 'crs-g1',
    code: 'GEM-G301',
    title: 'Statutory Scrutiny: GFR Rule 144(xi), Land Border Restrictions & MII Local Content',
    subtitle: 'High-Level Statutory Compliance for Bidders, Legal Officers & Procurement Committees',
    category: 'statutory',
    categoryLabel: 'Statutory & Sovereign Compliance',
    targetAudience: 'Compliance Officers, Legal Counsel, Procurement Scrutiny Wings',
    level: 'Advanced',
    duration: '55 mins • 4 Modules',
    languages: ['English', 'Hindi'],
    enrolledCount: 16500,
    rating: 4.96,
    badge: 'Legal & GFR Authority',
    isPopular: true,
    isCertified: true,
    certificationLevel: 'GeM Statutory Compliance & GFR 2017 Specialist',
    overview: 'Exhaustive examination of sovereign public procurement safeguards: Land border country restrictions under GFR Rule 144(xi), DPIIT clearance procedures, Make in India local content calculation methods, and CPPP debarment database cross-checks.',
    modules: [
      {
        id: 'g1-m1',
        title: 'Module 1: GFR 2017 Rule 144(xi) Land Border Mandate',
        duration: '15 mins',
        summary: 'Analyzing the Order (Public Procurement No. 1) issued by Department of Expenditure regarding bidders sharing a land border with India.',
        keyTakeaways: [
          'Definition of beneficial ownership (>10% shareholding/voting rights)',
          'Mandatory competent authority registration with DPIIT',
          'Security clearance from Ministry of Home Affairs (MHA) & MEA'
        ]
      },
      {
        id: 'g1-m2',
        title: 'Module 2: Make in India (MII) Local Content Calculation',
        duration: '15 mins',
        summary: 'Formulating audited local content declarations in accordance with DPIIT Order P-45021/2/2017-PP.',
        keyTakeaways: [
          'Formula: Local Content = [(Total Cost - Foreign Cost) / Total Cost] * 100',
          'Class-I (>=50%), Class-II (20-50%), Non-Local (<20%)',
          'Self-certification up to ₹10 Crores; Statutory Auditor / CA certificate for tenders above ₹10 Crores'
        ]
      },
      {
        id: 'g1-m3',
        title: 'Module 3: CPPP Debarment & Vigilance Cross-Checking',
        duration: '15 mins',
        summary: 'How GeM automated rules cross-check Central Public Procurement Portal (CPPP) blacklists to disqualify debarred entities.',
        keyTakeaways: [
          'Automatic disqualification of Bharat Precision Instruments (bid-003) under Order 2025/1109',
          'Debarment duration tracking and cross-ministry ban enforcement'
        ]
      },
      {
        id: 'g1-m4',
        title: 'Module 4: Audit Trails & Non-Repudiation under IT Act 2000',
        duration: '10 mins',
        summary: 'Legal evidentiary status of chronological audit logs, SHA-256 digital hashes, and Class-3 DSC cryptographic seals.',
        keyTakeaways: [
          'Sections 3 & 3A of Information Technology Act 2000',
          'Immutable ledger recording of all officer qualification decisions'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'Under GFR Rule 144(xi), a bidder from a country sharing a land border with India is eligible to bid ONLY IF:',
        options: [
          'They offer the lowest price',
          'They are registered with the competent authority (DPIIT) and have political/security clearance',
          'They have an Indian distributor',
          'The tender value is under ₹1 Crore'
        ],
        correctIndex: 1,
        explanation: 'Any bidder sharing a land border with India must be officially registered with DPIIT and possess valid political and security clearances from MEA and MHA.'
      },
      {
        id: 2,
        question: 'What percentage of domestic value addition qualifies a supplier as a Class-I Local Supplier?',
        options: ['At least 20%', 'At least 50%', 'At least 75%', '100% strictly'],
        correctIndex: 1,
        explanation: 'A Class-I Local Supplier must possess local content equal to or exceeding 50%, entitling them to purchase preference.'
      }
    ]
  },

  // 8. MSME & TREDS FINANCING
  {
    id: 'crs-m1',
    code: 'GEM-M201',
    title: 'MSME Public Procurement Policy, Udyam EMD Exemptions & TReDS Bill Factoring',
    subtitle: 'Unlocking 25% Procurement Quotas, Tender Fee Waivers & Instant Cashflow',
    category: 'msme',
    categoryLabel: 'MSME & Financial Inclusion',
    targetAudience: 'Micro & Small Enterprises, Women & SC/ST Entrepreneurs, CFOs',
    level: 'Intermediate',
    duration: '40 mins • 3 Modules',
    languages: ['English', 'Hindi', 'Marathi', 'Bengali'],
    enrolledCount: 27800,
    rating: 4.9,
    badge: 'MSME Empowerment',
    isCertified: true,
    certificationLevel: 'Certified GeM MSME Procurement Specialist',
    overview: 'Detailed exploration of the Public Procurement Policy for Micro & Small Enterprises (MSEs) Order 2012, 100% Earnest Money Deposit (EMD) waivers, 4% SC/ST and 3% Women entrepreneur sub-targets, and discounting invoices on TReDS platforms.',
    modules: [
      {
        id: 'm1-m1',
        title: 'Module 1: Public Procurement Policy for MSEs Order 2012',
        duration: '15 mins',
        summary: 'The 25% annual mandatory procurement reservation from MSEs and price matching preference (L1 + 15%).',
        keyTakeaways: [
          'Mandatory 25% quota for Micro and Small Enterprises',
          'Price matching opportunity for MSEs quoting within L1+15% to supply at least 25% order volume',
          'Zero tender fees and 100% EMD waiver with valid Udyam registration'
        ]
      },
      {
        id: 'm1-m2',
        title: 'Module 2: Linking Udyam Certificates to GeM Profiles',
        duration: '10 mins',
        summary: 'Verifying enterprise classification (Micro/Small/Medium) and major activity alignment.',
        keyTakeaways: [
          'Real-time mock API integration with Ministry of MSME Udyam portal',
          'ABC Industries (Micro Enterprise under UDYAM-GJ-01-008291) case study'
        ]
      },
      {
        id: 'm1-m3',
        title: 'Module 3: TReDS Invoice Factoring & Early Payment Flow',
        duration: '15 mins',
        summary: 'Connecting your GeM accepted invoices to RBI-regulated Trade Receivables Discounting Systems (RXIL, M1xchange, Invoicemart).',
        keyTakeaways: [
          'Getting paid within 48 hours of CRAC through competitive institutional bidding',
          'Without recourse to the MSME seller'
        ]
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'Under the Public Procurement Policy for MSEs, what percentage of annual procurement is reserved for Micro & Small Enterprises?',
        options: ['10%', '15%', '25%', '50%'],
        correctIndex: 2,
        explanation: 'Central Government Ministries, Departments, and CPSEs are statutorily required to procure at least 25% of their total annual procurement from Micro and Small Enterprises.'
      }
    ]
  }
];

// ----------------------------------------------------------------------
// Weekly Live Training Calendar Schedule
// ----------------------------------------------------------------------
export const GEM_LIVE_WEBINARS: WebinarSession[] = [
  {
    id: 'web-01',
    title: 'Weekly Masterclass: End-to-End Seller Onboarding & Profile Verification',
    dayTime: 'Every Tuesday • 11:00 AM - 12:30 PM IST',
    date: 'Tuesday, 17-Sep-2026',
    targetRole: 'Seller',
    trainerName: 'Shri Amitav Mukherjee',
    trainerTitle: 'Senior Master Trainer, GeM Capacity Building Wing',
    language: 'Hindi & English',
    seatsLeft: 42,
    sessionLink: 'https://gem.webex.com/meet/training-seller-onboarding'
  },
  {
    id: 'web-02',
    title: 'Buyer Clinic: Formulating Custom BOQ Tenders & Setting Non-Restrictive Specs',
    dayTime: 'Every Wednesday • 02:30 PM - 04:00 PM IST',
    date: 'Wednesday, 18-Sep-2026',
    targetRole: 'Buyer',
    trainerName: 'Dr. Sunita Deshmukh',
    trainerTitle: 'Director of Procurement Training, Department of Commerce',
    language: 'English',
    seatsLeft: 18,
    sessionLink: 'https://gem.webex.com/meet/training-buyer-bids'
  },
  {
    id: 'web-03',
    title: 'Sovereign Scrutiny: GFR Rule 144(xi), MII Calculation & Land Border Protocols',
    dayTime: 'Every Thursday • 03:00 PM - 04:30 PM IST',
    date: 'Thursday, 19-Sep-2026',
    targetRole: 'All',
    trainerName: 'Adv. R. Venkataraman',
    trainerTitle: 'Legal Advisor & Statutory Scrutiny Specialist',
    language: 'English',
    seatsLeft: 9,
    sessionLink: 'https://gem.webex.com/meet/training-statutory-gfr'
  },
  {
    id: 'web-04',
    title: 'MSME Special Clinic: Claiming EMD Exemptions & TReDS Instant Invoice Financing',
    dayTime: 'Every Friday • 11:30 AM - 01:00 PM IST',
    date: 'Friday, 20-Sep-2026',
    targetRole: 'Seller',
    trainerName: 'Smt. Priya Nair',
    trainerTitle: 'Lead Facilitator, MSME Samadhaan & TReDS Desk',
    language: 'Hindi & English',
    seatsLeft: 31,
    sessionLink: 'https://gem.webex.com/meet/training-msme-treds'
  },
  {
    id: 'web-05',
    title: 'Buyer Level-4 Intensive: Timely CRAC Generation & PFMS Payment Integration',
    dayTime: 'Every Saturday • 10:30 AM - 12:00 PM IST',
    date: 'Saturday, 21-Sep-2026',
    targetRole: 'Buyer',
    trainerName: 'Shri R. K. Saxena',
    trainerTitle: 'Ex-Financial Controller, ONGC Procurement Directorate',
    language: 'Hindi & English',
    seatsLeft: 27,
    sessionLink: 'https://gem.webex.com/meet/training-crac-payments'
  }
];

// ----------------------------------------------------------------------
// Downloadable Training Resources & Handbooks
// ----------------------------------------------------------------------
export const GEM_TRAINING_RESOURCES: TrainingResource[] = [
  {
    id: 'res-01',
    title: 'GeM Comprehensive Buyer Manual (Edition 2026)',
    format: 'PDF Manual',
    size: '8.4 MB',
    category: 'Buyer Guide',
    description: 'The definitive 180-page step-by-step guidebook covering user management, direct buying, L1 algorithmic comparison, bidding, and CRAC.'
  },
  {
    id: 'res-02',
    title: 'Seller Onboarding & Statutory Compliance Handout',
    format: 'Checklist',
    size: '1.8 MB',
    category: 'Seller Guide',
    description: 'Detailed pre-registration checklist to prevent automated rejection from CBDT PAN mismatches, cancelled GSTIN, or Aadhaar e-KYC errors.'
  },
  {
    id: 'res-03',
    title: 'Standard Operating Procedure: GFR Rule 144(xi) Land Border Country Vetting',
    format: 'SOP',
    size: '2.2 MB',
    category: 'Statutory Law',
    description: 'Official Department of Expenditure circular and scrutiny protocols for vetting beneficial ownership and DPIIT registration.'
  },
  {
    id: 'res-04',
    title: 'Public Procurement (Preference to Make in India) Order - Guidance Circular',
    format: 'Gazette',
    size: '3.1 MB',
    category: 'Industrial Policy',
    description: 'DPIIT guidelines on local content calculation formulas, statutory auditor certificates, and Class-I margin of purchase preference.'
  }
];
