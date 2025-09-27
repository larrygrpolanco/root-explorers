export async function generatePortrait(quizData) {
  const { build, height, species, furColor, eyeColor, definingFeature, typicalExpression, treasuredItem, preferredClothing } = quizData;
  
  // Simple fur type assumption; use furColor directly for mock
  const colorType = furColor; // Could enhance based on species, but keep simple
  
  const prompt = `Full body portrait of a ${build} ${height} ${species} vagabond. They have ${colorType} fur and ${eyeColor} eyes. Their most defining feature is ${definingFeature}. Their typical expression is ${typicalExpression}. They are wearing ${preferredClothing} and carrying ${treasuredItem}. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive.`;
  
  // Dynamic placeholder URL with random color and species text
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const imageUrl = `https://via.placeholder.com/400x600/${randomColor}/${randomColor}?text=${encodeURIComponent(`${species} Vagabond`)}`;
  
  return Promise.resolve({ prompt, imageUrl });
}