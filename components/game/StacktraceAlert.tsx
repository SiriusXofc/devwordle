"use client";

import { Alert } from "@/components/ui/alert";

export function StacktraceAlert({ stacktrace }: { stacktrace: string }) {
  return (
    <Alert
      variant="destructive"
      className="animate-stacktraceIn rounded-none border-red-800 border-l-2 border-l-red-500 bg-red-950/50 p-3 text-red-300"
    >
      <div className="font-mono text-[10px] tracking-widest text-red-400">&gt; STACK TRACE</div>
      <pre className="mt-2 whitespace-pre-wrap font-mono text-[9px] leading-relaxed text-red-400/70">{stacktrace}</pre>
    </Alert>
  );
}
