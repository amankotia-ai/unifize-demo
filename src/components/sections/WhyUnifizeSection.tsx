import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Maximize2, Pause, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const subtleEase = [0.16, 1, 0.3, 1] as const;
const wistiaVideoId = import.meta.env.VITE_WISTIA_VIDEO_ID || "f4geihhhnp";

type WistiaAsset = {
    container?: string;
    type?: string;
    url?: string;
    width?: number;
};

type WistiaMediaResponse = {
    media?: {
        assets?: WistiaAsset[];
    };
};

const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return "0:00";

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${seconds}`;
};

const pickBestWistiaAssetUrl = (assets: WistiaAsset[]) => {
    const mp4Asset = [...assets]
        .filter((asset) => {
            if (!asset.url) return false;
            if (asset.container === "mp4") return true;
            return asset.type?.toLowerCase().includes("mp4") || asset.url.toLowerCase().includes(".mp4");
        })
        .sort((assetA, assetB) => (assetB.width ?? 0) - (assetA.width ?? 0))[0];

    if (mp4Asset?.url) return mp4Asset.url;
    return assets.find((asset) => Boolean(asset.url))?.url ?? null;
};

function WistiaCustomPlayer({ videoId }: { videoId: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hideControlsTimeoutRef = useRef<number | null>(null);

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [areControlsVisible, setAreControlsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loadError, setLoadError] = useState(false);

    const clearHideControlsTimeout = () => {
        if (hideControlsTimeoutRef.current === null) return;

        window.clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
    };

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const loadVideo = async () => {
            setVideoUrl(null);
            setIsLoading(true);
            setLoadError(false);

            try {
                const response = await fetch(`https://fast.wistia.com/embed/medias/${videoId}.json`, {
                    signal: abortController.signal,
                });

                if (!response.ok) throw new Error("Failed to fetch Wistia media metadata.");

                const data = (await response.json()) as WistiaMediaResponse;
                const assetUrl = pickBestWistiaAssetUrl(data.media?.assets ?? []);

                if (!assetUrl) throw new Error("No playable Wistia asset was found.");
                if (isMounted) setVideoUrl(assetUrl);
            } catch (error) {
                if (abortController.signal.aborted || !isMounted) return;
                setLoadError(true);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadVideo();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [videoId]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        if (!hasStartedPlayback) {
            clearHideControlsTimeout();
            setAreControlsVisible(false);
            return;
        }

        if (!isPlaying || isHovered) {
            clearHideControlsTimeout();
            setAreControlsVisible(true);
            return;
        }

        clearHideControlsTimeout();
        hideControlsTimeoutRef.current = window.setTimeout(() => {
            setAreControlsVisible(false);
        }, 1000);

        return clearHideControlsTimeout;
    }, [hasStartedPlayback, isHovered, isPlaying]);

    useEffect(() => clearHideControlsTimeout, []);

    const togglePlayback = async () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            await video.play().catch(() => {
                setLoadError(true);
            });
            setHasStartedPlayback(true);
            return;
        }

        video.pause();
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video || !duration) return;

        const nextPercent = Number(event.target.value);
        const nextTime = (nextPercent / 100) * duration;

        video.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    const toggleFullscreen = async () => {
        const container = containerRef.current;
        if (!container) return;

        try {
            if (document.fullscreenElement === container) {
                await document.exitFullscreen();
                return;
            }

            await container.requestFullscreen();
        } catch {
            // Ignore fullscreen API errors and keep inline playback.
        }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const showControls = hasStartedPlayback;

    return (
        <div
            ref={containerRef}
            className="relative size-full bg-black"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {videoUrl ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster="/vsl-cover.png"
                    className="size-full object-cover"
                    playsInline
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlayback}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                    onDurationChange={() => setDuration(videoRef.current?.duration ?? 0)}
                    onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-[#0A0A0A] px-4 text-center text-sm text-[#E8E8E8]">
                    {isLoading ? "Loading video..." : "Unable to load video from Wistia."}
                </div>
            )}

            {videoUrl && !isPlaying && (
                <button
                    type="button"
                    onClick={togglePlayback}
                    aria-label="Play video"
                    className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#0667FF] transition-colors hover:bg-white/85"
                >
                    <Play className="size-10 fill-[#0667FF]" />
                </button>
            )}

            {videoUrl && showControls && (
                <div
                    className={cn(
                        "absolute inset-x-0 bottom-0 p-3 transition-all duration-200 ease-out sm:p-4",
                        areControlsVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
                    )}
                >
                    <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2">
                        <button type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause video" : "Play video"} className="flex size-9 items-center justify-center rounded-md text-[#0B1220] transition-colors hover:bg-black/5">
                            {isPlaying ? <Pause className="size-4 fill-[#0B1220]" /> : <Play className="size-4 fill-[#0B1220]" />}
                        </button>

                        <span className="min-w-[84px] text-left text-xs tabular-nums text-[#0B1220]">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>

                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={0.1}
                            value={progress}
                            onChange={handleSeek}
                            aria-label="Seek video"
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-black/20 accent-[#0B1220]"
                        />

                        <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"} className="flex size-9 items-center justify-center rounded-md text-[#0B1220] transition-colors hover:bg-black/5">
                            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                        </button>

                        <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} className="flex size-9 items-center justify-center rounded-md text-[#0B1220] transition-colors hover:bg-black/5">
                            <Maximize2 className="size-4" />
                        </button>
                    </div>
                </div>
            )}

            {loadError && !isLoading && !videoUrl && (
                <div className="absolute inset-x-4 bottom-4 rounded-lg bg-black/70 px-3 py-2 text-center text-xs text-white/90">
                    Couldn&apos;t load a direct Wistia file for this video.
                </div>
            )}
        </div>
    );
}

const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.32,
            ease: subtleEase,
            when: "beforeChildren" as const,
            staggerChildren: 0.07,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.28, ease: subtleEase },
    },
};

const mediaVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.985 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.32, ease: subtleEase },
    },
};

export default function WhyUnifizeSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.section
            className="hero-noise-bg bg-[#FEFEFF] py-20 sm:py-24 lg:py-28"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "visible"}
            viewport={{ once: true, amount: 0.2 }}
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div variants={itemVariants} className="section-pill mb-5 justify-center sm:mb-6">
                        <span className="section-pill-marker" aria-hidden>
                            <Sparkles className="section-pill-icon" />
                        </span>
                        <span className="section-pill-label">Why Unifize?</span>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="mx-auto px-2 text-balance text-[28px] font-semibold leading-[1.22] tracking-[-0.015em] text-black sm:px-0 sm:text-[34px] lg:max-w-[24ch] lg:text-[36px] lg:leading-[1.2]">
                        One source of truth for people, processes, and information
                    </motion.h2>

                    <motion.p variants={itemVariants} className="mx-auto mt-5 max-w-[40ch] text-pretty text-[14px] font-normal leading-[1.65] text-black sm:mt-6 sm:text-[15px] lg:max-w-[560px] lg:text-[17px] lg:leading-[1.72]">
                        Reduce risk, boost productivity, and speed time to market.
                    </motion.p>

                    <div className="px-2 sm:px-0">
                        <motion.div variants={mediaVariants} className="mx-auto mt-10 w-full max-w-[884px] overflow-hidden rounded-[20px] border border-[#EEF3FF] bg-[#F4F8FF] p-2 sm:p-2">
                            <div className="aspect-video w-full overflow-hidden rounded-[14px] border border-[#EEF3FF] bg-white">
                                <WistiaCustomPlayer videoId={wistiaVideoId} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
