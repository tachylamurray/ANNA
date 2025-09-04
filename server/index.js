import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import fetch from "cross-fetch";
import { fetchJiraRequirement } from "./lib/jira.js";
import { generateArtifacts } from "./lib/stlc.js";
import { buildQmetryPayloads } from "./lib/qmetry.js";
import { executeTests } from "./lib/executor.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "src/public")));

app.post("/api/orchestrate", async (req, res) => {
  try {
    const { requirement_link, requirement_summary } = req.body || {};
    if (!requirement_link && !requirement_summary) {
      return res.status(400).json({ ok: false, error: "Provide requirement_link or requirement_summary" });
    }

    const requirement = requirement_summary
      ? { summary: String(requirement_summary), key: "REQ-UNKNOWN", source: "text" }
      : await fetchJiraRequirement(requirement_link);

    const { testCases, automationCode } = generateArtifacts(requirement);

    const qmetry_payloads = buildQmetryPayloads(requirement, { testCases });

    const execution_results = await executeTests({ testCases });

    return res.json({
      requirement_link: requirement_link || null,
      requirement_summary: requirement.summary,
      generated_test_cases: testCases,
      automation_code: automationCode,
      qmetry_payloads,
      execution_results,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
