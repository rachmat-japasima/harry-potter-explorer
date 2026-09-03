import { CharacterDetail } from "@/components/characters/character-detail";
import { getCharacters } from "@/features/characters/api";

export const metadata = {
  title: "Character",
};

/** Every character id must be enumerated for `output: "export"`. */
export async function generateStaticParams() {
  const characters = await getCharacters();

  return characters.map((character) => ({
    id: character.id,
  }));
}

/**
 * Server shell for the detail route. Each id is exported as a static shell
 * at build time; the record itself is fetched in the browser by the client
 * component via GET /api/character/:id (CORS-open).
 */
export default async function CharacterPage(
  props: PageProps<"/characters/[id]">,
) {
  const { id } = await props.params;

  return <CharacterDetail id={id} />;
}
