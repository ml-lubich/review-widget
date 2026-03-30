"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteWidgetButton({ widgetId }: { widgetId: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm("Delete this widget? This cannot be undone.")) return;
    await supabase.from("widgets").delete().eq("id", widgetId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-muted hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
      title="Delete widget"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
