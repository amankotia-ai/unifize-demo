

export const products = [
    {
        title: "Document Management System",
        description: "Simplify document control and training while ensuring regulatory compliance.",
        link: "#",
        linkText: "Explore DMS →",
        color: "from-blue-50 to-blue-100",
        accent: "text-blue-600",
        icon: "FileText",
    },
    {
        title: "Quality Management System",
        description: "Ensure regulatory compliance, lower quality risks, and enhance audit readiness.",
        link: "#",
        linkText: "Explore QMS →",
        color: "from-emerald-50 to-emerald-100",
        accent: "text-emerald-600",
        icon: "ShieldCheck",
    },
    {
        title: "Product Lifecycle Management",
        description: "Accelerate product development and improve traceability across your product lifecycle.",
        link: "#",
        linkText: "Explore PLM →",
        color: "from-blue-50 to-blue-100",
        accent: "text-[#0667FF]",
        icon: "GitMerge",
    },
    {
        title: "Manufacturing Execution System",
        description: "Gain real-time visibility and optimize the production process with ease.",
        link: "#",
        linkText: "Explore MES →",
        color: "from-amber-50 to-amber-100",
        accent: "text-amber-600",
        icon: "Factory",
    },
    {
        title: "Maintenance Management (CMMS)",
        description: "Reduce downtime and extend asset life with proactive maintenance scheduling.",
        link: "#",
        linkText: "Explore CMMS →",
        color: "from-purple-50 to-purple-100",
        accent: "text-purple-600",
        icon: "Wrench",
    },
];

export const industries = [
    { title: "Aerospace & Defence", description: "Compliance with AS9100D and regulatory standards.", icon: "Plane" },
    { title: "Automotives", description: "Streamline production and ensure IATF 16949 compliance.", icon: "Car" },
    { title: "Contract Research", description: "Manage complex projects and data with precision.", icon: "Microscope" },
    { title: "Cosmetics", description: "Accelerate time-to-market while ensuring quality.", icon: "Sparkles" },
    { title: "Food Production", description: "Ensure food safety and FSMA/GFSI compliance.", icon: "Utensils" },
    { title: "Laboratories", description: "Manage samples and tests with ISO 17025 compliance.", icon: "FlaskConical" },
    { title: "Manufacturing", description: " Optimize operations across diverse manufacturing sectors.", icon: "Factory" },
    { title: "Medical Devices", description: "Navigate FDA 21 CFR Part 820 and ISO 13485 regulations.", icon: "Stethoscope" },
    { title: "Nutritional Supplements", description: "Ensure GMP compliance and product purity.", icon: "Pill" },
];

export const resources = [
    { title: "Videos", description: "Watch product tours and educational content.", icon: "Video" },
    { title: "Blog", description: "Insights on quality, compliance, and manufacturing.", icon: "FileText" },
    { title: "Case Studies", description: "See how others are succeeding with Unifize.", icon: "Briefcase" },
    { title: "Guides", description: "In-depth resources and best practices.", icon: "BookOpen" },
    { title: "Snapshots", description: "Quick overviews of key features and benefits.", icon: "Camera" },
    { title: "Comparisons", description: "Compare Unifize with other solutions.", icon: "Scale" },
    { title: "Knowledge Base", description: "Documentation and help articles.", icon: "HelpCircle" },
    { title: "Developer Portal", description: "API reference and developer tools.", icon: "Code" },
];

export const company = [
    { title: "About Us", description: "Our mission, vision, and team.", icon: "Info" },
    { title: "Careers", description: "Join us in shaping the future of manufacturing software.", icon: "Briefcase" },
    { title: "Trust Vault", description: "Security, compliance, and reliability status.", icon: "ShieldCheck" },
];

export const benefitsTabs = [
    {
        value: "risk",
        label: "Manage risk & compliance",
        heading: "Manage risk & compliance",
        description: "Minimize potential threats to product quality and compliance by identifying, assessing, and controlling risks throughout the product life cycle.",
        features: [
            { icon: "search", title: "Proactive Risk Management", desc: "Identify, assess, and address risks early to prevent escalation" },
            { icon: "signpost", title: "Process Accountability", desc: "Establish clear ownership and transparent workflows" },
            { icon: "bell", title: "Regulatory Adaptability", desc: "Align with changing standards and regulations and enhance flexibility" },
        ],
    },
    {
        value: "efficiency",
        label: "Drive operational efficiency",
        heading: "Drive operational efficiency",
        description: "Streamline processes, optimize resources, and reduce operational delays to improve productivity and performance.",
        features: [
            { icon: "search", title: "Process Visibility", desc: "Gain real-time insights into process efficiency and bottlenecks" },
            { icon: "signpost", title: "Cycle Time Reduction", desc: "Shorten cycle times with timely updates and standardized workflows" },
            { icon: "bell", title: "Resource Utilization", desc: "Maximize the use of time, personnel, and equipment for greater efficiency" },
            { icon: "users", title: "Improved Collaboration", desc: "Improve collaboration between stakeholders to minimize delays and misses" },
        ],
    },
    {
        value: "innovation",
        label: "Accelerate innovation",
        heading: "Accelerate innovation",
        description: "Accelerate innovation by empowering teams to prototype rapidly, collaborate effectively, and adapt quickly to emerging market trends.",
        features: [
            { icon: "search", title: "Rapid Iteration", desc: "Foster agility in design and development cycles" },
            { icon: "signpost", title: "Competitiveness", desc: "Drive market competitiveness led by innovation" },
            { icon: "bell", title: "Market Responsiveness", desc: "Adapt swiftly to trends and customer demands" },
            { icon: "users", title: "Integrated Collaboration", desc: "Eliminate cross-functional silos for faster results" },
        ],
    },
];

export const platformTabs = [
    {
        value: "configuration",
        label: "Configuration",
        heading: "Configuration",
        description: "From role-based dashboards to conditional workflows, Unifize's no-code capabilities make it easy to configure the platform to meet your team's specific needs.",
        features: ["No-Code Process Builder", "Role-Based Home Screens", "Configurable Dashboards & Reports", "Access Control & Permissions", "Configurable Checklists & Forms", "PDFs with Embedded QR Codes", "Conditional Logic on Checklists & Forms"],
        colorScheme: "orange",
    },
    {
        value: "collaboration",
        label: "Collaboration",
        heading: "Collaboration",
        description: "Integrate conversations and workflows effortlessly. With chat, role-based access, and vendor portals, Unifize keeps teams connected and productive.",
        features: ["Chat Driven Process Records", "Vendor / Customer Portal", "eSignatures (CFR Part 11 Compliant)", "Email To / From Records", "Mobile & Tablet Enabled", "Real-time Audit Trail", "Manage Groups & Roles", "Dynamic Teams & Ownership", "Unifize Lite"],
        colorScheme: "purple",
    },
    {
        value: "automation",
        label: "Automation",
        heading: "Automation",
        description: "Automate routine tasks and eliminate inefficiencies with Unifize's rule-based workflows, smart notifications, and approvals.",
        features: ["Revision Management / Version Control", "Archiving & Retention Management", "Record & Document Routing", "Calculations", "Record Creation From Email", "Email & Phone Notifications", "Reminder & Escalation Workflows", "Custom Auto-Numbering", "Update Metadata & Record Titles", "Auto Add People & Groups", "Approval Workflows"],
        colorScheme: "green",
    },
    {
        value: "integration",
        label: "Integration",
        heading: "Integration",
        description: "Ensure connectivity with your tools, enabling smooth integration with email, SharePoint, and other systems you already use.",
        features: ["Unifize API Access", "Slack Integration", "SSO/SAML Authentication", "SharePoint / OneDrive", "Email Integration"],
        colorScheme: "orange",
    },
    {
        value: "analytics",
        label: "Analytics & Reports",
        heading: "Analytics & Reports",
        description: "Build highly configurable reports and dashboards, and track the metrics and KPIs most important to your business in real-time.",
        features: ["Configurable Reports & Dashboards", "Cycle Time Tracking", "Real-Time Metrics & KPIs", "Custom Reporting Templates", "Role-Based Dashboards"],
        colorScheme: "purple",
    },
    {
        value: "security",
        label: "Enterprise-Grade Security",
        heading: "Enterprise-Grade Security",
        description: "Built with robust security measures, Unifize safeguards your data with encryption, compliance-ready features, and detailed audit capabilities, ensuring your operations remain secure.",
        features: ["Role-Based Access Control", "CFR Part 11 Compliant eSignatures", "SOC-2 Compliant Data Storage", "Comprehensive Audit Trails", "Enterprise-Grade Encryption"],
        colorScheme: "green",
    },
];

export const testimonials = [
    {
        name: "Denis Machoka",
        title: "Denis's experience with Unifize: Revolutionizing quality assurance systems",
        description: "Quality expert Denis details his transformative journey with Unifize. He praises its efficient design, user-centric approach, and the system's ability to streamline data handling and accelerate time to market.",
        caseStudyLink: "#",
    },
    {
        name: "Clarissa Archer",
        title: "Harmonic Bionics and Unifize: A seamless transition to regulatory compliance",
        description: "Clarissa Archer shares her experience integrating Unifize into Harmonic Bionics, underscoring its value in streamlining change control, facilitating communication, and ensuring robust documentation for regulatory compliance in the medical device sector.",
        caseStudyLink: "#",
    },
    {
        name: "Michael Hogan",
        title: "Engineering efficiency with Unifize: Michael Hogan's insights from Harmonic Bionics",
        description: "Mechanical Engineer Michael Hogan elaborates on how the integration of Unifize at Harmonic Bionics has streamlined his engineering processes, promoting transparency and rapid turnaround in the medical device domain.",
        caseStudyLink: "#",
    },
    {
        name: "Jesse Kolstad",
        title: "Here's how Biovation Labs reduced testing costs from $146K to $65K in two months",
        description: "Learn how and why Biovation Labs, an FDA regulated nutraceutical manufacturer based in Salt Lake City, took the decision to transition from MasterControl to Unifize for their product lifecycle (PLM) and quality management (QMS) processes.",
        caseStudyLink: "#",
    },
    {
        name: "Tedd Carr",
        title: "How a quality veteran boosted issue closure time by 75% within the first month",
        description: "Tedd Carr from The Will-Burt Company discusses overcoming their diverse and complex quality challenges across various sectors with Unifize. By consolidating five systems into one, they achieved clear accountability and reduced issue closure from months to days.",
        caseStudyLink: "#",
    },
];

export const benefitsStats = [
    { stat: "70%", label: "Slash time-to-market by", description: "Map Unifize to your processes and streamline workflows, process automation, and prioritization." },
    { stat: "90%", label: "Reduce meetings by", description: "Less meetings with in-app collaboration, real-time updates, and decision logs." },
    { stat: "2x", label: "Improve accountability by", description: "Drive accountability using task assignments, deadline reminders, and progress tracking." },
    { stat: "100%", label: "Visibility", description: "Full visibility through real-time reporting, milestone tracking, and customizable analytics." },
    { stat: "100%", label: "Eliminate internal silos", description: "Reduce internal silos with unified communication channels, team chats, and project dashboards." },
];

export const onboardingSteps = [
    {
        highlight: "White glove onboarding.",
        title: "Get rid of emails, meetings and data entry.",
        description: "Our Customer Success team helps you get started with a personalized onboarding for you and your team.",
    },
    {
        highlight: "No-code.",
        title: "Map to any process in less than 30 minutes.",
        description: "Easy-to-use drag-and-drop process builder, and customizable checklists",
    },
    {
        highlight: "Start small → Scale later.",
        title: "Import your existing data and documents.",
        description: "A Unifize consultant will work with whatever data, flowcharts, or forms you may have.",
    },
];

export const faqItems = [
    {
        question: "What is Unifize and how does it work?",
        answer: "Unifize is a unified platform that brings quality, operations, and product development teams into a single source of truth. It helps ISO and FDA-compliant companies manage risk, drive operational efficiency, and accelerate innovation.",
    },
    {
        question: "How long does implementation take?",
        answer: "Most teams get up and running in less than 30 days. Our no-code configurator and process template libraries enable lightning-fast implementation without complex IT setups.",
    },
    {
        question: "Is Unifize compliant with FDA and ISO regulations?",
        answer: "Yes. Unifize is built specifically for FDA and ISO-compliant companies. It includes features like CFR Part 11 compliant eSignatures, comprehensive audit trails, and SOC-2 compliant data storage.",
    },
    {
        question: "Can Unifize integrate with my existing tools?",
        answer: "Absolutely. Unifize integrates with email, SharePoint, Slack, OneDrive, and many other systems. It also provides API access for custom integrations.",
    },
    {
        question: "What kind of support does Unifize offer?",
        answer: "Unifize provides white-glove onboarding with a dedicated Customer Success team. A Unifize consultant will work with your existing data, flowcharts, and forms to ensure a smooth transition.",
    },
];

export const clientLogos = [
    "Biovation Labs", "Dynamic Blending", "Adaptive Health", "LeaderBrand Produce",
    "Maia Estates", "Applechem", "Rastelli", "Laundrytec", "Jamco", "ATS",
    "Yanuvia", "King Agro", "Con-Forms", "Engineering Industries",
    "Target", "PhoMedics", "Recovery Force", "Will-Burt",
    "Red Sun Farms", "Vans", "Gilat Wavestream", "John Deere",
    "TTK Prestige",
];
