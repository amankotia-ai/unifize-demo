import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BookDemoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone: string;
}

const TIME_SLOTS = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function StepBadge({
    index,
    active,
    complete,
}: {
    index: 1 | 2;
    active: boolean;
    complete: boolean;
}) {
    return (
        <div className="flex items-center gap-2.5">
            <span
                className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    complete || active ? "bg-[#0052FF] text-white" : "bg-slate-100 text-slate-500"
                )}
            >
                {complete ? <Check className="h-3.5 w-3.5" /> : index}
            </span>
            <span className={cn("text-sm", active ? "text-slate-900 font-medium" : "text-slate-500")}>
                {index === 1 ? "Your details" : "Pick a time"}
            </span>
        </div>
    );
}

function MiniCalendar({
    selectedDate,
    onSelect,
}: {
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
}) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    const calendarDays = useMemo(() => {
        // Shift so week starts on Monday
        const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    }, [viewMonth, viewYear]);

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
            return;
        }

        setViewMonth(viewMonth - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
            return;
        }

        setViewMonth(viewMonth + 1);
    };

    const isDisabled = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return d < t || d.getDay() === 0 || d.getDay() === 6;
    };
    const isSelected = (day: number) =>
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === viewMonth &&
        selectedDate?.getFullYear() === viewYear;
    const isToday = (day: number) =>
        today.getDate() === day &&
        today.getMonth() === viewMonth &&
        today.getFullYear() === viewYear;

    return (
        <div className="select-none">
            <div className="flex items-center justify-between mb-3">
                <button
                    aria-label="Previous month"
                    onClick={prevMonth}
                    className="size-8 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-slate-800">
                    {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                    aria-label="Next month"
                    onClick={nextMonth}
                    className="size-8 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                    <div key={d} className="text-center py-1 text-[11px] font-medium text-slate-400">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5">
                {calendarDays.map((day, i) => (
                    <div key={i} className="flex items-center justify-center">
                        {day ? (
                            <button
                                disabled={isDisabled(day)}
                                onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
                                className={cn(
                                    "size-8 rounded-lg text-[13px] font-medium transition-colors",
                                    isDisabled(day) && "text-slate-200 cursor-not-allowed",
                                    !isDisabled(day) && isSelected(day) && "bg-[#0052FF] text-white",
                                    !isDisabled(day) && !isSelected(day) && isToday(day) && "text-[#0052FF] bg-blue-50 hover:bg-blue-100",
                                    !isDisabled(day) && !isSelected(day) && !isToday(day) && "text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                {day}
                            </button>
                        ) : (
                            <div className="w-8 h-8" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function BookDemoModal({ open, onOpenChange }: BookDemoModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const updateField = (field: keyof FormData, value: string) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const isStep1Valid =
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.company.trim() !== "";

    const handleNext = () => {
        if (isStep1Valid) {
            setStep(2);
        }
    };
    const handleBack = () => setStep(1);
    const handleSubmit = () => {
        if (selectedDate && selectedTime) {
            setSubmitted(true);
        }
    };

    const handleClose = () => {
        setTimeout(() => {
            setStep(1);
            setFormData({ firstName: "", lastName: "", email: "", company: "", phone: "" });
            setSelectedDate(null);
            setSelectedTime(null);
            setSubmitted(false);
        }, 200);
        onOpenChange(false);
    };

    const handleDialogChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            handleClose();
            return;
        }
        onOpenChange(true);
    };

    const formatSelectedDate = (date: Date) =>
        date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    const inputClassName =
        "h-11 rounded-lg border-slate-200 bg-white text-base shadow-none placeholder:text-slate-400 focus-visible:border-[#0052FF] focus-visible:ring-[#0052FF]/20 sm:text-sm";

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent
                showCloseButton={true}
                className={cn(
                    "p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl",
                    step === 2 && !submitted ? "sm:max-w-[660px]" : "sm:max-w-[500px]"
                )}
            >
                <DialogTitle className="sr-only">Book a Demo</DialogTitle>

                <div className="border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <StepBadge index={1} active={step === 1} complete={step === 2 || submitted} />
                        <div className="h-px w-14 bg-slate-200" />
                        <StepBadge index={2} active={step === 2 || submitted} complete={submitted} />
                    </div>
                </div>

                <div className="px-6 py-6">
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-semibold text-slate-900 text-balance">Tell us about your team</h3>
                                <p className="text-sm text-slate-500 text-pretty">
                                    Add a few details and we&apos;ll prepare a personalized demo.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label htmlFor="demo-first-name" className="text-xs font-medium text-slate-600">
                                        First name
                                    </label>
                                    <Input
                                        id="demo-first-name"
                                        placeholder="Jane"
                                        value={formData.firstName}
                                        onChange={(event) => updateField("firstName", event.target.value)}
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="demo-last-name" className="text-xs font-medium text-slate-600">
                                        Last name
                                    </label>
                                    <Input
                                        id="demo-last-name"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(event) => updateField("lastName", event.target.value)}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="demo-email" className="text-xs font-medium text-slate-600">
                                        Work email
                                    </label>
                                    <Input
                                        id="demo-email"
                                        type="email"
                                        placeholder="jane@company.com"
                                        value={formData.email}
                                        onChange={(event) => updateField("email", event.target.value)}
                                        className={inputClassName}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="demo-company" className="text-xs font-medium text-slate-600">
                                        Company
                                    </label>
                                    <Input
                                        id="demo-company"
                                        placeholder="Acme Inc."
                                        value={formData.company}
                                        onChange={(event) => updateField("company", event.target.value)}
                                        className={inputClassName}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="demo-phone" className="text-xs font-medium text-slate-600">
                                        Phone (optional)
                                    </label>
                                    <Input
                                        id="demo-phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={(event) => updateField("phone", event.target.value)}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={!isStep1Valid}
                                className="h-11 w-full rounded-lg bg-[#0052FF] text-white hover:bg-[#0052FF] disabled:opacity-40"
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && !submitted && (
                        <div className="space-y-4">
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </button>

                            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="mb-3 text-xs font-medium text-slate-500">Date</p>
                                    <MiniCalendar
                                        selectedDate={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            setSelectedTime(null);
                                        }}
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 p-3">
                                    <p className="mb-2 text-xs font-medium text-slate-500">
                                        {selectedDate ? formatSelectedDate(selectedDate) : "Time"}
                                    </p>
                                    {selectedDate ? (
                                        <div className="custom-scrollbar max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
                                            {TIME_SLOTS.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={cn(
                                                        "w-full rounded-md border px-3 py-2 text-sm transition-colors",
                                                        selectedTime === time
                                                            ? "border-[#0052FF] bg-[#0052FF] text-white"
                                                            : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                    )}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[200px] items-center justify-center px-2 text-center text-sm text-slate-400 text-pretty">
                                            Select a date to view available time slots.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={!selectedDate || !selectedTime}
                                className="h-11 w-full rounded-lg bg-[#0052FF] text-white hover:bg-[#0052FF] disabled:opacity-40"
                            >
                                Confirm
                                {selectedDate && selectedTime && ` • ${formatSelectedDate(selectedDate)}, ${selectedTime}`}
                            </Button>
                        </div>
                    )}

                    {submitted && (
                        <div className="space-y-4 py-8 text-center">
                            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50">
                                <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500">
                                    <Check className="h-4.5 w-4.5 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-semibold text-slate-900 text-balance">You&apos;re all set</h3>
                                <p className="text-sm text-slate-500 text-pretty">
                                    {selectedDate && selectedTime
                                        ? `${selectedDate.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })} at ${selectedTime}`
                                        : "Your demo is confirmed."}
                                </p>
                            </div>
                            <p className="text-sm text-slate-500 text-pretty">
                                A confirmation will be sent to <span className="font-medium text-slate-700">{formData.email}</span>.
                            </p>
                            <Button
                                onClick={handleClose}
                                className="mx-auto h-10 rounded-lg bg-slate-900 px-6 text-white hover:bg-slate-800"
                            >
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
