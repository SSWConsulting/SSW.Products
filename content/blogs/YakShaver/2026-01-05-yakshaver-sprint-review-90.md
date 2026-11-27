---
title: "YakShaver Sprint Review #90 — Onboarding Wizard & Canary Testing"
date: "2026-01-05"
author: "YakShaver Team"
tags: ["Sprint Review", "YakShaver", "Onboarding", "Canary Testing", "CI/CD"]
summary: "Holiday-week sprint: onboarding wizard completed, thought-process logs restored, Azure CLI CI/CD break fixed, canary testing pending."
image: "/images/blog/yakshaver-sprint-90.png"
draft: false
---

Hello everyone — here’s a concise recap of YakShaver Sprint Review #90. It was a skeleton-crew week due to the holidays, but we shipped some important work and prepared the app for wider canary testing. 🎯

Highlights ✅

- Onboarding wizard completed (desktop app)
  - A guided 3-step wizard that smooths the signup flow — the blocker for many canary testers is now removed. 🚀
  - Action: record a short “done” demo video for the wizard (Tino will do it or a teammate will step in). 📹
- Thought process logs restored
  - The “chain of thoughts” used to be missing from the execute-task panel logs. Luis fixed it so AI thinking steps are visible again. 🧠
- Azure CLI CI/CD pipeline bug
  - A breaking change in an Azure CLI output caused deployment failures over the sprint. Stephen and the team adapted the pipeline and fixed the problem (1–2 days to resolve). 🐞🔧

Metrics & Releases 📈

- Code coverage: remains at 28%.
- Production releases during this sprint:
  - Teams app: 3 releases
  - Desktop app: 12 releases (impressive given the holiday staffing)
- Application health: 100% availability
  - Small response-time spikes during weekend co-starts, but overall healthy.
- Leaderboard (30-day view): Josh, Geoffrey, Tiago top the list — UI clarity for the leaderboard numbers was discussed and flagged for design improvements. 🏆

Roadmap & Backlog 🗺️

- Roadmap progress: 90% (small improvements across portal UI/UX and client reporting)
- Backlog stats: 31 of 35 items labeled with YakShaver; 21 completed (+14 net change)
- Desktop backlog: ~87% labeled
- Tenant stats: 43 tenants total, 1 new tenant this week; 19 shaves (Teams), 5 shaves (MCP)
- AI tools: Stephen used Gemini 3 this week — listed in AI tools summary. 🤖

Sprint Retrospective — What went well / What to improve 🔍

- Wins:
  - Quick turnaround on many small bug fixes.
  - Onboarding wizard removed a key blocker for canary testing.
- Issues:
  - Unexpected Microsoft Azure CLI change broke CI/CD; fixed but flagged as a concern.
  - Knowledge silos: some metrics/dashboard expertise is concentrated in Louis and Tom. We should add more documentation and clearer links in the email template to reduce single points of failure.
- UX improvement ideas:
  - Make the onboarding wizard even simpler by offering checkbox presets for common MCP server configs (so users don’t have to type repeated values). Callum already created a YakShave for this; it will go into the next sprint.
  - Improve leaderboard number layout for easier scanning.

Planning & Next Sprint Goals 🗓️

- Main goal: start canary testing with people outside the YakShaver team.
- Top PBIs pulled into next sprint:
  - Canary testing onboarding
  - Preset MCP server option in onboarding checklist
  - UI/UX tweaks to the onboarding flow and leaderboard clarity
- Priority: implement MCP server onboarding checklist to smooth external testing.

Action Items (short)

- Record a short demo video for the onboarding wizard (Tino or a teammate). 📹
- Add preset MCP server options to the wizard (Callum’s YakShave to be included in the next sprint). ✅
- Improve leaderboard visual layout — consult a designer.
- Ensure tenancy/dashboard knowledge is captured in documentation and email templates.
- Follow up on Microsoft Azure CLI issue where appropriate (there is already an open GitHub issue).

Video

- Full meeting recording: https://www.youtube.com/watch?v=veA-LHQiAdg

Thanks to everyone who joined the holiday-week sprint review. See you next time! 🎉