const startsWithIgnoreCase = (str, prefix) => str.toLowerCase().startsWith(prefix.toLowerCase());
const extractJsonFromMixedString = (str) => {
  const jsonStringArray = str.match(/{[^{}]*}/g); // Find all JSON-like objects

  if (jsonStringArray) {
    for (const jsonString of jsonStringArray) {
      try {
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
      } catch (error) {
        // Parsing failed for this JSON-like object; continue to the next one
        console.error('Error parsing JSON:', error);
      }
    }
  }

  console.error('No valid JSON found in the string.');
  return null;
}

export { startsWithIgnoreCase, extractJsonFromMixedString };
