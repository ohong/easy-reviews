import { describe, expect, test } from "bun:test";
import { parseMapsUrl, resolveMapsInput } from "@/lib/resolve";

describe("parseMapsUrl", () => {
  test("query_place_id param wins (most reliable)", () => {
    const r = parseMapsUrl(
      "https://www.google.com/maps/search/?api=1&query=Cafe&query_place_id=ChIJ_abc-123",
    );
    expect(r.placeId).toBe("ChIJ_abc-123");
    expect(r.kind).toBe("place");
  });

  test("place_id and placeid params also resolve", () => {
    expect(parseMapsUrl("https://maps.google.com/?place_id=ChIJxyz").placeId).toBe(
      "ChIJxyz",
    );
    expect(parseMapsUrl("https://maps.google.com/?placeid=ChIJ789").placeId).toBe(
      "ChIJ789",
    );
  });

  test("/maps/place/<name>/@lat,lng → decoded name + coords", () => {
    const r = parseMapsUrl(
      "https://www.google.com/maps/place/Blue+Bottle+Coffee/@37.7956,-122.3934,17z",
    );
    expect(r.name).toBe("Blue Bottle Coffee");
    expect(r.kind).toBe("place");
    expect(r.lat).toBeCloseTo(37.7956);
    expect(r.lng).toBeCloseTo(-122.3934);
  });

  test("!3d!4d coordinate form is parsed when no @ present", () => {
    const r = parseMapsUrl(
      "https://www.google.com/maps/place/X/data=!3d40.7484!4d-73.9857",
    );
    expect(r.lat).toBeCloseTo(40.7484);
    expect(r.lng).toBeCloseTo(-73.9857);
  });

  test("directions links are flagged as directions (rejected upstream)", () => {
    const r = parseMapsUrl(
      "https://www.google.com/maps/dir/Home/Work/@37.77,-122.41,12z",
    );
    expect(r.kind).toBe("directions");
  });

  test("/maps/search/<name> → search kind", () => {
    const r = parseMapsUrl("https://www.google.com/maps/search/Joe%27s%20Pizza");
    expect(r.name).toBe("Joe's Pizza");
    expect(r.kind).toBe("search");
  });

  test("?q=<name> → search kind", () => {
    const r = parseMapsUrl("https://www.google.com/maps?q=Tartine+Bakery");
    expect(r.name).toBe("Tartine Bakery");
    expect(r.kind).toBe("search");
  });

  test("non-URL string is treated as a raw search query", () => {
    const r = parseMapsUrl("Philz Coffee Berkeley");
    expect(r.name).toBe("Philz Coffee Berkeley");
    expect(r.kind).toBe("search");
  });

  test("bare coordinates URL → place kind with coords", () => {
    const r = parseMapsUrl("https://www.google.com/maps/@37.7749,-122.4194,15z");
    expect(r.kind).toBe("place");
    expect(r.lat).toBeCloseTo(37.7749);
  });
});

describe("resolveMapsInput (network-free paths)", () => {
  test("empty input returns a helpful reason", async () => {
    const r = await resolveMapsInput("   ");
    expect(r.reason).toBeTruthy();
    expect(r.placeId).toBeUndefined();
  });

  test("a bare place_id pasted directly resolves without a lookup", async () => {
    const r = await resolveMapsInput("ChIJN1t_tDeuEmsRUsoyG83frY4");
    expect(r.placeId).toBe("ChIJN1t_tDeuEmsRUsoyG83frY4");
  });

  test("a directions link is rejected with guidance", async () => {
    const r = await resolveMapsInput(
      "https://www.google.com/maps/dir/A/B/@37.77,-122.41,12z",
    );
    expect(r.placeId).toBeUndefined();
    expect(r.reason?.toLowerCase()).toContain("directions");
  });
});
