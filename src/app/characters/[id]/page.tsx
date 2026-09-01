import { CharacterDetail } from "@/components/characters/character-detail";

export const metadata = {
  title: "Character",
};

/**
 * Server shell for the detail route. The character record comes from the
 * shared list cache (the API has no detail endpoint), so the interactive
 * detail view is a client component.
 */
export default async function CharacterPage(
  props: PageProps<"/characters/[id]">,
) {
  const { id } = await props.params;
  return <CharacterDetail id={id} />;
}
