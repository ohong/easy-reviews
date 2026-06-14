// §6 Counter-sign concept generator (fal.ai). The fal call itself is an
// integration concern (test.todo); the result-normalization that guarantees the
// action always returns a self-contained PNG data URL is a pure unit, tested now.
import { afterEach, describe, expect, mock, test } from "bun:test";
import { toPngDataUrl } from "@/lib/services/signs";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("sign image normalization (toPngDataUrl)", () => {
  test("passes a data URI straight through without fetching", async () => {
    const fetchMock = mock(async () => new Response(null, { status: 200 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const dataUri = "data:image/png;base64,QUJD";
    expect(await toPngDataUrl(dataUri)).toBe(dataUri);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("fetches a hosted URL and inlines it as a PNG data URL", async () => {
    const bytes = new Uint8Array([0, 1, 2, 3, 4, 250]);
    globalThis.fetch = mock(
      async () => new Response(bytes, { status: 200 }),
    ) as unknown as typeof fetch;

    const out = await toPngDataUrl("https://storage.googleapis.com/fal/x.png");
    expect(out).toBe(
      `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`,
    );
  });

  test("fails noisily when the hosted image fetch errors", async () => {
    globalThis.fetch = mock(
      async () => new Response("upstream down", { status: 502 }),
    ) as unknown as typeof fetch;

    await expect(
      toPngDataUrl("https://storage.googleapis.com/fal/x.png"),
    ).rejects.toThrow(/502/);
  });
});
