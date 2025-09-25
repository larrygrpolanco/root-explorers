export const vagabondPrompt = ({ playbook, species, demeanor, physical_desc, trinket, char_name = '' }) => {
  const namePart = char_name ? `named ${char_name}, ` : '';
  return `
Using the provided style reference sheet as the definitive guide for the art style, create a full-body character portrait. The style must match the enchanting, rustic, painterly storybook illustration of the examples.

The character is a ${demeanor} ${species} ${playbook}. ${namePart}They have a ${physical_desc} appearance and are carrying or wearing their ${trinket}.

The background should be a simple, muted, and slightly out-of-focus forest clearing, ensuring the focus remains entirely on the character. The image must be a square composition.
`;
};

export const bandPrompt = (sceneLocation, sceneAction, characters) => {
  const charDescriptions = characters.map((char, index) =>
    `${index + 1}. A ${char.species} ${char.playbook}.`
  ).join('\n');

  return `
Using the provided style reference sheet for the overall art style, create a new group scene. The characters to be included are depicted in the provided character reference sheet. Please maintain their exact species, clothing, and appearance.

The scene is set in ${sceneLocation}. The characters are currently ${sceneAction}.

From left to right, the characters are:
${charDescriptions}

The lighting and mood should match the setting. The composition should be a landscape view that clearly shows all characters interacting with each other and the environment.
`;
};