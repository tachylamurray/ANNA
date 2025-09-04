export function buildQmetryPayloads(requirement, artifacts) {
  const enabled = Boolean(process.env.QMETRY_BASE && process.env.QMETRY_API_KEY);
  const requirementKey = requirement?.key || "REQ-UNKNOWN";

  const test_cases = artifacts.testCases.map((tc) => ({
    name: tc.title,
    linked_requirement: requirementKey,
    type: tc.type,
  }));

  const cycleName = `${requirementKey} - Cycle 1`;
  const test_cycles = [
    {
      cycle_name: cycleName,
      linked_requirement: requirementKey,
    },
  ];

  const links = artifacts.testCases.map((tc) => ({
    test_case_id: tc.id,
    test_cycle: cycleName,
  }));

  return {
    test_cases,
    test_cycles,
    links,
    dry_run: !enabled,
  };
}
