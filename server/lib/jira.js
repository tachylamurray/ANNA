import fetch from "cross-fetch";

const parseKey = (link) => {
  const m = String(link || "").match(/\/browse\/([A-Z0-9-]+)/i);
  return m ? m[1] : null;
};

export async function fetchJiraRequirement(requirementLink) {
  const jiraBase = process.env.JIRA_BASE || "";
  const user = process.env.JIRA_USER;
  const token = process.env.JIRA_TOKEN;
  const issueKey = parseKey(requirementLink);
  if (!issueKey) {
    return {
      summary: "Unknown requirement",
      key: null,
      meta: {},
      source: "mock",
    };
  }
  if (!jiraBase || !user || !token) {
    return {
      summary: `Mock summary for ${issueKey}`,
      key: issueKey,
      meta: { priority: "Medium" },
      source: "mock",
    };
  }
  const url = `${jiraBase}/rest/api/3/issue/${issueKey}`;
  const r = await fetch(url, {
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${user}:${token}`).toString("base64"),
      Accept: "application/json",
    },
  });
  if (!r.ok) {
    return {
      summary: `Mock summary for ${issueKey}`,
      key: issueKey,
      meta: { status: r.status },
      source: "mock",
    };
  }
  const j = await r.json();
  return {
    summary: j.fields?.summary || `Summary for ${issueKey}`,
    key: j.key || issueKey,
    meta: { status: j.fields?.status?.name },
    source: "jira",
  };
}