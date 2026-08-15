"use client";

import * as React from "react";
import {
  ShieldCheck,
  Search,
  FolderTree,
  Rocket,
  Globe,
  Check,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WizardStepStatus = "completed" | "active" | "locked";

export interface WizardStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: WizardStepStatus;
  tooltip?: string;
}

// ---------------------------------------------------------------------------
// Hook — derive wizard steps from current tool state
// ---------------------------------------------------------------------------

interface WizardState {
  connected: boolean;
  hasFiles: boolean;
  pushDone: boolean;
  pushing: boolean;
}

const STEP_DEFS = [
  { id: "connect", label: "Connect", icon: ShieldCheck, tooltip: "Authenticate with GitHub" },
  { id: "analyze", label: "Analyze", icon: Search, tooltip: "Coming soon — scan your project" },
  { id: "organize", label: "Organize", icon: FolderTree, tooltip: "Coming soon — clean up files" },
  { id: "push", label: "Push", icon: Rocket, tooltip: "Upload & push to GitHub" },
  { id: "deploy", label: "Deploy", icon: Globe, tooltip: "Coming soon — deploy to Vercel" },
] as const;

export function useWizardSteps(state: WizardState): WizardStep[] {
  return STEP_DEFS.map((def) => {
    const { id } = def;

    // Connect
    if (id === "connect") {
      if (state.pushDone) return { ...def, status: "completed" as const };
      if (state.connected) return { ...def, status: "completed" as const };
      return { ...def, status: "active" as const };
    }

    // Analyze (coming soon)
    if (id === "analyze") {
      if (state.connected) return { ...def, status: "locked" as const, tooltip: "Coming soon — auto-scan for framework, secrets & cleanup suggestions" };
      return { ...def, status: "locked" as const };
    }

    // Organize (coming soon)
    if (id === "organize") {
      if (state.connected) return { ...def, status: "locked" as const, tooltip: "Coming soon — visual folder tree, .gitignore generator & file editor" };
      return { ...def, status: "locked" as const };
    }

    // Push
    if (id === "push") {
      if (state.pushDone) return { ...def, status: "completed" as const };
      if (state.pushing) return { ...def, status: "active" as const };
      if (state.connected) return { ...def, status: "active" as const };
      return { ...def, status: "locked" as const };
    }

    // Deploy (coming soon)
    if (id === "deploy") {
      if (state.pushDone) return { ...def, status: "locked" as const, tooltip: "Coming soon — one-click Vercel deployment after push" };
      return { ...def, status: "locked" as const };
    }

    return { ...def, status: "locked" as const };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface WizardStepperProps {
  steps: WizardStep[];
}

export function WizardStepper({ steps }: WizardStepperProps) {
  return (
    <nav aria-label="Upload pipeline progress" className="w-full">
      {/* Desktop — horizontal stepper */}
      <div className="hidden sm:flex sm:items-center sm:justify-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <StepCircle step={step} />
            {idx < steps.length - 1 && (
              <ConnectorLine
                fromStatus={step.status}
                toStatus={steps[idx + 1].status}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile — compact horizontal stepper, scrollable */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:hidden">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <StepPill step={step} />
            {idx < steps.length - 1 && (
              <MobileConnector fromStatus={step.status} toStatus={steps[idx + 1].status} />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StepCircle({ step }: { step: WizardStep }) {
  const Icon = step.icon;
  const isCompleted = step.status === "completed";
  const isActive = step.status === "active";
  const isLocked = step.status === "locked";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="group flex flex-col items-center gap-1.5">
          {/* Circle */}
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300",
              isCompleted &&
                "border-brand-green bg-brand-green text-primary-foreground shadow-md shadow-brand-green/20",
              isActive &&
                "border-brand-green bg-brand-green/10 text-brand-green shadow-sm shadow-brand-green/10",
              isLocked &&
                "border-muted-foreground/25 bg-muted/30 text-muted-foreground/50"
            )}
          >
            {isCompleted ? (
              <Check className="h-4.5 w-4.5" strokeWidth={3} />
            ) : isLocked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Icon className="h-4.5 w-4.5" />
            )}
          </div>

          {/* Label */}
          <span
            className={cn(
              "text-[11px] font-semibold tracking-wide uppercase transition-colors",
              isCompleted && "text-brand-green",
              isActive && "text-foreground",
              isLocked && "text-muted-foreground/50"
            )}
          >
            {step.label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {step.tooltip ?? step.label}
      </TooltipContent>
    </Tooltip>
  );
}

function ConnectorLine({
  fromStatus,
  toStatus,
}: {
  fromStatus: WizardStepStatus;
  toStatus: WizardStepStatus;
}) {
  const bothCompleted = fromStatus === "completed" && toStatus === "completed";
  const activeToLocked = fromStatus === "completed" && toStatus !== "locked";

  return (
    <div
      className={cn(
        "mx-1 h-[2px] w-10 sm:w-14 md:w-20 transition-colors duration-300 rounded-full",
        bothCompleted && "bg-brand-green",
        activeToLocked && "bg-brand-green/60",
        !bothCompleted && !activeToLocked && "bg-muted-foreground/15"
      )}
    />
  );
}

// Mobile pill variant — smaller, more compact
function StepPill({ step }: { step: WizardStep }) {
  const Icon = step.icon;
  const isCompleted = step.status === "completed";
  const isActive = step.status === "active";
  const isLocked = step.status === "locked";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap transition-colors",
        isCompleted && "border-brand-green/40 bg-brand-green/10 text-brand-green",
        isActive && "border-brand-green/30 bg-brand-green/5 text-brand-green",
        isLocked && "border-muted-foreground/15 bg-muted/20 text-muted-foreground/50"
      )}
    >
      {isCompleted ? (
        <Check className="h-3 w-3" strokeWidth={3} />
      ) : isLocked ? (
        <Lock className="h-2.5 w-2.5" />
      ) : (
        <Icon className="h-3 w-3" />
      )}
      {step.label}
    </div>
  );
}

function MobileConnector({
  fromStatus,
  toStatus,
}: {
  fromStatus: WizardStepStatus;
  toStatus: WizardStepStatus;
}) {
  const active = fromStatus === "completed" && toStatus !== "locked";

  return (
    <div
      className={cn(
        "h-[2px] w-3 flex-shrink-0 rounded-full transition-colors",
        active ? "bg-brand-green/50" : "bg-muted-foreground/15"
      )}
    />
  );
}
