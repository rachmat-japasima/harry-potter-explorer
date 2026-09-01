import { useQuery } from "@tanstack/react-query";
import {
  getCharacters,
  getCharactersByHouse,
  getStaff,
  getStudents,
} from "./api";

/**
 * Query keys are exported so pages can prefetch or read cache entries
 * (e.g. character detail reads the all-list cache — see useCharacter).
 */
export const allCharactersKey = ["characters", "all"] as const;
export const charactersByHouseKey = (house: string) =>
  ["characters", "house", house] as const;
export const studentsKey = ["characters", "students"] as const;
export const staffKey = ["characters", "staff"] as const;

export function useCharacters() {
  return useQuery({ queryKey: allCharactersKey, queryFn: getCharacters });
}

/**
 * House filtering is supported server-side: GET /api/characters/house/:house
 * (case-insensitive; unknown house → empty list).
 */
export function useCharactersByHouse(house: string) {
  return useQuery({
    queryKey: charactersByHouseKey(house),
    queryFn: () => getCharactersByHouse(house),
  });
}

export function useStudents() {
  return useQuery({ queryKey: studentsKey, queryFn: getStudents });
}

export function useStaff() {
  return useQuery({ queryKey: staffKey, queryFn: getStaff });
}

/**
 * There is no character detail endpoint (GET /api/characters/:id → 404,
 * verified), so the character is selected from the all-list query. Visiting
 * the detail page directly fetches the full list — the only way to obtain
 * one character — and shares the list page's cache when it was visited first.
 */
export function useCharacter(id: string) {
  return useQuery({
    queryKey: allCharactersKey,
    queryFn: getCharacters,
    select: (characters) => characters.find((c) => c.id === id),
  });
}
