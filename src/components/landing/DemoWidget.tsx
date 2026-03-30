"use client";

import { useState } from "react";
import { WIDGET_STYLES, SAMPLE_REVIEWS } from "@/lib/constants";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetStyle } from "@/lib/types";

export function DemoWidget() {
  const [style, setStyle] = useState<WidgetStyle>("carousel");

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        {WIDGET_STYLES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStyle(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              style === s.value
                ? "bg-gold-500 text-black"
                : "bg-surface-light text-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center min-h-[220px]">
        <WidgetRenderer
          style={style}
          reviews={SAMPLE_REVIEWS}
          primaryColor="#f59e0b"
          backgroundColor="#1a1a1a"
          textColor="#ffffff"
          businessName="Acme Auto Repair"
        />
      </div>
    </div>
  );
}
