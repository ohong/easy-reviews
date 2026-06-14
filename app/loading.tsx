import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center py-20">
      <Loader2 className="size-6 animate-spin text-primary" />
    </main>
  );
}
