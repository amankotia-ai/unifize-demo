import * as React from "react";
import { X, Globe, CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface ShareDialogProps {
  /** The URL to share */
  url?: string;
  /** Whether public access is enabled */
  isPublic?: boolean;
  /** Callback when the public toggle changes */
  onTogglePublic?: (checked: boolean) => void;
  /** Callback when the close button is clicked */
  onClose?: () => void;
  /** Callback when the copy button is clicked */
  onCopy?: (url: string) => void;
  /** Callback when invite is submitted */
  onInvite?: (email: string, permission: string) => void;
  /** Additional class names */
  className?: string;
}

export function ShareDialog({
  url = "https://example.com",
  isPublic: controlledPublic,
  onTogglePublic,
  onClose,
  onCopy,
  onInvite,
  className,
}: ShareDialogProps) {
  const [internalPublic, setInternalPublic] = React.useState(true);
  const isPublic = controlledPublic ?? internalPublic;

  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleToggle = () => {
    const next = !isPublic;
    setInternalPublic(next);
    onTogglePublic?.(next);
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(url);
    } else {
      navigator.clipboard?.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (email.trim()) {
      onInvite?.(email.trim(), "view");
      setEmail("");
    }
  };

  return (
    <div
      className={cn(
        "w-[400px] rounded-[20px] bg-[#f7f7f7] font-sans",
        className
      )}
    >
      <div
        className="relative rounded-[20px] flex flex-col items-start w-full shadow-[0_0_0_1px_rgba(51,51,51,0.04),0_16px_8px_-8px_rgba(51,51,51,0.01),0_12px_6px_-6px_rgba(51,51,51,0.02),0_5px_5px_-2.5px_rgba(51,51,51,0.08),0_1px_3px_-1.5px_rgba(51,51,51,0.16)]"
        style={{
          paddingBottom: isPublic ? 16 : 0,
          transition:
            "padding-bottom 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)",
        }}
      >
        {/* White background layer */}
        <div className="absolute inset-0 bg-white pointer-events-none rounded-[20px]" />

        {/* Header */}
        <div className="relative bg-white border-b border-[#ebebeb] px-4 py-4 flex items-center justify-between w-full rounded-t-[20px] overflow-hidden z-[1]">
          <span className="text-base font-medium leading-6 text-[#5c5c5c] tracking-[-0.011em]">
            Share
          </span>
          <button
            onClick={onClose}
            className="relative overflow-clip shrink-0 size-5 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close share dialog"
          >
            <X
              size={13}
              weight="bold"
              className="text-[#5c5c5c] absolute inset-[18%]"
            />
          </button>
        </div>

        {/* Access row — always visible */}
        <div className="flex flex-col w-full relative z-[1]">
          <div className="relative px-4 w-full">
            <div className="bg-[#f7f7f7] p-3 rounded-2xl flex items-center justify-between w-full">
              <div className="flex gap-2 items-center">
                {/* Globe icon */}
                <div
                  className="relative flex items-center justify-center p-2 rounded-lg shrink-0"
                  style={{
                    background:
                      "linear-gradient(179.99deg, rgba(255,255,255,0.153) 6.67%, rgba(255,255,255,0) 103.33%), rgb(0, 136, 254)",
                    boxShadow:
                      "rgba(51,51,51,0.04) 0px 0.6px 0.6px 0.3px, rgba(51,51,51,0.02) 0px 1.8px 1.8px -0.9px, rgba(51,51,51,0.04) 0px 3.6px 3.6px -1.8px, rgba(51,51,51,0.04) 0px 7.2px 7.2px -3.6px, rgba(51,51,51,0.04) 0px 14.4px 14.4px -7.2px, rgba(51,51,51,0.04) 0px 28.8px 28.8px -14.4px, rgb(0, 136, 254) 0px 0px 0px 0.45px",
                  }}
                >
                  <Globe size={20} weight="fill" className="text-white" />
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{
                      boxShadow:
                        "rgba(255,255,255,0.25) 0px -2px 4px 0px inset, rgba(255,255,255,0.16) 0px 2px 4px 0px inset",
                    }}
                  />
                </div>

                <div className="flex flex-col leading-5">
                  <p className="font-medium text-sm text-[#171717] tracking-[-0.006em]">
                    Anyone
                  </p>
                  <p className="font-normal text-[13px] text-[#5c5c5c] tracking-[-0.006em]">
                    Every one with link can access
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                role="switch"
                aria-checked={isPublic}
                aria-label="Toggle public access"
                onClick={handleToggle}
                className="relative shrink-0 h-5 w-10 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3592f9] focus-visible:ring-offset-2"
                style={{
                  background: isPublic
                    ? "rgb(53, 146, 249)"
                    : "rgba(218, 218, 219, 0.8)",
                  transition: "background 0.22s",
                }}
              >
                <span
                  className="absolute top-[2px] left-[2px] w-[22px] h-4 rounded-full bg-white"
                  style={{
                    boxShadow: isPublic
                      ? "rgba(0,0,0,0.3) 0px 0px 1px 0px, rgba(0,0,0,0.06) 0px 2px 10px 0px, rgba(0,0,0,0.02) 0px 0px 5px 0px"
                      : "rgba(0,0,0,0.04) 0px 2px 4px 0px, rgba(0,0,0,0.06) 0px 1px 2px 0px, rgba(0,0,0,0.06) 0px 0px 1px 0px",
                    transform: isPublic
                      ? "translateX(14px)"
                      : "translateX(0px)",
                    transition: "transform 0.22s, box-shadow 0.22s",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Invite members section — visible when toggle is OFF */}
          <div
            className="overflow-hidden w-full"
            style={{
              height: isPublic ? 0 : "auto",
              opacity: isPublic ? 0 : 1,
              transition:
                "height 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)",
            }}
          >
            <div className="relative px-4 pt-4 pb-4 flex flex-col gap-1 items-start w-full">
              <div className="flex items-center gap-1 pr-2">
                <p className="font-medium text-sm leading-[1.43] text-[#18181b] whitespace-nowrap">
                  Invite members
                </p>
              </div>
              <div className="flex gap-2 items-start w-full">
                {/* Email input */}
                <div
                  className="relative flex flex-1 min-h-[36px] items-start px-3 py-2 rounded-[12px] overflow-clip border border-transparent cursor-text"
                  style={{
                    boxShadow:
                      "rgba(0,0,0,0.04) 0px 2px 4px 0px, rgba(0,0,0,0.06) 0px 1px 2px 0px, rgb(235,235,235) 0px 0px 1px 0.5px",
                  }}
                >
                  <div className="absolute inset-0 bg-white rounded-[12px] pointer-events-none" />
                  <div className="relative flex flex-1 items-start justify-between min-w-0 gap-2">
                    <div className="flex flex-wrap gap-[6px] items-center flex-1 min-w-0">
                      <input
                        placeholder="Enter email"
                        className="flex-1 min-w-[90px] h-5 text-sm font-normal leading-5 text-[#18181b] placeholder:text-[#71717a] bg-transparent outline-none border-none tracking-[-0.006em]"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleInvite();
                        }}
                      />
                    </div>
                    <div className="shrink-0 h-5 flex items-center">
                      <button className="flex gap-1 items-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3592f9] rounded-sm">
                        <p className="font-normal text-[13px] leading-5 text-[#71717a] whitespace-nowrap">
                          Can view
                        </p>
                        <CaretDown
                          size={10}
                          weight="bold"
                          className="text-[#a4a4a4]"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Invite button */}
                <button
                  onClick={handleInvite}
                  className="relative flex h-9 items-center justify-center overflow-clip px-4 py-2 rounded-lg shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-1"
                  style={{
                    boxShadow:
                      "rgb(23,23,23) 0px 0px 0px 0.75px, rgba(51,51,51,0.01) 0px 16px 8px -8px, rgba(51,51,51,0.02) 0px 12px 6px -6px, rgba(51,51,51,0.08) 0px 5px 5px -2.5px, rgba(51,51,51,0.16) 0px 1px 3px -1.5px",
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(179.99deg, rgba(255,255,255,0.153) 6.67%, rgba(255,255,255,0) 103.33%), linear-gradient(90deg, rgb(23,23,23) 0%, rgb(23,23,23) 100%)",
                    }}
                  />
                  <span className="relative font-medium text-sm leading-5 text-white whitespace-nowrap tracking-[-0.006em]">
                    Invite
                  </span>
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[inherit]"
                    style={{
                      boxShadow:
                        "rgba(255,255,255,0.16) 0px 1px 2px 0px inset",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inner shadow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-[2]"
          style={{
            boxShadow: "rgba(51,51,51,0.08) 0px -0.5px 0.5px 0px inset",
          }}
        />
      </div>

      {/* Footer: URL + Copy link */}
      <div className="flex items-center justify-between overflow-clip px-4 py-4 w-full">
        <span className="font-medium text-sm leading-5 text-[#5c5c5c] truncate tracking-[-0.006em]">
          {url}
        </span>
        <button
          onClick={handleCopy}
          className="relative overflow-hidden shrink-0 flex gap-1 items-center justify-center bg-white px-1.5 py-1.5 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 shadow-[0_1px_3px_0_rgba(14,18,27,0.12),0_0_0_1px_#ebebeb]"
          aria-label="Copy link to clipboard"
        >
          <span className="font-medium text-sm leading-5 text-[#5c5c5c] whitespace-nowrap px-1 tracking-[-0.006em]">
            {copied ? (
              <span className="flex items-center gap-1">
                <Check
                  size={14}
                  weight="bold"
                  className="text-green-600"
                />
                Copied!
              </span>
            ) : (
              "Copy link"
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
