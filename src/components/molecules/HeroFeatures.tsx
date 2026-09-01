import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  SVG icon components matching the original Acctual design           */
/* ------------------------------------------------------------------ */

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 16"
      fill="none"
      className={cn("w-[22px] h-4", className)}
    >
      <path
        d="M 6 8 C 6 3.582 9.582 0 14 0 C 18.418 0 22 3.582 22 8 C 22 12.418 18.418 16 14 16 C 9.582 16 6 12.418 6 8 Z M 1 4 C 1 3.448 1.448 3 2 3 L 4 3 C 4.552 3 5 3.448 5 4 C 5 4.552 4.552 5 4 5 L 2 5 C 1.448 5 1 4.552 1 4 Z M 13 5 L 13 8 C 13 8.265 13.105 8.52 13.293 8.707 L 14.793 10.207 C 15.185 10.586 15.809 10.581 16.195 10.195 C 16.581 9.809 16.586 9.185 16.207 8.793 L 15 7.586 L 15 5 C 15 4.448 14.552 4 14 4 C 13.448 4 13 4.448 13 5 Z M 0 8 C 0 7.448 0.448 7 1 7 L 3 7 C 3.552 7 4 7.448 4 8 C 4 8.552 3.552 9 3 9 L 1 9 C 0.448 9 0 8.552 0 8 Z M 1 12 C 1 11.448 1.448 11 2 11 L 4 11 C 4.552 11 5 11.448 5 12 C 5 12.552 4.552 13 4 13 L 2 13 C 1.448 13 1 12.552 1 12 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 20"
      fill="none"
      className={cn("w-4 h-5", className)}
    >
      <path
        d="M 0 3 C 0 1.343 1.343 0 3 0 L 13 0 C 14.657 0 16 1.343 16 3 L 16 19 C 16 19.39 15.773 19.745 15.418 19.908 C 15.064 20.072 14.647 20.014 14.35 19.76 L 12.667 18.317 L 10.984 19.759 C 10.609 20.08 10.057 20.08 9.682 19.759 L 8 18.317 L 6.318 19.759 C 5.943 20.08 5.391 20.08 5.016 19.759 L 3.333 18.317 L 1.651 19.759 C 1.355 20.013 0.937 20.072 0.582 19.909 C 0.227 19.745 0 19.391 0 19 Z M 5 7 L 11 7 C 11.552 7 12 6.552 12 6 C 12 5.448 11.552 5 11 5 L 5 5 C 4.448 5 4 5.448 4 6 C 4 6.552 4.448 7 5 7 Z M 5 11 L 7 11 C 7.552 11 8 10.552 8 10 C 8 9.448 7.552 9 7 9 L 5 9 C 4.448 9 4 9.448 4 10 C 4 10.552 4.448 11 5 11 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 20"
      fill="none"
      className={cn("w-[15px] h-5", className)}
    >
      <path
        d="M 9.577 0.813 L 2.704 6.595 C -0.498 9.29 -0.916 14.077 1.771 17.289 C 3.059 18.831 4.908 19.796 6.909 19.971 C 8.91 20.147 10.899 19.518 12.436 18.224 L 14.154 16.779 C 15.222 15.88 15.224 14.122 14.465 13.214 C 13.868 12.5 12.227 11.795 11.125 12.722 L 12.629 11.457 C 13.696 10.557 13.835 8.963 12.939 7.892 C 12.509 7.379 11.893 7.057 11.226 6.999 C 10.56 6.941 9.897 7.15 9.385 7.581 L 12.821 4.689 C 13.888 3.789 14.027 2.196 13.132 1.125 C 12.702 0.611 12.086 0.289 11.419 0.231 C 10.752 0.172 10.089 0.382 9.577 0.813 Z M 2.144 1.687 C 2.096 1.423 2.193 1.153 2.399 0.981 L 2.778 0.662 C 4.108 -0.456 6.044 -0.092 6.935 1.26 L 2.691 4.722 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NoFeesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={cn("w-5 h-5", className)}
    >
      <path
        d="M 0 10 C 0 4.477 4.477 0 10 0 C 12.401 0 14.605 0.846 16.329 2.257 L 2.257 16.33 C 0.794 14.545 -0.004 12.308 0 10 Z M 3.671 17.743 C 5.456 19.206 7.693 20.004 10 20 C 15.523 20 20 15.523 20 10 C 20.004 7.693 19.206 5.455 17.743 3.671 L 3.67 17.743 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Feature {
  /** Icon element to render */
  icon: React.ReactNode;
  /** Color for the icon */
  iconColor: string;
  /** Feature title */
  title: string;
  /** Bold lead phrase in the description */
  lead: string;
  /** Rest of the description after the lead */
  description: string;
}

export interface HeroFeaturesProps {
  /** Blue tagline text above the heading */
  tagline?: string;
  /** Main heading text */
  heading?: string;
  /** Array of features to display in the 2x2 grid */
  features?: Feature[];
  /** Additional class names */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Default data                                                       */
/* ------------------------------------------------------------------ */

const defaultFeatures: Feature[] = [
  {
    icon: <ClockIcon />,
    iconColor: "rgb(0, 152, 242)",
    title: "Fast",
    lead: "Create an invoice.",
    description:
      "Add your client and generate a branded design in seconds.",
  },
  {
    icon: <ReceiptIcon />,
    iconColor: "rgb(242, 0, 202)",
    title: "Flexible",
    lead: "Get paid faster.",
    description:
      "Send one link for card payments, bank transfers and stablecoins.",
  },
  {
    icon: <HandIcon />,
    iconColor: "rgb(108, 86, 252)",
    title: "Frictionless",
    lead: "Settle today.",
    description:
      "Send each payment straight to your bank account or crypto wallet.",
  },
  {
    icon: <NoFeesIcon />,
    iconColor: "rgb(255, 99, 99)",
    title: "No fees",
    lead: "Pay per invoice.",
    description:
      "Get premium features and unlimited invoices (no monthly fees).",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroFeatures({
  tagline = "Meet Acctual",
  heading = "We fixed everything that's\nwrong with invoicing",
  features = defaultFeatures,
  className,
}: HeroFeaturesProps) {
  return (
    <section
      className={cn(
        "w-full bg-white px-6 py-16 flex justify-center font-sans",
        className
      )}
    >
      <div className="w-full max-w-[1024px] flex flex-col items-start">
        {/* Header */}
        <div className="flex flex-col items-start mb-12">
          <p
            className="text-sm font-medium leading-5 text-center tracking-[-0.02em] mb-4"
            style={{ color: "rgb(0, 152, 242)" }}
          >
            {tagline}
          </p>
          <h2
            className="text-[40px] font-semibold leading-[48px] tracking-[-0.03em] text-left whitespace-pre-line"
            style={{
              fontFamily:
                '"Open Runde", "Open Runde Placeholder", system-ui, sans-serif',
            }}
          >
            {heading}
          </h2>
        </div>

        {/* 2x2 Feature grid */}
        <div className="grid grid-cols-2 gap-6 w-full">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-start p-6 rounded-2xl bg-[#f0f0f0] border border-[#e5e5e5]"
            >
              {/* Icon + Title row */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#ebebeb]"
                  style={{ color: feature.iconColor }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-xl font-semibold leading-8 tracking-[-0.03em]"
                  style={{
                    fontFamily:
                      '"Open Runde", "Open Runde Placeholder", system-ui, sans-serif',
                  }}
                >
                  {feature.title}
                </h3>
              </div>

              {/* Description */}
              <p
                className="font-medium leading-6 tracking-[-0.02em] text-[#8d8d8d]"
                style={{
                  fontFamily:
                    '"Open Runde", "Open Runde Placeholder", system-ui, sans-serif',
                }}
              >
                <span className="text-[#1e1e1e]">{feature.lead} </span>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
