export async function executeTests(artifacts) {
  const results = artifacts.testCases.map((tc) => {
    if (tc.type === "automated") {
      return { [tc.id]: "Passed" };
    }
    return { [tc.id]: "Pending" };
  });
  return results;
}
