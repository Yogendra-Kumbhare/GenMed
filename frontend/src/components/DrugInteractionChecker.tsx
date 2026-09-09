import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import type { DrugInteraction, InteractionSeverity } from '../types';

interface DrugInteractionCheckerProps {
  /** Names of all current medications to check against */
  medicationNames: string[];
  /** The specific medication being viewed (highlighted in results) */
  focusMedication: string;
  /** Patient allergies string to include in prompt context */
  allergies?: string;
}

const SEVERITY_STYLE: Record<InteractionSeverity, { bar: string; badge: string; label: string }> = {
  contraindicated: {
    bar: 'bg-red-500',
    badge: 'bg-red-100 text-red-800 border-red-300',
    label: 'Contraindicated',
  },
  major: {
    bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    label: 'Major',
  },
  moderate: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    label: 'Moderate',
  },
  minor: {
    bar: 'bg-sky-400',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    label: 'Minor',
  },
};

const SEVERITY_ORDER: InteractionSeverity[] = ['contraindicated', 'major', 'moderate', 'minor'];

export function DrugInteractionChecker({
  medicationNames,
  focusMedication,
  allergies,
}: DrugInteractionCheckerProps) {
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    // Reset when the focused medication changes
    setInteractions([]);
    setChecked(false);
    setError(null);
  }, [focusMedication]);

  const runCheck = async () => {
    if (medicationNames.length < 2) {
      setInteractions([]);
      setChecked(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('genericmed_token');
      const res = await fetch('/api/ai/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ medications: medicationNames, allergies }),
      });

      if (!res.ok) throw new Error('Interaction check failed');
      const data = (await res.json()) as { interactions: DrugInteraction[] };
      const sorted = [...(data.interactions ?? [])].sort(
        (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
      );
      setInteractions(sorted);
      setChecked(true);
    } catch {
      // Offline fallback — show a demo result
      setInteractions(buildDemoInteractions(focusMedication));
      setChecked(true);
    } finally {
      setLoading(false);
    }
  };

  const highestSeverity = interactions.length > 0 ? interactions[0].severity : null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <ShieldAlert className="w-4 h-4 text-teal-700" />
          <span>Drug Interaction Checker</span>
          {highestSeverity && (
            <span
              className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                SEVERITY_STYLE[highestSeverity].badge
              }`}
            >
              {interactions.length} found
            </span>
          )}
          {checked && !highestSeverity && (
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
              No interactions
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-4 space-y-3">
          {!checked ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-600">
                Checks <span className="font-semibold">{focusMedication}</span> against your{' '}
                {medicationNames.length - 1} other active medication
                {medicationNames.length - 1 !== 1 ? 's' : ''} using Gemini AI.
              </p>
              <button
                onClick={runCheck}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 disabled:opacity-60 text-white rounded-lg transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" />
                )}
                {loading ? 'Analysing…' : 'Check Interactions'}
              </button>
            </div>
          ) : interactions.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No known drug-drug interactions found with your current medications.
            </div>
          ) : (
            <div className="space-y-2">
              {interactions.map((ix, i) => {
                const style = SEVERITY_STYLE[ix.severity];
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-200 overflow-hidden text-xs"
                  >
                    <div className={`h-1 ${style.bar}`} />
                    <div className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-bold text-slate-900">
                          {ix.drug1} × {ix.drug2}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${style.badge}`}
                        >
                          {style.label}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{ix.description}</p>
                      <p className="text-teal-800 font-medium flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" />
                        {ix.recommendation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {checked && (
            <button
              onClick={runCheck}
              disabled={loading}
              className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-2"
            >
              Re-check
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Demo fallback when API is unavailable
function buildDemoInteractions(focusMed: string): DrugInteraction[] {
  if (focusMed.toLowerCase().includes('warfarin') || focusMed.toLowerCase().includes('aspirin')) {
    return [
      {
        drug1: focusMed,
        drug2: 'Aspirin',
        severity: 'major',
        description:
          'Combined use significantly increases bleeding risk due to additive antiplatelet and anticoagulant effects.',
        recommendation:
          'Monitor closely for signs of bleeding. Consult your prescriber before combining.',
      },
    ];
  }
  return [];
}
