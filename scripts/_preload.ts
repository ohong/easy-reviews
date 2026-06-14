/**
 * Bun preload: stub the `server-only` guard so server modules can be imported
 * from a plain Bun script (smoke tests). Has no effect on the Next.js build.
 */
import { plugin } from "bun";

plugin({
  name: "stub-server-only",
  setup(build) {
    build.module("server-only", () => ({ exports: {}, loader: "object" }));
  },
});
