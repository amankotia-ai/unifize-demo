import { useEffect, useMemo, useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent } from "react";
import {
    BadgeCheck,
    BarChart3,
    Bell,
    ClipboardList,
    Factory,
    FileSignature,
    FileText,
    FlaskConical,
    Gauge,
    GitCompareArrows,
    GraduationCap,
    Handshake,
    Hash,
    History,
    KeyRound,
    LayoutDashboard,
    LineChart,
    ListChecks,
    Lock,
    MailPlus,
    MessageSquare,
    Microscope,
    Pill,
    Plane,
    Play,
    Plug,
    Route,
    Server,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Stethoscope,
    Utensils,
    Workflow,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type IndustryTab = {
    value: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
};

type IndustryFeature = {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
};

type IndustryContent = {
    lead: string;
    features: IndustryFeature[];
};

type FlowNodeTone =
    | "production"
    | "quality"
    | "improvement"
    | "externalProcess"
    | "externalParty"
    | "specification"
    | "integration"
    | "training"
    | "neutral";

type FlowNode = {
    id: string;
    label: string[];
    x: number;
    y: number;
    width: number;
    height: number;
    tone: FlowNodeTone;
    dashed?: boolean;
};

type FlowEdgeSide = "top" | "right" | "bottom" | "left";

type FlowEdge = {
    from: string;
    to: string;
    fromSide?: FlowEdgeSide;
    toSide?: FlowEdgeSide;
    dashed?: boolean;
    via?: Array<[number, number]>;
};

type PreviewSceneBlueprint = {
    featureIndex: number;
    viewBox: string;
    nodeIds: string[];
    edgePairs: string[];
};

const industryTabs: IndustryTab[] = [
    { value: "all", label: "All", icon: Factory },
    { value: "medical-devices", label: "Medical Devices", icon: Stethoscope },
    { value: "manufacturing", label: "Manufacturing", icon: Factory },
    { value: "nutritional-supplements", label: "Nutritional Supplements", icon: Pill },
    { value: "aerospace-defence", label: "Aerospace & Defence", icon: Plane },
    { value: "food-production", label: "Food Production", icon: Utensils },
    { value: "cosmetics", label: "Cosmetics", icon: Sparkles },
    { value: "contract-research", label: "Contract Research", icon: Microscope },
    { value: "laboratories", label: "Laboratories", icon: FlaskConical },
];

const sharedFeatures: IndustryFeature[] = [
    {
        title: "Product & Raw Material Specifications",
        description: "Manage product and raw material specs in one place.",
        icon: ClipboardList,
    },
    {
        title: "Document Management",
        description: "Control and track compliance documents with full visibility.",
        icon: FileText,
    },
    {
        title: "Training",
        description: "Keep teams trained on quality and safety procedures.",
        icon: GraduationCap,
    },
    {
        title: "No-Code Process Builder",
        description: "Configure and launch workflows without engineering support.",
        icon: Workflow,
    },
    {
        title: "Role-Based Home Screens",
        description: "Give each function a focused view of pending work.",
        icon: LayoutDashboard,
    },
    {
        title: "Configurable Dashboards & Reports",
        description: "Track operational and quality performance in real time.",
        icon: BarChart3,
    },
    {
        title: "Access Control & Permissions",
        description: "Protect records with granular user and role access.",
        icon: ShieldCheck,
    },
    {
        title: "Configurable Checklists & Forms",
        description: "Standardize execution with structured digital forms.",
        icon: ListChecks,
    },
    {
        title: "Conditional Workflow Logic",
        description: "Automate branching actions based on process outcomes.",
        icon: Route,
    },
    {
        title: "Chat-Driven Process Records",
        description: "Capture decisions and updates where work happens.",
        icon: MessageSquare,
    },
    {
        title: "Vendor & Customer Portal",
        description: "Collaborate externally while keeping full traceability.",
        icon: Handshake,
    },
    {
        title: "CFR Part 11 eSignatures",
        description: "Approve critical actions with compliant eSignatures.",
        icon: FileSignature,
    },
    {
        title: "Email to Record Conversion",
        description: "Create and update records directly from email threads.",
        icon: MailPlus,
    },
    {
        title: "Mobile & Tablet Access",
        description: "Execute tasks and capture evidence from the floor.",
        icon: Smartphone,
    },
    {
        title: "Real-Time Audit Trail",
        description: "Track every change with timestamped accountability.",
        icon: History,
    },
    {
        title: "Revision & Version Control",
        description: "Prevent errors with controlled versioning and history.",
        icon: GitCompareArrows,
    },
    {
        title: "Approval Workflows",
        description: "Route approvals automatically with clear ownership.",
        icon: BadgeCheck,
    },
    {
        title: "Reminder & Escalation Rules",
        description: "Keep processes moving with smart SLA enforcement.",
        icon: Bell,
    },
    {
        title: "Custom Auto-Numbering",
        description: "Generate consistent IDs for records and documents.",
        icon: Hash,
    },
    {
        title: "API & Integration Support",
        description: "Connect Unifize with your existing business systems.",
        icon: Plug,
    },
    {
        title: "SSO/SAML Authentication",
        description: "Secure logins with enterprise identity providers.",
        icon: KeyRound,
    },
    {
        title: "Cycle Time Tracking",
        description: "Measure throughput and identify process bottlenecks.",
        icon: Gauge,
    },
    {
        title: "KPIs & Custom Reporting",
        description: "Build metrics views aligned with business goals.",
        icon: LineChart,
    },
    {
        title: "Enterprise-Grade Encryption",
        description: "Safeguard sensitive data at rest and in transit.",
        icon: Lock,
    },
    {
        title: "SOC 2 Ready Infrastructure",
        description: "Operate with controls aligned to enterprise security.",
        icon: Server,
    },
];

const contentByIndustry: Record<string, IndustryContent> = {
    all: {
        lead: "Unifize helps regulated teams streamline audits, complaint tracking, and supplier quality processes to ensure compliance and superior product standards.",
        features: sharedFeatures,
    },
    "medical-devices": {
        lead: "Unifize modernizes medical device quality operations with robust document control, training, and process traceability for FDA and ISO compliance.",
        features: sharedFeatures,
    },
    manufacturing: {
        lead: "Unifize brings manufacturing quality and operations together with structured workflows, controlled records, and real-time accountability.",
        features: sharedFeatures,
    },
    "nutritional-supplements": {
        lead: "Unifize revolutionizes nutraceutical quality management with seamless audits, complaint tracking, and robust supplier quality management, ensuring compliance and superior product standards.",
        features: sharedFeatures,
    },
    "aerospace-defence": {
        lead: "Unifize supports aerospace and defence teams with strict process control, audit readiness, and traceable execution across critical workflows.",
        features: sharedFeatures,
    },
    "food-production": {
        lead: "Unifize strengthens food production compliance with controlled specifications, quality checks, and standardized process execution.",
        features: sharedFeatures,
    },
    cosmetics: {
        lead: "Unifize helps cosmetics teams protect product quality with controlled formulas, documentation, and consistent compliance workflows.",
        features: sharedFeatures,
    },
    "contract-research": {
        lead: "Unifize helps contract research teams run compliant, collaborative workflows with complete visibility across process records and approvals.",
        features: sharedFeatures,
    },
    laboratories: {
        lead: "Unifize helps laboratories centralize quality workflows, document control, and training to improve consistency and audit readiness.",
        features: sharedFeatures,
    },
};

const flowToneStyles: Record<FlowNodeTone, { fill: string; stroke: string; text: string }> = {
    production: { fill: "#F3DDE8", stroke: "#B8839B", text: "#512C3D" },
    quality: { fill: "#F6E1B5", stroke: "#C0913F", text: "#5A4422" },
    improvement: { fill: "#FF9B8B", stroke: "#C55A4B", text: "#51241D" },
    externalProcess: { fill: "#9CD7CE", stroke: "#4A988C", text: "#1E4F48" },
    externalParty: { fill: "#DBEFBE", stroke: "#90B866", text: "#365125" },
    specification: { fill: "#CFE9F7", stroke: "#6A9FB8", text: "#294656" },
    integration: { fill: "#2F3B97", stroke: "#2F3B97", text: "#FFFFFF" },
    training: { fill: "#E35A98", stroke: "#A53E6B", text: "#FFFFFF" },
    neutral: { fill: "transparent", stroke: "#6B7280", text: "#374151" },
};

const flowLegendItems: Array<{ label: string; tone: FlowNodeTone }> = [
    { label: "Production logs / traceability", tone: "production" },
    { label: "Quality events", tone: "quality" },
    { label: "Continuous improvement", tone: "improvement" },
    { label: "External processes", tone: "externalProcess" },
    { label: "External parties", tone: "externalParty" },
    { label: "Specification and documents", tone: "specification" },
    { label: "Integrations / connections", tone: "integration" },
    { label: "Training & HR", tone: "training" },
];

const previewSceneBlueprints: PreviewSceneBlueprint[] = [
    {
        featureIndex: 0,
        viewBox: "180 120 980 620",
        nodeIds: ["rm-specs", "incoming-material", "specs-bom", "control-plan", "work-orders"],
        edgePairs: [
            "rm-specs->incoming-material",
            "specs-bom->work-orders",
            "control-plan->work-orders",
            "incoming-material->erp",
        ],
    },
    {
        featureIndex: 1,
        viewBox: "0 20 980 620",
        nodeIds: ["document-server", "calibration", "docs-sops", "supplier", "erp"],
        edgePairs: [
            "document-server->calibration",
            "document-server->docs-sops",
            "calibration->supplier",
            "docs-sops->work-orders",
        ],
    },
    {
        featureIndex: 2,
        viewBox: "500 700 640 520",
        nodeIds: ["corrective-actions", "change-requests", "job-role", "training-modules", "employee", "training-records"],
        edgePairs: [
            "corrective-actions->change-requests",
            "job-role->employee",
            "training-modules->employee",
            "training-modules->training-records",
            "employee->training-records",
        ],
    },
];

const flowNodes: FlowNode[] = [
    { id: "document-server", label: ["Document", "Server"], x: 30, y: 40, width: 130, height: 78, tone: "integration" },
    { id: "calibration", label: ["Calibration &", "Maintenance"], x: 170, y: 220, width: 140, height: 62, tone: "specification" },
    { id: "rm-specs", label: ["RM", "Specifications"], x: 370, y: 220, width: 140, height: 62, tone: "specification" },
    { id: "docs-sops", label: ["Docs/SOPs"], x: 570, y: 220, width: 130, height: 62, tone: "specification" },
    { id: "specs-bom", label: ["Specifications /", "BOM"], x: 800, y: 220, width: 150, height: 62, tone: "specification" },
    { id: "apqp", label: ["APQP/PPAP"], x: 920, y: 120, width: 130, height: 58, tone: "improvement", dashed: true },
    { id: "contract-review", label: ["Contract", "Review"], x: 1100, y: 220, width: 140, height: 62, tone: "specification" },
    { id: "inquiries", label: ["Inquiries /", "Quotes"], x: 1300, y: 220, width: 130, height: 62, tone: "specification" },
    { id: "supplier", label: ["Supplier"], x: 20, y: 400, width: 130, height: 62, tone: "neutral", dashed: true },
    { id: "incoming-material", label: ["Incoming", "Material"], x: 370, y: 350, width: 140, height: 62, tone: "production" },
    { id: "erp", label: ["ERP"], x: 610, y: 340, width: 90, height: 78, tone: "integration" },
    { id: "control-plan", label: ["Control Plan"], x: 800, y: 350, width: 150, height: 62, tone: "specification" },
    { id: "work-orders", label: ["Work Orders /", "Job Orders"], x: 800, y: 450, width: 150, height: 62, tone: "production" },
    { id: "inspections", label: ["Inspections"], x: 370, y: 520, width: 140, height: 62, tone: "quality" },
    { id: "purchase-orders", label: ["Purchase", "Orders"], x: 130, y: 560, width: 130, height: 62, tone: "neutral", dashed: true },
    { id: "final-inspections", label: ["Final", "Inspections"], x: 1080, y: 470, width: 150, height: 62, tone: "production" },
    { id: "end-user", label: ["End User"], x: 1020, y: 550, width: 130, height: 62, tone: "neutral", dashed: true },
    { id: "customer", label: ["Customer"], x: 1200, y: 550, width: 130, height: 62, tone: "neutral", dashed: true },
    { id: "supplier-onboarding", label: ["Supplier", "Onboarding"], x: 130, y: 680, width: 140, height: 62, tone: "externalProcess" },
    { id: "supplier-audits", label: ["Supplier Audits"], x: 130, y: 770, width: 140, height: 62, tone: "externalProcess" },
    { id: "supplier-scoring", label: ["Supplier", "Scoring"], x: 130, y: 860, width: 140, height: 62, tone: "externalProcess" },
    { id: "emergency-supplier", label: ["Emergency", "Supplier", "Authorization"], x: 130, y: 950, width: 140, height: 78, tone: "externalProcess" },
    { id: "rma", label: ["RMA / Return", "Goods"], x: 130, y: 1060, width: 140, height: 62, tone: "externalProcess" },
    { id: "deviations", label: ["Deviations"], x: 360, y: 710, width: 150, height: 62, tone: "quality" },
    { id: "ncs", label: ["NCs / Defects"], x: 530, y: 710, width: 140, height: 62, tone: "quality" },
    { id: "layered-audits", label: ["Layered", "Process Audits"], x: 750, y: 540, width: 140, height: 62, tone: "improvement" },
    { id: "internal-audits", label: ["Internal Audits"], x: 750, y: 640, width: 140, height: 62, tone: "improvement" },
    { id: "corrective-actions", label: ["Corrective", "Actions"], x: 750, y: 740, width: 140, height: 62, tone: "improvement" },
    { id: "change-requests", label: ["Change", "Requests"], x: 750, y: 840, width: 140, height: 62, tone: "improvement" },
    { id: "root-cause", label: ["Root Cause", "Analysis"], x: 570, y: 845, width: 140, height: 62, tone: "improvement" },
    { id: "complaints", label: ["Complaints /", "VOC / Tickets"], x: 1080, y: 740, width: 150, height: 62, tone: "quality" },
    { id: "crm", label: ["CRM"], x: 1370, y: 710, width: 80, height: 72, tone: "integration" },
    { id: "email", label: ["Email"], x: 1100, y: 880, width: 90, height: 72, tone: "integration" },
    { id: "job-role", label: ["Job Description", "/ Role"], x: 560, y: 960, width: 140, height: 62, tone: "training" },
    { id: "training-modules", label: ["Training", "Modules"], x: 790, y: 960, width: 140, height: 62, tone: "training" },
    { id: "employee", label: ["Employee"], x: 560, y: 1070, width: 140, height: 62, tone: "neutral", dashed: true },
    { id: "training-records", label: ["Training", "Records"], x: 560, y: 1170, width: 140, height: 62, tone: "training" },
];

const flowEdges: FlowEdge[] = [
    { from: "document-server", to: "calibration", fromSide: "right", toSide: "top", dashed: true, via: [[220, 80], [220, 220]] },
    { from: "document-server", to: "rm-specs", fromSide: "right", toSide: "top", dashed: true, via: [[390, 80], [390, 220]] },
    { from: "document-server", to: "docs-sops", fromSide: "right", toSide: "top", dashed: true, via: [[590, 80], [590, 220]] },
    { from: "document-server", to: "specs-bom", fromSide: "right", toSide: "top", dashed: true, via: [[820, 80], [820, 220]] },
    { from: "calibration", to: "supplier", fromSide: "left", toSide: "top", via: [[90, 251]] },
    { from: "supplier", to: "purchase-orders", fromSide: "bottom", toSide: "left", via: [[70, 590]] },
    { from: "purchase-orders", to: "incoming-material", fromSide: "right", toSide: "left", via: [[300, 591]] },
    { from: "rm-specs", to: "incoming-material", fromSide: "bottom", toSide: "top", dashed: true },
    { from: "incoming-material", to: "inspections", fromSide: "bottom", toSide: "top" },
    { from: "incoming-material", to: "erp", fromSide: "right", toSide: "left" },
    { from: "docs-sops", to: "work-orders", fromSide: "bottom", toSide: "left", dashed: true, via: [[635, 481]] },
    { from: "specs-bom", to: "work-orders", fromSide: "bottom", toSide: "top", dashed: true },
    { from: "control-plan", to: "work-orders", fromSide: "bottom", toSide: "top" },
    { from: "apqp", to: "specs-bom", fromSide: "left", toSide: "top", dashed: true, via: [[860, 149], [860, 220]] },
    { from: "inquiries", to: "contract-review", fromSide: "left", toSide: "right" },
    { from: "contract-review", to: "specs-bom", fromSide: "left", toSide: "right" },
    { from: "work-orders", to: "final-inspections", fromSide: "right", toSide: "left" },
    { from: "final-inspections", to: "customer", fromSide: "bottom", toSide: "top" },
    { from: "end-user", to: "complaints", fromSide: "bottom", toSide: "top" },
    { from: "customer", to: "complaints", fromSide: "bottom", toSide: "top", dashed: true },
    { from: "inspections", to: "deviations", fromSide: "bottom", toSide: "top" },
    { from: "inspections", to: "ncs", fromSide: "right", toSide: "top", via: [[600, 551], [600, 710]] },
    { from: "ncs", to: "root-cause", fromSide: "bottom", toSide: "top", dashed: true },
    { from: "deviations", to: "corrective-actions", fromSide: "right", toSide: "left", via: [[700, 741]] },
    { from: "ncs", to: "corrective-actions", fromSide: "right", toSide: "left", dashed: true, via: [[700, 741]] },
    { from: "root-cause", to: "corrective-actions", fromSide: "right", toSide: "bottom", dashed: true, via: [[960, 876], [960, 771]] },
    { from: "layered-audits", to: "internal-audits", fromSide: "bottom", toSide: "top" },
    { from: "internal-audits", to: "corrective-actions", fromSide: "bottom", toSide: "top" },
    { from: "corrective-actions", to: "change-requests", fromSide: "bottom", toSide: "top" },
    { from: "complaints", to: "corrective-actions", fromSide: "left", toSide: "right", via: [[930, 771]] },
    { from: "complaints", to: "crm", fromSide: "right", toSide: "left", dashed: true },
    { from: "complaints", to: "email", fromSide: "bottom", toSide: "top", dashed: true },
    { from: "supplier-onboarding", to: "supplier", fromSide: "top", toSide: "bottom", via: [[70, 711]] },
    { from: "supplier-audits", to: "supplier", fromSide: "top", toSide: "bottom", via: [[70, 801]] },
    { from: "supplier-scoring", to: "supplier", fromSide: "top", toSide: "bottom", via: [[70, 891]] },
    { from: "emergency-supplier", to: "supplier", fromSide: "top", toSide: "bottom", via: [[70, 989]] },
    { from: "rma", to: "supplier", fromSide: "right", toSide: "bottom", via: [[310, 1091], [310, 451], [70, 451]] },
    { from: "job-role", to: "employee", fromSide: "bottom", toSide: "top", dashed: true },
    { from: "training-modules", to: "employee", fromSide: "bottom", toSide: "right", via: [[860, 1100]] },
    { from: "training-modules", to: "training-records", fromSide: "bottom", toSide: "right", via: [[860, 1201]] },
    { from: "employee", to: "training-records", fromSide: "bottom", toSide: "top" },
    { from: "erp", to: "work-orders", fromSide: "right", toSide: "left", dashed: true },
    { from: "erp", to: "ncs", fromSide: "bottom", toSide: "top" },
];

function getFlowAnchor(node: FlowNode, side: FlowEdgeSide) {
    if (side === "top") return { x: node.x + node.width / 2, y: node.y };
    if (side === "right") return { x: node.x + node.width, y: node.y + node.height / 2 };
    if (side === "bottom") return { x: node.x + node.width / 2, y: node.y + node.height };
    return { x: node.x, y: node.y + node.height / 2 };
}

const flowNodeLookup = Object.fromEntries(flowNodes.map((node) => [node.id, node])) as Record<string, FlowNode>;

function renderFlowChartSvg(
    viewBox: string,
    className: string,
    markerId: string,
    focus?: { nodeIds: string[]; edgePairs: string[] },
) {
    const focusedNodes = new Set(focus?.nodeIds ?? []);
    const focusedEdges = new Set(focus?.edgePairs ?? []);

    return (
        <svg viewBox={viewBox} className={className} role="img" aria-label="Quality process flow chart">
            <defs>
                <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
                </marker>
            </defs>

            {flowEdges.map((edge) => {
                const fromNode = flowNodeLookup[edge.from];
                const toNode = flowNodeLookup[edge.to];

                if (!fromNode || !toNode) return null;

                const start = getFlowAnchor(fromNode, edge.fromSide ?? "right");
                const end = getFlowAnchor(toNode, edge.toSide ?? "left");
                const points = [start, ...(edge.via ?? []).map(([x, y]) => ({ x, y })), end];
                const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
                const edgePair = `${edge.from}->${edge.to}`;
                const isFocused = focusedEdges.size > 0 ? focusedEdges.has(edgePair) : true;

                return (
                    <motion.path
                        key={`${edge.from}-${edge.to}-${edge.fromSide ?? "right"}-${edge.toSide ?? "left"}`}
                        d={pathData}
                        fill="none"
                        stroke={isFocused ? "#334155" : "#94A3B8"}
                        strokeWidth={isFocused ? 2.1 : 1.3}
                        opacity={isFocused ? 0.95 : 0.24}
                        strokeDasharray={edge.dashed ? "6 5" : undefined}
                        markerEnd={`url(#${markerId})`}
                        animate={
                            isFocused
                                ? { strokeDashoffset: edge.dashed ? [-11, 0] : [-14, 0] }
                                : undefined
                        }
                        transition={
                            isFocused
                                ? {
                                      duration: edge.dashed ? 1.2 : 1.35,
                                      ease: "linear",
                                      repeat: Number.POSITIVE_INFINITY,
                                  }
                                : undefined
                        }
                    />
                );
            })}

            {flowNodes.map((node) => {
                const style = flowToneStyles[node.tone];
                const textStartY = node.y + node.height / 2 - ((node.label.length - 1) * 8);
                const isFocused = focusedNodes.size > 0 ? focusedNodes.has(node.id) : true;

                return (
                    <motion.g
                        key={node.id}
                        animate={isFocused ? { scale: [1, 1.02, 1] } : undefined}
                        transition={
                            isFocused
                                ? { duration: 1.6, ease: "easeOut", repeat: Number.POSITIVE_INFINITY }
                                : undefined
                        }
                        style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
                        opacity={isFocused ? 1 : 0.34}
                    >
                        <rect
                            x={node.x}
                            y={node.y}
                            width={node.width}
                            height={node.height}
                            rx="9"
                            fill={style.fill}
                            stroke={style.stroke}
                            strokeWidth="2"
                            strokeDasharray={node.dashed ? "12 8" : undefined}
                        />
                        <text
                            x={node.x + node.width / 2}
                            y={textStartY}
                            fill={style.text}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="600"
                        >
                            {node.label.map((line, index) => (
                                <tspan key={line} x={node.x + node.width / 2} dy={index === 0 ? 0 : 17}>
                                    {line}
                                </tspan>
                            ))}
                        </text>
                    </motion.g>
                );
            })}

        </svg>
    );
}

const solidTabIconClass = "size-[14px] [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current";
const tabContentVariants = {
    enter: { opacity: 0, y: 10 },
    center: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.18,
            ease: "easeOut" as const,
            when: "beforeChildren" as const,
            staggerChildren: 0.04,
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: { duration: 0.12, ease: "easeIn" as const },
    },
};

const tabItemVariants = {
    enter: { opacity: 0, y: 6 },
    center: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.16, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        y: -4,
        transition: { duration: 0.1, ease: "easeIn" as const },
    },
};

export default function IndustriesSection() {
    const [activeIndustry, setActiveIndustry] = useState("nutritional-supplements");
    const [isIndustryDetailsOpen, setIsIndustryDetailsOpen] = useState(false);
    const [isProcessMapOpen, setIsProcessMapOpen] = useState(false);
    const [previewSceneIndex, setPreviewSceneIndex] = useState(0);
    const [isPanningMap, setIsPanningMap] = useState(false);
    const mapPanStartRef = useRef<{
        pointerId: number;
        x: number;
        y: number;
        scrollLeft: number;
        scrollTop: number;
    } | null>(null);
    const shouldReduceMotion = useReducedMotion();
    const activeContent = useMemo(
        () => contentByIndustry[activeIndustry] ?? contentByIndustry.all,
        [activeIndustry],
    );
    const activeTab = useMemo(
        () => industryTabs.find((tab) => tab.value === activeIndustry) ?? industryTabs[0],
        [activeIndustry],
    );
    const ActiveTabIcon = activeTab.icon;
    const previewScenes = useMemo(
        () =>
            previewSceneBlueprints.map((scene) => ({
                ...scene,
                title: activeContent.features[scene.featureIndex]?.title ?? activeTab.label,
            })),
        [activeContent.features, activeTab.label],
    );
    const currentPreviewScene = previewScenes[previewSceneIndex] ?? previewScenes[0];

    useEffect(() => {
        if (shouldReduceMotion || previewScenes.length <= 1) return;

        const intervalId = window.setInterval(() => {
            setPreviewSceneIndex((prev) => (prev + 1) % previewScenes.length);
        }, 2800);

        return () => window.clearInterval(intervalId);
    }, [previewScenes.length, shouldReduceMotion]);

    const handleMapPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        mapPanStartRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            scrollLeft: event.currentTarget.scrollLeft,
            scrollTop: event.currentTarget.scrollTop,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsPanningMap(true);
    };

    const handleMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const panStart = mapPanStartRef.current;
        if (!panStart || panStart.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - panStart.x;
        const deltaY = event.clientY - panStart.y;
        event.currentTarget.scrollLeft = panStart.scrollLeft - deltaX;
        event.currentTarget.scrollTop = panStart.scrollTop - deltaY;
    };

    const handleMapPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
        const panStart = mapPanStartRef.current;
        if (!panStart || panStart.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        mapPanStartRef.current = null;
        setIsPanningMap(false);
    };

    return (
        <section className="hero-noise-bg bg-[#F6F9FF] py-16 sm:py-20 lg:py-24">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Factory className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Industries</span>
                    </div>

                    <h2 className="mx-auto max-w-[24ch] px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:text-[36px] lg:leading-[1.2]">
                        Unifize adapts to the unique requirements of your industry
                    </h2>
                    <p className="mx-auto mt-5 max-w-[58ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:mt-6 sm:text-[15px] lg:text-[17px] lg:leading-[1.72]">
                        Enhance collaboration and streamline processes for all industries.
                    </p>
                </div>

                <Tabs value={activeIndustry} onValueChange={setActiveIndustry} className="mx-auto mt-8 w-full max-w-6xl gap-0 sm:mt-10">
                    <div className="sm:pl-0">
                        <TabsList className="mx-auto flex h-auto w-full max-w-5xl flex-wrap items-center justify-center gap-2 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:!h-auto sm:gap-3">
                            {industryTabs.map((tab) => {
                                const Icon = tab.icon;

                                return (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className={cn(
                                        "h-auto min-w-max flex-none rounded-full border border-[#EEF3FF] bg-white px-4 py-2.5 text-[13px] font-medium text-slate-600 transition-colors duration-150 sm:text-sm",
                                        "data-[state=active]:!border-[#0052FF] data-[state=active]:!bg-[#0052FF] data-[state=active]:!text-white",
                                    )}
                                >
                                    <Icon className={solidTabIconClass} aria-hidden="true" />
                                    <span>{tab.label}</span>
                                </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>
                </Tabs>

                <div className="mx-auto mt-10 grid w-full max-w-6xl gap-8 px-4 sm:px-0 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
                    <div className="min-w-0 flex h-full flex-col lg:min-h-[548px]">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={activeIndustry}
                                variants={tabContentVariants}
                                initial={shouldReduceMotion ? false : "enter"}
                                animate="center"
                                exit={shouldReduceMotion ? undefined : "exit"}
                                className="flex h-full flex-col"
                            >
                                <motion.div variants={tabItemVariants} className="flex flex-col items-start gap-3">
                                    <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0052FF]/10 text-[#0052FF]">
                                        <ActiveTabIcon className={cn(solidTabIconClass, "size-8")} aria-hidden="true" />
                                    </span>
                                    <h3 className="text-balance text-[24px] font-semibold leading-[1.24] tracking-[-0.015em] text-black sm:text-[26px] lg:text-[28px]">
                                        {activeTab.label}
                                    </h3>
                                </motion.div>

                                <motion.p variants={tabItemVariants} className="mt-3 max-w-[60ch] text-pretty text-[14px] font-normal leading-[1.65] text-slate-600 sm:text-[15px] lg:text-[16px]">
                                    {activeContent.lead}
                                </motion.p>

                                <motion.div variants={tabItemVariants} className="mt-8 flex flex-col lg:mt-auto lg:pt-10">
                                    <ul>
                                        {activeContent.features.slice(0, 3).map((feature) => {
                                            const FeatureIcon = feature.icon;

                                            return (
                                                <motion.li
                                                    key={feature.title}
                                                    variants={tabItemVariants}
                                                    className="flex gap-3.5 border-b border-dashed border-[#D9E5FF] py-4 last:border-b-0 sm:py-4.5"
                                                >
                                                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0052FF]/10 text-[#0052FF]">
                                                        <FeatureIcon
                                                            className="size-4 [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current"
                                                            aria-hidden
                                                        />
                                                    </span>
                                                    <div>
                                                        <h4 className="text-[15px] font-semibold leading-tight tracking-[-0.015em] text-slate-900 sm:text-base">
                                                            {feature.title}
                                                        </h4>
                                                        <p className="mt-1 text-pretty text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>

                                    <motion.div variants={tabItemVariants} className="mt-4 flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsIndustryDetailsOpen(true)}
                                            className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#0052FF] bg-[#0052FF] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#0052FF]"
                                        >
                                            View All
                                        </button>
                                        <a
                                            href="#"
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-transparent px-6 text-[14px] font-medium text-[#0052FF] transition-colors hover:bg-white/70"
                                        >
                                            <Play
                                                className="size-4 fill-current [stroke-width:1.9] [&_path]:fill-current [&_path]:stroke-current [&_polygon]:fill-current [&_polygon]:stroke-current"
                                                aria-hidden="true"
                                            />
                                            View Demo
                                        </a>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="min-w-0 rounded-[24px] border border-[#EEF3FF] bg-white p-3 sm:p-4 lg:flex lg:h-full lg:min-h-[548px] lg:flex-col">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 py-0.5 sm:px-1.5">
                            <div>
                                <p className="text-[11px] font-medium text-slate-500 sm:text-[12px]">End-to-End Flow Chart</p>
                                <p className="text-[14px] font-semibold text-slate-900 sm:text-[15px]">{activeTab.label} Template</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsProcessMapOpen(true)}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-[10px] bg-[#0052FF] px-4 text-[13px] font-medium text-white"
                            >
                                <Route className="size-3.5 [stroke-width:2.2]" aria-hidden="true" />
                                View Process Map
                            </button>
                        </div>

                        <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-[#FCFCFD] sm:min-h-[340px] lg:min-h-0 lg:flex-1">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-80 [background-image:radial-gradient(circle,_rgba(148,163,184,0.35)_1px,_transparent_1px)] [background-size:18px_18px]"
                            />
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={`${activeIndustry}-${previewSceneIndex}`}
                                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute inset-0"
                                >
                                    {renderFlowChartSvg(
                                        currentPreviewScene?.viewBox ?? "0 0 1500 700",
                                        "relative z-10 h-full w-full max-w-none",
                                        "flow-arrow-preview",
                                        currentPreviewScene
                                            ? { nodeIds: currentPreviewScene.nodeIds, edgePairs: currentPreviewScene.edgePairs }
                                            : undefined,
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 border-t border-[#EEF3FF] bg-[#FCFCFD] px-3 py-2.5 text-[11px] font-medium text-slate-600 sm:px-4 sm:py-3 sm:text-[12px]">
                                {currentPreviewScene?.title ?? activeTab.label}. Open the process map to view the full graph.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isIndustryDetailsOpen} onOpenChange={setIsIndustryDetailsOpen}>
                <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[#EEF3FF] bg-white p-0 shadow-xl sm:max-w-[760px]">
                    <div className="px-6 py-6 sm:px-7 sm:py-7">
                        <div className="flex items-start gap-4">
                            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0052FF]/10 text-[#0052FF]">
                                <ActiveTabIcon className={cn(solidTabIconClass, "size-8")} aria-hidden="true" />
                            </span>
                            <div>
                                <DialogTitle className="text-balance text-[24px] font-semibold leading-[1.24] tracking-[-0.015em] text-black sm:text-[26px]">
                                    {activeTab.label}
                                </DialogTitle>
                                <DialogDescription className="mt-2 max-w-[65ch] text-pretty text-[14px] leading-[1.65] text-slate-600 sm:text-[15px]">
                                    {activeContent.lead}
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-[#E7EFFF] bg-[#F8FBFF] p-4 sm:p-5">
                            <ul className="space-y-0">
                                {activeContent.features.map((feature) => {
                                    const FeatureIcon = feature.icon;

                                    return (
                                        <li
                                            key={`${activeIndustry}-${feature.title}`}
                                            className="flex gap-3.5 border-b border-dashed border-[#D9E5FF] py-4 first:pt-0 last:border-b-0 last:pb-0"
                                        >
                                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0052FF]/10 text-[#0052FF]">
                                                <FeatureIcon
                                                    className="size-4 [stroke-width:2.2] [&_path]:fill-current [&_path]:stroke-current [&_circle]:fill-current [&_circle]:stroke-current [&_rect]:fill-current [&_rect]:stroke-current"
                                                    aria-hidden
                                                />
                                            </span>
                                            <div>
                                                <h4 className="text-[15px] font-semibold leading-tight tracking-[-0.015em] text-slate-900 sm:text-base">
                                                    {feature.title}
                                                </h4>
                                                <p className="mt-1 text-pretty text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isProcessMapOpen} onOpenChange={setIsProcessMapOpen}>
                <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl border border-[#EEF3FF] bg-white p-0 shadow-xl sm:max-w-[96vw] lg:max-w-[1400px]">
                    <div className="flex h-full flex-col px-4 py-4 sm:px-5 sm:py-5">
                        <DialogTitle className="text-balance text-[20px] font-semibold leading-tight text-slate-900 sm:text-[22px]">
                            Full Process Map
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-pretty text-[13px] leading-[1.55] text-slate-600 sm:text-[14px]">
                            Explore the full end-to-end quality flow with all dependencies, integrations, and control loops.
                        </DialogDescription>
                        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-slate-600 sm:text-[12px]">
                            {flowLegendItems.map((item) => {
                                const tone = flowToneStyles[item.tone];

                                return (
                                    <li key={item.label} className="inline-flex items-center gap-2 whitespace-nowrap">
                                        <span
                                            aria-hidden="true"
                                            className="size-3 rounded-[4px] border"
                                            style={{ backgroundColor: tone.fill, borderColor: tone.stroke }}
                                        />
                                        {item.label}
                                    </li>
                                );
                            })}
                        </ul>
                        <div
                            className={cn(
                                "mt-4 h-[72dvh] overflow-hidden rounded-2xl border border-[#EEF3FF] bg-[#FBFDFF] select-none touch-none",
                                isPanningMap ? "cursor-grabbing" : "cursor-grab",
                            )}
                            onPointerDown={handleMapPointerDown}
                            onPointerMove={handleMapPointerMove}
                            onPointerUp={handleMapPointerEnd}
                            onPointerCancel={handleMapPointerEnd}
                        >
                            {renderFlowChartSvg("-80 -60 1660 1400", "h-full w-full", "flow-arrow-modal")}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
