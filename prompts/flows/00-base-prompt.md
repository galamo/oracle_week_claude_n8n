# Base prompt for all animated flows (paste first)

Visual system copied from the Lab 8 animation (`Flows/` / `lab8-mcp-streamable-http-flow.html`). Then add one of `F1`–`F9`.

```text
You are building a single self-contained HTML file (inline CSS + JS, no frameworks, only Google Fonts allowed) for a live technical seminar on Claude, MCP and n8n. It will be projected on a large screen and opened from slides via links.

Match this visual system exactly (it comes from an existing Lab 8 animation):
- Dark theme tokens: --ground #0f1720, --panel #16212d, --line #2a3a4b, --ink #e6edf3, --muted #8297ab, --dim #4d6276, --req #5cc8ff (requests), --res #ffb547 (HTTP layer / warnings), --ok #3ddc97 (results / success), --tool #b18cff (tools), --sse #5eead4 (streams / sessions). Add --err #ff6b6b only for failures.
- Fonts: "Bricolage Grotesque" for headings, "IBM Plex Mono" for everything else.
- Layout: header (h1 + small uppercase meta), one-line lede, a rounded .stage panel containing an SVG with viewBox width 1080 on a 28px grid pattern, then a caption row (big step number + text with colour-coded <code>), a progress rail of N segments, and controls: Pause/Play, Replay, Sound On/Off, Speed 0.5x/1x/1.5x.
- Animation engine: a phase array P = [{k, d (seconds), step, from:[x,y], to:[x,y], label, c (colour), wire, txt (caption HTML), tone}], a requestAnimationFrame loop with time t, ease-in-out-cubic packets (pill label + glowing dot) that fly between components, components that light up (stroke colour + opacity) when reached, gentle floating drift on the main boxes, a success toast on the final phase, and looping.
- Sound: tiny WebAudio tones per phase (whoosh, blip, chime, soft, resolve, rest), master gain 0.07, unlocked on first pointerdown, off when prefers-reduced-motion.
- Accessibility: role="img" + aria-label on SVG, aria-live caption, visible focus rings, prefers-reduced-motion jumps to the final state.
- Support ?at=<phaseKey> in the URL to freeze on a phase (for screenshots and slides).
- Under the animation add a section with a static "at a glance" SVG of the same idea and a 3-column notes grid (strong title + 2 lines each). Responsive down to 560px.
- Keep all text in English, short and technically exact. No placeholder lorem ipsum. Comment the phase array so I can edit captions later.
```
