# Metro Awakening Portfolio — Media Capture Guide

This document lists every screenshot and video needed for the portfolio page, with instructions on what to capture, where, and how.

---

## Setup

### OBS Settings (for video recording)
- **Resolution**: 1920×1080 (downscale from your 1440p output — easier to transcode and sufficient for web)
- **Encoder**: NVENC H.264 (if NVIDIA GPU) or x264
- **Rate Control**: CQP, Level 18 (high quality source — the batch script will compress further)
- **FPS**: 60 (will be kept at 60 in the web version for smooth looping)
- **Format**: MP4 (MKV if you want crash safety, rename to .mkv)
- **Audio**: OFF (all portfolio videos are muted and looped)
- **Tip**: Record at 1080p even on your 1440p screen — right-click desktop > Display Settings > set to 1920×1080 temporarily, or use OBS's output scaling

### Screenshots
- Use the editor's **High Resolution Screenshot** tool (`Window > Developer Tools > High Resolution Screenshot`) for editor views
- For in-game screenshots, use `Shot` console command or just screenshot in OBS/Windows
- Save as PNG

### Transcoding
1. Place raw videos in `raw_video/` and raw screenshots in `raw_screenshot/` under this `source_media/` folder.
2. Run `transcode_media.bat` from this folder, or drag specific files/folders onto it.
3. Output goes to `../../images/metro_awakening/`

The script will:
- Videos: Scale to max 1280×720, encode H.264 CRF 28, no audio, faststart for web — ~1-2 MB per 10s clip
- Images: Scale to max 1280px wide, JPEG quality ~82 — ~100-300 KB each

---

## Required Media

### 1. `perception_sight_fields.jpg` — Perception System hero shot
**What**: Editor screenshot showing sight field debug visualization on a human AI character  
**Where**: Open a level with a human AI (e.g. any combat encounter test map). Select the character.  
**How**:  
- In the editor viewport, enable `Show > Impact > Show Sight Fields: Of Selected Actor`
- Position the camera so you can see the coffin-shaped sight fields (Normal, Focus, Periphery) extending from the enemy's head
- Capture with High Resolution Screenshot or Print Screen
- A level with some Metro-style architecture in the background makes it look better

**File**: `raw_screenshot/perception_sight_fields.png`

---

### 2. `perception_darkness.mp4` — Darkness/Light stealth gameplay
**What**: Video showing the player moving between lit and dark areas, with an enemy reacting — seeing the player in light, losing them in darkness  
**Where**: A level with a stealth encounter that has both lit and dark areas (e.g. the chapter with destructible lanterns)  
**How**:  
- Enable `vg.Perception.Sight.DrawSightFields 1` and `vg.Perception.Sight.DrawTraces 1` in console
- Record ~8-12 seconds of the player stepping into light (enemy reacts), then stepping into darkness (enemy loses sight)
- The sight field trace lines changing from hitting to missing the player visually sells this

**File**: `raw_video/perception_darkness.mp4`

---

### 3. `perception_hearing.jpg` — Noise propagation visualization
**What**: Editor screenshot or paused-game screenshot showing hearing debug visualization — noise propagation paths through rooms  
**Where**: A level with multiple rooms and doors  
**How**:  
- Enable `vg.Perception.Hearing.DrawDebug 1`
- Fire a weapon or throw an object near enemies in a multi-room area
- Pause and screenshot — you should see the propagation paths around corners, through doorways, and the dampening markers at obstacles

**File**: `raw_screenshot/perception_hearing.png`

---

### 4. `perception_custom_sensors.jpg` — Visual Logger showing perception data
**What**: Screenshot of the Visual Logger window showing perception info — sight fields, noise events, or projectile sensor data  
**Where**: Visual Logger (`Window > Developer Tools > Visual Logger`)  
**How**:  
- Enable Visual Logger, play a short combat encounter, stop recording
- Select an AI character in the Visual Logger timeline
- Take a screenshot showing the 3D view with sight field geometry, and the log pane with perception events

**File**: `raw_screenshot/perception_custom_sensors.png`

---

### 5. `cover_system_overview.jpg` — Cover system hero shot
**What**: Editor screenshot showing auto-generated cover points along navmesh edges in a level  
**Where**: A level with varied geometry — walls, crates, low covers, high covers  
**How**:  
- Enable cover point visualization (should be visible by default in editor with the CoverData component selected, or via CVar `vg.CoverSystem.DrawCoverPoints 1`)
- Position camera to show a variety of low cover (one color) and high cover (another color) with line-of-fire indicators
- A wide shot showing multiple points along walls and objects works best

**File**: `raw_screenshot/cover_system_overview.png`

---

### 6. `cover_dynamic_safety.jpg` — Dynamic cover safety state
**What**: Screenshot showing cover points color-coded by safety at runtime (green = safe, red = unsafe)  
**Where**: In-game with an enemy nearby, or use a test map  
**How**:  
- Enable cover debug visualization (CVar `vg.CoverSystem.DrawCoverPoints 1` or similar)
- Position so some cover points are safe (player behind them) and some are unsafe (player flanking)
- The contrast between safe/unsafe colors makes a compelling image

**File**: `raw_screenshot/cover_dynamic_safety.png`

---

### 7. `cover_eqs.jpg` — EQS query scoring cover points
**What**: Screenshot of an EQS query debug view showing scored cover points  
**Where**: Enable EQS debug on a human AI running a "find cover" query  
**How**:  
- Use `EnableGDT AI` then select an AI character. In the Gameplay Debugger, switch to the EQS tab
- Or use `LogVisualizer` with the EQS category
- Screenshot showing the scored items (green = high score, red = low) with the EQS grid/spheres at cover point locations

**File**: `raw_screenshot/cover_eqs.png`

---

### 8. `ai_state_machine.mp4` — Awareness state transitions
**What**: Video showing an enemy going through multiple awareness states  
**Where**: A stealth encounter where you can trigger the full chain  
**How**:  
- Enable AI debug info (Gameplay Debugger or Visual Logger to show current state on screen)
- Record the sequence: enemy patrolling (Unaware), throw an object (Investigate), approach or find dead body (Alarmed/Search), spot player (Combat). Also show de-escalation if possible (player hides, enemy goes Combat to Alarmed, or Investigate back to Unaware)
- ~15-20 seconds

**File**: `raw_video/ai_state_machine.mp4`

---

### 9. `enemy_human_combat.mp4` — Human cover combat
**What**: Video of human enemies in cover-based combat — using cover, popping out to shoot, repositioning when flanked  
**Where**: A combat encounter with multiple human enemies and cover  
**How**:  
- Record ~10-15 seconds of combat: enemies behind cover shooting, at least one repositioning
- Enable debug visualization optionally (cover points, pathfinding) or capture pure gameplay
- Both approaches work — raw gameplay shows the result, debug view shows the tech

**File**: `raw_video/enemy_human_combat.mp4`

---

### 10. `enemy_nosalis.mp4` — Nosalis pack combat
**What**: Video of nosalises surrounding the player, using the combat circle, and attacking  
**Where**: A nosalis encounter (multiple nosalises)  
**How**:  
- Enable combat circle debug visualization if possible (`vg.CombatCircle.DrawDebug 1` or similar)
- Record ~10-15 seconds: show them surrounding, telegraph → attack, maybe one investigation
- Pure gameplay also works well here — the surrounding behavior is very visible

**File**: `raw_video/enemy_nosalis.mp4`

---

### 11. `enemy_lurker.mp4` — Lurker hiding and attacking
**What**: Video of lurkers in action: hiding, performing bounce/drive-by attacks, scattering  
**Where**: A lurker encounter  
**How**:  
- Record ~10-15 seconds: lurker hiding, performing attack, returning to a hiding spot
- If possible, kill one to trigger the scatter behavior

**File**: `raw_video/enemy_lurker.mp4`

---

### 12. `enemy_hunter.mp4` — Hunter guerrilla tactics
**What**: Video of hunters using hit-and-run tactics — hiding behind walls, dodging, pair attacks  
**Where**: A hunter/cultist encounter  
**How**:  
- Record ~10-15 seconds of combat showcasing their evasive movement and blowgun attacks

**File**: `raw_video/enemy_hunter.mp4`

---

### 13. `rvo_avoidance.mp4` — Collision avoidance demonstration
**What**: Video showing multiple characters navigating past each other in a corridor or tight space without collision  
**Where**: A functional test map or combat encounter with multiple AIs moving  
**How**:  
- Best with debug visualization enabled showing candidate directions and navmesh edge clipping
- Or use the avoidance test maps (circle avoidance, corridor avoidance)
- Record ~8-12 seconds of smooth avoidance in action

**File**: `raw_video/rvo_avoidance.mp4`

---

### 14. `combat_circle.jpg` — Combat circle visualization
**What**: Top-down or angled view showing the combat circle with obstacle-aware sectors  
**Where**: Test map or nosalis encounter  
**How**:  
- Enable combat circle debug drawing
- Position camera top-down or at an angle that clearly shows: the circle, the sectors, the obstacles blocking some arcs, agents assigned to sectors
- A corridor scene that shows a partial/semicircle is more interesting than a full circle in open space

**File**: `raw_screenshot/combat_circle.png`

---

### 15. `stagger_hit_reactions.mp4` — Damage response
**What**: Video showing enemies reacting to hits from different directions, regular hits vs stagger threshold  
**Where**: Combat, shooting different enemies in different body parts  
**How**:  
- Record ~8-12 seconds: shoot an enemy multiple times in different spots
- Show a light hit reaction (additive flinch), then a full stagger after enough damage accumulates
- Nosalis or human enemies both work

**File**: `raw_video/stagger_hit_reactions.mp4`

---

### 16. `actor_pooling.jpg` — Actor pooling
**What**: Screenshot showing the actor pool system in action — could be a debug view, the editor spawner setup, or test results  
**Where**: Editor or functional test  
**How**:  
- Option A: Screenshot of the pooling test passing in Test Automation window
- Option B: Blueprint or editor view showing the VGActorPool actor with connected spawners
- Option C: Statistics/profiler view showing eliminated spawn hitches

**File**: `raw_screenshot/actor_pooling.png`

---

### 17. `functional_testing.jpg` — Test automation results
**What**: Screenshot of the Test Automation window with AI tests listed and passing  
**Where**: `Window > Developer Tools > Session Frontend > Automation` tab  
**How**:  
- Run all AI-related functional tests
- Screenshot the results panel showing passing tests — bonus if you can show both the test list and a green "all passed" summary

**File**: `raw_screenshot/functional_testing.png`

---

## File Size Budget

Target total page weight: **~15-25 MB** (acceptable for a detailed portfolio page with many media items)

| Type | Count | Target each | Subtotal |
|------|-------|-------------|----------|
| Videos (720p, CRF 28, 8-15s) | 8 | 1-3 MB | ~8-24 MB |
| Images (1280px JPEG) | 9 | 100-300 KB | ~1-3 MB |

If the total exceeds 25 MB:
- Increase CRF to 30 for videos (smaller but slightly lower quality)
- Reduce video duration to 6-8 seconds
- Reduce image max width to 1024px

## Priority Order

If you want to do the most impactful ones first:

1. **`enemy_nosalis.mp4`** — Most visually exciting, shows combat circle
2. **`cover_system_overview.jpg`** — Strongest "systems" visual
3. **`perception_sight_fields.jpg`** — Shows the custom perception architecture
4. **`ai_state_machine.mp4`** — The full state chain is very impressive
5. **`enemy_human_combat.mp4`** — Core gameplay
6. **`perception_darkness.mp4`** — Metro's signature stealth mechanic
7. **`rvo_avoidance.mp4`** — Technical depth, may need test map setup
8. The rest — fill in as you go