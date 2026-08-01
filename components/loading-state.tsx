import { LoaderCircle } from "lucide-react";
export function LoadingState({ label = "Loading…" }: { label?: string }) { return <div className="grid min-h-48 place-items-center"><div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18}/>{label}</div></div>; }
