export interface GeMService {
  id: string;
  title: string;
  category: 'Trending' | 'Emerging' | 'Core';
  domain: string;
  domainIcon: string;
  subTitle: string;
  billingModel: string;
  gemCategoryCode: string;
  statutoryRequirements: string[];
  description: string;
  popular?: boolean;
}

export const OFFICIAL_GEM_SERVICES: GeMService[] = [
  // Core / Trending
  {
    id: 'serv-001',
    title: 'Security Manpower Service (Version 2.0)',
    category: 'Trending',
    domain: 'Manpower & Security',
    domainIcon: '👮‍♂️',
    subTitle: 'Armed & Unarmed Security Guards, Head Guards & Field Supervisors',
    billingModel: 'Monthly Per Guard / Minimum Wage Act',
    gemCategoryCode: 'services_home_manp_se16760331',
    statutoryRequirements: [
      'Valid State / Central PSARA License',
      'Active EPFO & ESIC Registration with Nil Default',
      'Compliance with Code on Wages (Central / State Minimum Wage)',
      'Police Verification Certificate for all deployed personnel'
    ],
    description: 'Statutorily regulated round-the-clock security surveillance, access control, and asset protection for central ministries, state secretariats, and CPSEs.',
    popular: true
  },
  {
    id: 'serv-002',
    title: 'Short Term Cab & Taxi Hiring Services',
    category: 'Trending',
    domain: 'Transport & Fleet',
    domainIcon: '🚕',
    subTitle: 'Sedans, Premium SUVs, Hatchbacks & EV Cabs for Official Duty',
    billingModel: 'Daily / Package Rate (8hr/80km, 12hr/120km)',
    gemCategoryCode: 'services_home_ve54336454_shor',
    statutoryRequirements: [
      'Commercial Yellow-Plate Registration & All India Tourist Permit',
      'Valid Comprehensive Commercial Motor Insurance',
      'PUCC (Pollution Under Control Certificate)',
      'Commercial Driving License with clean background verification'
    ],
    description: 'On-demand spot booking of sanitized commercial taxis and executive sedans for ministry officials, visiting delegations, and inspection teams.',
    popular: true
  },
  {
    id: 'serv-003',
    title: 'Monthly Basis Cab & Taxi Hiring Services',
    category: 'Trending',
    domain: 'Transport & Fleet',
    domainIcon: '🚗',
    subTitle: 'Dedicated Monthly Fleet Deployment for Government Officials',
    billingModel: 'Fixed Monthly Retainer + Excess KM/Hour charges',
    gemCategoryCode: 'services_home_ve54336454_mont',
    statutoryRequirements: [
      'Motor Vehicles Act 1988 Compliance',
      'GPS/Telematics device connected to State Transport API',
      'Vehicle manufacturing year not older than 3 years',
      'Mandatory Fastag & Commercial Fitness Certificate'
    ],
    description: 'Long-term contracted chauffeur-driven fleets dedicated to senior bureaucrats, project monitoring units, and public sector directorates.',
    popular: true
  },
  {
    id: 'serv-004',
    title: 'Catering Service (Event Based)',
    category: 'Trending',
    domain: 'Catering & Hospitality',
    domainIcon: '🍽️',
    subTitle: 'High-Level Government Conferences, Summits & Official Banquets',
    billingModel: 'Per Plate / Per Person Menu Tier',
    gemCategoryCode: 'services_home_rest_ca18172618',
    statutoryRequirements: [
      'FSSAI State / Central Food Safety License',
      'Food Handler Medical Fitness & Hygiene Certification',
      'Compliance with Food Safety and Standards Regulations 2011',
      'GSTN registration with valid Tax Compliance Track Record'
    ],
    description: 'Full-service presidential, state, and departmental banqueting with multi-cuisine menus, trained steward staff, and hygiene-certified kitchens.',
    popular: true
  },
  {
    id: 'serv-005',
    title: 'Catering Service (Duration Based)',
    category: 'Trending',
    domain: 'Catering & Hospitality',
    domainIcon: '🍲',
    subTitle: 'Institutional Food, Mess & Canteen Operations for Colleges & Hospitals',
    billingModel: 'Monthly Per Inmate / Meal Day Basis',
    gemCategoryCode: 'services_home_rest_ca71416537',
    statutoryRequirements: [
      'Central FSSAI Catering License',
      'Water Portability Testing Lab Certificate (NABL Accredited)',
      'Fire Safety NOC for Commercial Kitchen Equipment',
      'Waste Disposal & Bio-Degradable Management Compliance'
    ],
    description: 'End-to-end operation of residential training academies, central hospitals, and public university dining halls with nutritional auditing.',
    popular: false
  },
  {
    id: 'serv-006',
    title: 'Catering Service per Packet based',
    category: 'Trending',
    domain: 'Catering & Hospitality',
    domainIcon: '🍱',
    subTitle: 'Standardized Hygienic Meal Boxes, Packed Breakfasts & Snack Hampers',
    billingModel: 'Per Packet / Per Box Tier',
    gemCategoryCode: 'services_home_rest_ca11785255',
    statutoryRequirements: [
      'FSSAI Food Packaging & Labeling Compliance',
      'Food Grade Recyclable Packing Material Certification',
      'Batch Numbering, Manufacturing Time & Expiry Time Print'
    ],
    description: 'Ready-to-eat boxed meals and refreshments delivered for election personnel, field surveyors, disaster relief camps, and seminars.',
    popular: false
  },
  {
    id: 'serv-007',
    title: 'Manpower Outsourcing Services - Minimum Wage',
    category: 'Trending',
    domain: 'Manpower & Security',
    domainIcon: '👥',
    subTitle: 'Unskilled, Semi-Skilled & Skilled Support Staff Deployment',
    billingModel: 'Central / State Gazette Minimum Wage Rate + Service Charge',
    gemCategoryCode: 'services_home_manp_manp',
    statutoryRequirements: [
      'Contract Labour (Regulation & Abolition) Act 1970 License',
      'Electronic Monthly EPFO ECR Filing Proof',
      'ESIC Monthly Contribution Slip Submission',
      'Mandatory Bank Account Transfer (No Cash Disbursement Proof)'
    ],
    description: 'Deployment of administrative assistants, data entry operators, office attendants, and maintenance technicians adhering strictly to wage rules.',
    popular: true
  },
  {
    id: 'serv-008',
    title: 'Manpower Outsourcing Services - Fixed Remuneration',
    category: 'Trending',
    domain: 'Manpower & Security',
    domainIcon: '👔',
    subTitle: 'Domain Experts, IT Specialists, Legal Advisors & Project Consultants',
    billingModel: 'Monthly Consolidated Remuneration Basis',
    gemCategoryCode: 'services_home_manp_ma44130178',
    statutoryRequirements: [
      'TDS Deductions under Section 194J / 192 of Income Tax Act',
      'Professional Indemnity & Background Clearance',
      'Non-Disclosure Agreement (NDA) for Government Data Integrity'
    ],
    description: 'Engagement of high-tier technical analysts, software engineers, policy associates, and management experts on fixed government project fees.',
    popular: false
  },
  {
    id: 'serv-009',
    title: 'Goods Transport Service – Per KM Based Service',
    category: 'Trending',
    domain: 'Transport & Fleet',
    domainIcon: '🚚',
    subTitle: 'Heavy Cargo, Inter-State Logistics, Containers & Machinery Transit',
    billingModel: 'Per KM / Weight Slabs (Ton-KM)',
    gemCategoryCode: 'services_home_good_go61253067',
    statutoryRequirements: [
      'Carriage by Road Act 2007 Transporter Registration',
      'Valid National Goods Permit & E-Way Bill Integration',
      'Transit Insurance Coverage Policy for Consignments',
      'Fitness Certificates for Multi-Axle Trucks'
    ],
    description: 'Nationwide freight transportation of food grains, military logistics, railway spare parts, and power grid transformers with real-time GPS tracking.',
    popular: true
  },
  {
    id: 'serv-010',
    title: 'Vehicle Hiring Service - Per Vehicle-Day basis',
    category: 'Trending',
    domain: 'Transport & Fleet',
    domainIcon: '🚐',
    subTitle: 'Special Utility Trucks, Mobile Vans & Inspection Jeeps',
    billingModel: 'Per Vehicle-Day Fixed Rate',
    gemCategoryCode: 'services_home_ve54336454_ve03875333',
    statutoryRequirements: [
      'State RTO Commercial Registration',
      'Speed Governor Calibration Certificate',
      'Comprehensive Fleet Liability Insurance'
    ],
    description: 'Daily requisitioning of utility pick-up trucks, mobile diagnostic vans, and field engineering jeeps for municipal inspection and census duties.',
    popular: false
  },
  {
    id: 'serv-011',
    title: 'Bus Hiring Service - Short Term',
    category: 'Trending',
    domain: 'Transport & Fleet',
    domainIcon: '🚌',
    subTitle: 'Standard, Deluxe & AC Volvo Passenger Buses for Delegations',
    billingModel: 'Per Trip / Per Day / Per KM Basis',
    gemCategoryCode: 'services_home_ve54336454_bush',
    statutoryRequirements: [
      'Stage Carriage / Contract Carriage Commercial Permit',
      'Emergency Exit & AIS-052 Bus Body Code Compliance',
      'Driver Passenger Commercial PSV Badge Verified'
    ],
    description: 'Bulk transit logistics for national conventions, central armed police force movement, state delegations, and academic field expeditions.',
    popular: false
  },
  {
    id: 'serv-012',
    title: 'Paper-based Printing Services',
    category: 'Trending',
    domain: 'Printing & Media',
    domainIcon: '📄',
    subTitle: 'Government Gazettes, Annual Reports, Policy Books & Booklets',
    billingModel: 'Per Copy / Page Volume Slab',
    gemCategoryCode: 'services_home_prin_pape',
    statutoryRequirements: [
      'Factories Act 1948 Press Registration',
      'GST E-Invoicing Compliance',
      'FSC Certified Environment-Friendly Pulp Paper Compliance',
      'Copyright & Confidential Document Shredding Protocol'
    ],
    description: 'High-volume high-security offset and digital publication printing for parliament budgets, statistical surveys, and official gazette notifications.',
    popular: true
  },
  {
    id: 'serv-013',
    title: 'Non Paper Printing Services - Quantity Based',
    category: 'Trending',
    domain: 'Printing & Media',
    domainIcon: '🖨️',
    subTitle: 'ID Cards, Polycarbonate Smart Cards, Badges, Vinyl & Acrylic Board',
    billingModel: 'Per Piece / Unit Quantity Slabs',
    gemCategoryCode: 'services_home_prin_no86115751',
    statutoryRequirements: [
      'ISO 7810 Standard Compliance for Identity Cards',
      'RoHS Compliant Non-Hazardous UV Ink Usage',
      'Anti-Counterfeiting Hologram Application Capabilities'
    ],
    description: 'Production of government employee identity credentials, RFID smart transit passes, PVC certificates, and branded plaques.',
    popular: false
  },
  {
    id: 'serv-014',
    title: 'Non Paper Printing Services - Area Based',
    category: 'Trending',
    domain: 'Printing & Media',
    domainIcon: '🎨',
    subTitle: 'Large Format Banners, Hoardings, Standees & Exhibition Graphics',
    billingModel: 'Per Square Foot / Square Meter Basis',
    gemCategoryCode: 'services_home_prin_nonp',
    statutoryRequirements: [
      'CPCB Eco-Solvent / Biodegradable Fabric Banner Guidelines',
      'Fire-Retardant Fabric Certification (DIN 4102 B1)',
      'UV-Resistant Ink Durability Warranty (Minimum 12 Months)'
    ],
    description: 'Outdoor publicity campaigns, highway hoardings, national welfare awareness flex banners, and trade fair pavilion graphics.',
    popular: false
  },
  {
    id: 'serv-015',
    title: 'Event or Seminar or Workshop or Exhibition or Expo Management',
    category: 'Trending',
    domain: 'Catering & Hospitality',
    domainIcon: '🎪',
    subTitle: 'Turnkey International Conferences, Summits & National Expos',
    billingModel: 'LumpSum Comprehensive Event Scope',
    gemCategoryCode: 'services_home_ev80610203_even',
    statutoryRequirements: [
      'Structural Stability & Electrical Safety Audit NOC',
      'Public Liability Event Insurance Coverage',
      'Local Municipal Fire & Emergency Services NOC',
      'Acoustic decibel limit compliance under Environment Protection Act'
    ],
    description: 'End-to-end event infrastructure, stage lighting, multilingual audio translation consoles, registration booths, and VIP lounge hospitality.',
    popular: false
  },
  {
    id: 'serv-016',
    title: 'Annual Maintenance Service - Desktops, Laptops and Peripherals',
    category: 'Trending',
    domain: 'IT & Hardware AMC',
    domainIcon: '🖥️',
    subTitle: 'Preventive, Breakdown & Comprehensive Computer Maintenance',
    billingModel: 'Per Machine-Year Basis (Quarterly Preventive Audits)',
    gemCategoryCode: 'services_home_an53158604_an00015311',
    statutoryRequirements: [
      'OEM Authorized Service Partner Certification (where applicable)',
      'ISO 9001 Quality Management System',
      'Resident Certified Hardware Engineers SLA Commitment',
      'Electronic E-Waste Disposal Compliance (E-Waste Rules 2022)'
    ],
    description: 'Comprehensive maintenance covering CPU motherboards, monitors, network switches, operating systems, and antivirus definitions across offices.',
    popular: true
  },
  {
    id: 'serv-017',
    title: 'Repair, Maintenance, and Installation of Plant/Systems/Equipments',
    category: 'Trending',
    domain: 'Maintenance & Engineering',
    domainIcon: '⚙️',
    subTitle: 'Heavy Machinery, Sub-Stations, Compressors, Boilers & Elevators',
    billingModel: 'Comprehensive AMC / Job-Order Slabs',
    gemCategoryCode: 'services_home_repa_re22373363',
    statutoryRequirements: [
      'Indian Boiler Regulations (IBR) Certification',
      'Chief Electrical Inspector to Government (CEIG) Approval',
      'Workmen Compensation Insurance Policy for High-Risk Engineering'
    ],
    description: 'Specialized preventive overhaul, turbine servicing, transformer oil filtration, and central air-conditioning plant refits.',
    popular: false
  },
  {
    id: 'serv-018',
    title: 'Repair and Overhauling Service',
    category: 'Trending',
    domain: 'Maintenance & Engineering',
    domainIcon: '🔧',
    subTitle: 'Electro-Mechanical Motors, Pumps, Generators & Hydraulic Systems',
    billingModel: 'Per Equipment / Defect Rectification Basis',
    gemCategoryCode: 'services_home_gene',
    statutoryRequirements: [
      'Factory Inspection Calibration Records',
      'OEM Genuine Spare Parts Guarantee Certificate',
      'Test-Bed Dynamic Load Testing Verification'
    ],
    description: 'Precision servicing and rewinding of HT motors, water treatment centrifugal pumps, diesel backup generators, and valves.',
    popular: false
  },
  {
    id: 'serv-019',
    title: 'Facility Management Services - LumpSum Based',
    category: 'Trending',
    domain: 'Facility Management',
    domainIcon: '🧹',
    subTitle: 'Comprehensive Housekeeping, Deep Sanitation, Pest Control & Waste',
    billingModel: 'Consolidated Monthly LumpSum Rate',
    gemCategoryCode: 'services_home_fa85086605_fa43870134',
    statutoryRequirements: [
      'EPFO, ESIC & Minimum Wages Act Compliance',
      'Bio-Medical Waste Management Rules 2016 Authorization (Hospitals)',
      'Mechanized Cleaning Equipment Deployment Schedule',
      'Eco-Friendly Green Chemical Certification'
    ],
    description: 'Integrated single-point facility administration including mechanized scrubbing, facade glass wash, washroom hygiene, and solid waste segregation.',
    popular: true
  },
  {
    id: 'serv-020',
    title: 'Custom Bid for Services',
    category: 'Trending',
    domain: 'Specialized & High-Tech',
    domainIcon: '📑',
    subTitle: 'Tailored Service Framework for Non-Standardized Technical Works',
    billingModel: 'Custom Milestone / Deliverable-Based Scope',
    gemCategoryCode: 'services_home_cust',
    statutoryRequirements: [
      'General Financial Rules (GFR 2017) Rule 144(xi) Land Border Compliance',
      'Project-Specific Technical Eligibility Criteria Verification',
      'Performance Security Bank Guarantee (3-5% Contract Value)'
    ],
    description: 'Custom procurement framework enabling ministries to publish unique scope-of-work tenders with specialized statutory evaluation matrices.',
    popular: false
  },

  // Emerging Services (Official 10 direct from gem.gov.in)
  {
    id: 'serv-021',
    title: 'Drone as a Service - Version 2',
    category: 'Emerging',
    domain: 'Specialized & High-Tech',
    domainIcon: '🚁',
    subTitle: 'Aerial Photogrammetry, Precision GIS Mapping & Smart Agriculture',
    billingModel: 'Per Acre / Per Flight Hour / Per Square KM',
    gemCategoryCode: 'services_home_giss_dr11345408',
    statutoryRequirements: [
      'DGCA Digital Sky Platform Registered Drone with Valid UIN',
      'Certified Remote Pilot Certificate (RPC) issued by DGCA Approved FTO',
      'Third-Party Drone Aviation Insurance Policy',
      'Local Police & Air Traffic Control (ATC) Flying Clearances'
    ],
    description: 'Next-generation aerial surveillance for national highways, border surveillance, urban municipal GIS cadastral mapping, and crop loss assessment.',
    popular: true
  },
  {
    id: 'serv-022',
    title: 'Hiring of MSP for Operation and Management of ICT Infrastructure',
    category: 'Emerging',
    domain: 'IT & Hardware AMC',
    domainIcon: '💻',
    subTitle: 'Tier-III/IV Data Centers, Cloud Hosting, Cybersecurity & NOC Services',
    billingModel: 'Fixed Monthly SLA Performance Basis',
    gemCategoryCode: 'services_home_itse_ni30137721',
    statutoryRequirements: [
      'CERT-In Empanelled Information Security Auditing Certification',
      'ISO 27001 (ISMS), ISO 20000 (ITSM) & CMMI Level 3/5',
      'Indian Data Sovereignty Compliance (MeitY Guidelines)',
      '24x7 SOC (Security Operations Center) SLA Guarantee'
    ],
    description: 'Outsourced management of critical state data centers, government cloud instances, disaster recovery sites, and enterprise firewalls.',
    popular: true
  },
  {
    id: 'serv-023',
    title: 'CSR Project Monitoring, Evaluation and Impact Assessment Service',
    category: 'Emerging',
    domain: 'Specialized & High-Tech',
    domainIcon: '📊',
    subTitle: 'Independent Third-Party Social Impact Analysis for Public Sector Enterprises',
    billingModel: 'Per Project Milestone Evaluation',
    gemCategoryCode: 'services_home_ma32785043_csrp',
    statutoryRequirements: [
      'Companies Act 2013 Section 135 Compliance',
      'ICAI / ICWAI Empaneled Social Audit Certification',
      'Field Baseline & Endline Survey Methodology Standards'
    ],
    description: 'Empirical assessment of educational, healthcare, and water conservation projects undertaken by CPSEs to ensure genuine grassroots transformation.',
    popular: false
  },
  {
    id: 'serv-024',
    title: 'Operation & Maintenance of High Value Medical Equipment Revenue Share',
    category: 'Emerging',
    domain: 'Specialized & High-Tech',
    domainIcon: '🏥',
    subTitle: 'Public-Private Partnership for MRI, 128-Slice CT & Linac Radiation Units',
    billingModel: 'Revenue Share Percentage per Patient Scan',
    gemCategoryCode: 'services_home_op51535761',
    statutoryRequirements: [
      'AERB (Atomic Energy Regulatory Board) Radiation Safety Clearance',
      'NABH Hospital Diagnostic Equipment Calibration Standards',
      'NABL Accredited Quality Assurance Checks',
      'Medical Device Rules 2017 (CDSCO) Compliance'
    ],
    description: 'PPP model where private operators install and maintain multimillion-dollar imaging systems in district civil hospitals on subsidised fee shares.',
    popular: false
  },
  {
    id: 'serv-025',
    title: 'Service for Chemical Treatment of Cooling Water',
    category: 'Emerging',
    domain: 'Maintenance & Engineering',
    domainIcon: '🧪',
    subTitle: 'Scale & Corrosion Inhibition for Thermal Power Plants & Refineries',
    billingModel: 'Monthly Dosage / Volume Treated Basis',
    gemCategoryCode: 'services_home_serv',
    statutoryRequirements: [
      'Central Pollution Control Board (CPCB) Heavy Metal Discharge Compliance',
      'Petroleum and Explosives Safety Organization (PESO) Chemical Transport NOC',
      'Material Safety Data Sheet (MSDS) OSHA Compliance'
    ],
    description: 'Specialized chemical dosing, biocidal control, and cycle-of-concentration optimization for cooling towers in power stations and petrochemical plants.',
    popular: false
  },
  {
    id: 'serv-026',
    title: 'Revenue Based Services - H1 Evaluation',
    category: 'Emerging',
    domain: 'Specialized & High-Tech',
    domainIcon: '📈',
    subTitle: 'Highest Bidder (H1) Concessionaire Rights for Government Assets',
    billingModel: 'Highest Revenue Share / Concession Royalty Fee',
    gemCategoryCode: 'services_home_re41225855',
    statutoryRequirements: [
      'GFR 2017 Commercial Revenue Concessionaire Guidelines',
      'Net Worth Financial Solvency Bank Guarantee',
      'Upfront Security Deposit / Performance Guarantee'
    ],
    description: 'Tendering of commercial leasing rights, government parking complexes, cafeteria concessions, and state tourist resorts.',
    popular: false
  },
  {
    id: 'serv-027',
    title: 'Newspaper & Magazine Supply Service (Version 2)',
    category: 'Emerging',
    domain: 'Printing & Media',
    domainIcon: '📰',
    subTitle: 'Daily Periodical Distribution to Ministerial Chambers & Public Libraries',
    billingModel: 'Monthly Fixed Cover Price + Discount Slab',
    gemCategoryCode: 'services_home_ne58280502',
    statutoryRequirements: [
      'Registrar of Newspapers for India (RNI) Distribution Code',
      'Standard 6:30 AM Delivery SLA Commitment',
      'GST Invoice Submission with Audited Subscription Slips'
    ],
    description: 'Punctual morning doorstep delivery of national dailies, international affairs magazines, and technical journals across government departments.',
    popular: false
  },
  {
    id: 'serv-028',
    title: 'Collection of User Fee at Toll Plaza through Agency for NHAI',
    category: 'Emerging',
    domain: 'Transport & Fleet',
    domainIcon: '🛣️',
    subTitle: 'Electronic Toll Collection (FASTag), Cash Lanes & Plaza Traffic Control',
    billingModel: 'Performance Fee / Weekly Bank Remittance Guarantee',
    gemCategoryCode: 'services_home_coll',
    statutoryRequirements: [
      'National Highways Authority of India (NHAI) Toll Operator Empanelment',
      'Daily Remittance Bank Escrow Agreement',
      'EPFO / ESIC for Booth Attendants & Incident Management Teams',
      'High-Speed Weigh-in-Motion (WIM) Calibration Compliance'
    ],
    description: '24x7 toll plaza operational management, automatic vehicle classification, barrier maintenance, and traffic marshaling on national expressways.',
    popular: false
  },
  {
    id: 'serv-029',
    title: 'Hiring of Helicopter Service - Fixed Monthly Rental Basis',
    category: 'Emerging',
    domain: 'Specialized & High-Tech',
    domainIcon: '🚁',
    subTitle: 'Twin-Engine Rotorcraft for Remote Frontier Connectivity & Disaster Relief',
    billingModel: 'Fixed Monthly Flying Hours + Hourly Fuel Surcharges',
    gemCategoryCode: 'services_home_hi24642853_hi84572751',
    statutoryRequirements: [
      'DGCA Non-Scheduled Operator Permit (NSOP)',
      'Airworthiness Review Certificate (ARC) from DGCA India',
      'Aviation Hull and Third-Party War Risk Insurance',
      'Twin-Engine IFR (Instrument Flight Rules) Certified Crew'
    ],
    description: 'Emergency medical air-evacuation, ministerial transit to northeastern mountainous frontiers, offshore oil rig crew transfer, and disaster rescue.',
    popular: false
  },
  {
    id: 'serv-030',
    title: 'DGR Empanelled ESM Security Services',
    category: 'Emerging',
    domain: 'Manpower & Security',
    domainIcon: '🎖️',
    subTitle: 'Ex-Servicemen Security Agencies Empanelled with Ministry of Defence',
    billingModel: 'DGR Wage Rates (Ex-Servicemen Resettlement Gazette)',
    gemCategoryCode: 'services_home_manp_se05510230',
    statutoryRequirements: [
      'Valid Sponsorship Letter from Directorate General Resettlement (DGR)',
      'Proprietor / Managing Partner must be Retired Defence Officer (ESM)',
      'PSARA State License with Ex-Serviceman Exemption status',
      'Strict Adherence to DGR Wage Slabs and Uniform Allowances'
    ],
    description: 'Premier security and perimeter protection for high-security CPSE assets (refineries, atomic research centers, thermal stations) by disciplined armed veterans.',
    popular: true
  }
];

export const CORE_SERVICE_DOMAINS = [
  { name: 'All Services', icon: '🏛️', count: 30 },
  { name: 'Manpower & Security', icon: '👮‍♂️', count: 5 },
  { name: 'Transport & Fleet', icon: '🚗', count: 6 },
  { name: 'Catering & Hospitality', icon: '🍽️', count: 4 },
  { name: 'IT & Hardware AMC', icon: '🖥️', count: 2 },
  { name: 'Printing & Media', icon: '📄', count: 4 },
  { name: 'Facility Management', icon: '🧹', count: 2 },
  { name: 'Specialized & High-Tech', icon: '🚁', count: 4 },
  { name: 'Maintenance & Engineering', icon: '⚙️', count: 3 }
];
