#!/usr/bin/env node

import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const prescan = path.join(scriptDirectory, "prescan.mjs")
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "harness-prescan-test-"))

try {
  fs.mkdirSync(path.join(fixture, "src"), { recursive: true })
  fs.mkdirSync(path.join(fixture, "skills", "reviewer"), { recursive: true })
  fs.mkdirSync(path.join(fixture, "tests"), { recursive: true })
  fs.writeFileSync(path.join(fixture, "package.json"), JSON.stringify({ dependencies: { "@langchain/langgraph": "1.0.0" } }))
  fs.writeFileSync(path.join(fixture, ".env"), "API_KEY=sk-this-file-must-be-skipped\n")
  fs.writeFileSync(path.join(fixture, "src", "agent.ts"), `
    const apiKey = "sk-example-token-1234567890"
    async function toolGateway(principal, toolArgs, url) {
      authorizeResource(principal, toolArgs.customer_id)
      requireApproval(toolArgs)
      await memory.upsert(toolArgs)
      await fetch(url)
      return exec(toolArgs.command)
    }
  `)
  fs.writeFileSync(path.join(fixture, "tests", "boundary.test.ts"), `
    test("prompt injection is denied", async () => {
      expect(policyDecision).toBe("deny")
      expect(stateDiff).toEqual({})
    })
  `)
  fs.writeFileSync(path.join(fixture, "skills", "reviewer", "SKILL.md"), `
    skill_manifest: reviewer-v2
    plugin = load_plugin("reviewer")
    token_passthrough: false
    auto_promote: false
    release_manifest: agent-release-v3
    effect_receipt: required
    promotion_gate: immutable_outer_loop
  `)

  const jsonRun = spawnSync(process.execPath, [prescan, fixture, "--json"], { encoding: "utf8" })
  assert.equal(jsonRun.status, 0, jsonRun.stderr)
  const report = JSON.parse(jsonRun.stdout)
  assert.equal(report.schemaVersion, 3)
  assert.ok(report.detectedFrameworks.includes("LangGraph"))
  assert.ok(report.capabilities.find((entry) => entry.id === "M2").hits.length > 0)
  assert.ok(report.capabilities.find((entry) => entry.id === "M4").hits.length > 0)
  assert.ok(report.capabilities.find((entry) => entry.id === "M7").hits.length > 0)
  assert.ok(report.capabilities.find((entry) => entry.id === "M9").hits.length > 0)
  assert.ok(report.lifecycleLeads.find((entry) => entry.id === "L2").hits.length > 0)
  assert.ok(report.lifecycleLeads.find((entry) => entry.id === "L5").hits.length > 0)
  assert.ok(report.lifecycleLeads.find((entry) => entry.id === "L6").hits.length > 0)
  assert.ok(report.hotspots.find((entry) => entry.id === "H1").hits.length > 0)
  assert.ok(report.hotspots.find((entry) => entry.id === "H2").hits.length > 0)
  assert.ok(report.hotspots.find((entry) => entry.id === "H8").hits.length > 0)
  assert.ok(report.hotspots.find((entry) => entry.id === "H9").hits.length > 0)
  assert.ok(report.hotspots.find((entry) => entry.id === "H10").hits.length > 0)
  assert.ok(!jsonRun.stdout.includes("sk-example-token-1234567890"))
  assert.ok(!jsonRun.stdout.includes("sk-this-file-must-be-skipped"))

  const markdownRun = spawnSync(process.execPath, [prescan, fixture], { encoding: "utf8" })
  assert.equal(markdownRun.status, 0, markdownRun.stderr)
  assert.match(markdownRun.stdout, /Candidate capability profile/)
  assert.match(markdownRun.stdout, /Lifecycle phase leads/)
  assert.match(markdownRun.stdout, /Potential bypass hotspots/)

  const missingRun = spawnSync(process.execPath, [prescan, path.join(fixture, "missing")], { encoding: "utf8" })
  assert.equal(missingRun.status, 2)
  assert.match(missingRun.stderr, /target does not exist/)

  process.stdout.write("prescan tests passed\n")
} finally {
  fs.rmSync(fixture, { recursive: true, force: true })
}
