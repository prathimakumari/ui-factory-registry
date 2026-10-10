import { Suspense } from "react";
import { Playground } from "@/components/factory/playground";
export default function Page() {
  return (
    <Suspense fallback={<p>Loading playground…</p>}>
      <Playground />
    </Suspense>
  );
}
