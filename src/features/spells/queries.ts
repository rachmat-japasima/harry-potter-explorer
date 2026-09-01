import { useQuery } from "@tanstack/react-query";
import { getSpells } from "./api";

export const spellsKey = ["spells"] as const;

export function useSpells() {
  return useQuery({ queryKey: spellsKey, queryFn: getSpells });
}
