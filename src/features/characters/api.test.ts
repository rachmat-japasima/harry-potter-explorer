import { afterEach, describe, expect, it, vi } from "vitest";

import { getStaff, getStudents } from "./api";

// Verbatim record from the live API (2026-09-01) — same shape the
// students/staff endpoints return (verified 2026-09-02).
const harryRecord = {
  id: "9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8",
  name: "Harry Potter",
  alternate_names: ["The Boy Who Lived"],
  species: "human",
  gender: "male",
  house: "Gryffindor",
  dateOfBirth: "31-07-1980",
  yearOfBirth: 1980,
  wizard: true,
  ancestry: "half-blood",
  eyeColour: "green",
  hairColour: "black",
  wand: { wood: "holly", core: "phoenix tail feather", length: 11 },
  patronus: "stag",
  hogwartsStudent: true,
  hogwartsStaff: false,
  actor: "Daniel Radcliffe",
  alternate_actors: [],
  alive: true,
  image: "https://ik.imagekit.io/hpapi/harry.jpg",
};

function stubOkFetch(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getStudents / getStaff", () => {
  it("getStudents fetches the students endpoint and normalizes records", async () => {
    stubOkFetch([harryRecord]);

    const result = await getStudents();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/characters/students"),
      expect.anything(),
    );
    expect(result[0].name).toBe("Harry Potter");
    expect(result[0].house).toBe("Gryffindor");
  });

  it("getStaff fetches the staff endpoint", async () => {
    stubOkFetch([harryRecord]);

    await getStaff();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/characters/staff"),
      expect.anything(),
    );
  });

  it("surfaces the API body text on a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve("Sorry can't find that!"),
      }),
    );

    await expect(getStudents()).rejects.toThrow("Sorry can't find that!");
  });

  it("rejects malformed records (Zod validation)", async () => {
    stubOkFetch([{ id: "incomplete" }]);

    await expect(getStudents()).rejects.toThrow();
  });
});
