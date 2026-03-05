# AI Enemy Behaviors — Metro Awakening (Impact) — Portfolio Research

## Author: Maks Maisak (Sole AI Programmer, 2021–2024)
## Sources: Confluence FD/TD pages, Perforce changelists (2022–2024), resume research notes

---

## 1. AI State Machine

### Overview
All enemy types share a modular **awareness state machine** built on the Vertigo Studios **State Machines Plugin**. States are Blueprint classes inheriting from a common C++ base (`UVGAIStateBase`), giving designers full control over transitions, per-state awareness values, and per-state event handling. The state machine is driven by a `UVGStateMachineComponent` on the base AI character class (`AVGAICharacterBase`).

### States (Humans)
**Unaware → Startled → Investigate → Alarmed → Combat**

| State | Awareness Threshold | Key Behavior |
|---|---|---|
| **Unaware** | Default | Idle, patrol, scripted sequence. Awareness rises when player is seen. |
| **Startled** | 0.6 (from Unaware) | Brief reaction (voice line + animation). If player stays visible → escalates. If player disappears and reaction finishes → returns to Unaware. |
| **Investigate** | 0.7 (from Startled, only if player not visible) | Walks to disturbance location, looks around. Only the closest group member investigates (token-controlled). Returns to Unaware if nothing found. |
| **Alarmed** | 1.0 (from Investigate/Startled) or triggered by alarming noise, dead body, bullet fly-by | Searches for player. Closest N characters search cover points near last known location; others advance cover-to-cover. After timeout, switches to patrol routes. |
| **Combat** | 0.2 awareness in Alarmed, or player visible during Alarmed/Investigate | Active engagement: shooting, advancing cover-to-cover, suppressive fire. |

### Technical Design Decisions
- **Why State Machines over Awareness Stack**: A "stack of awareness levels" was considered (single awareness float with thresholds), but rejected because transitions like "skip Alarmed and go directly to Combat when player is visible at the top of Investigate" were hard to model cleanly. The state machine approach allows arbitrary transitions and per-state custom logic.
- **HTN Integration**: A top-level "master HTN" acts as a switch between per-state subnetworks using `IsInAIState` decorators (Option 2). This avoids coupling states to the HTN system and allows designers to add scoped behaviors (e.g., `MovementSpeedScope`) at the top level.
- **Per-State Awareness**: Each state has its own independent `Awareness` float that starts at 0 on entry and changes via `GetAwarenessChangeRate()` (BlueprintNativeEvent). The rate depends on which sight targets are visible (head vs hands) and which sight field they're in (Normal/Focus/Periphery).
- **State Base Class Hierarchy**: `UVGAIStateBase` (C++) → `AIS_Base` (BP) → `AIS_HumanBase` (BP) → `AIS_Human_UnawareBase` / `AIS_Human_AwareBase`.
- The state subscribes to perception events (`OnSightTargetEnteredView`, `OnNoiseHeard`, `OnUnreportedDeadBodyDetected`, `OnAIAnnouncementReceived`) on `BeginState` and unsubscribes on `EndState`.

### Losing the Player (Combat → Alarmed)
A `BP_SightTargetLastKnownLocation` actor is placed at the player's last known position. When a Combat-state character sees this target through the time-sliced perception system and the player isn't near it, a blackboard key `LostCurrentEnemy` is set, which triggers the HTN to play a voice line, send `BPA_EnemyLost` to the group, and transition to Alarmed. This leverages the perception system's time-slicing instead of manual per-frame line traces.

---

## 2. Human Enemies

### Perception System
**Vision** uses 3 concentric sight cones on the AI character:
- **Normal Cone**: Detects the player's head. Seeing the head in Normal raises awareness at the baseline rate (1 unit/second).
- **Focused Cone** (narrower, longer range): Detects both head and hands.
- **Peripheral Cone** (wider, shorter): Only triggers suspicion/startled behavior, doesn't directly escalate to combat.

**Hearing** uses a multi-stage pipeline:
1. **Distance Check**: Sound must be within hearing range.
2. **Occlusion Check**: Traces from source to listener, accounting for material penetration.
3. **Pathfinding Check**: Simulates sound "reverbing" through corridors (navmesh-based noise propagation with obstacle dampening).

Sound categories: **Suspicious** (thrown can, footsteps) → Investigate; **Alarming** (gunshot, bullet fly-by) → Alarmed.

**Darkness/Light**: Sight targets use `VGSightTargetWithLightingComponent` to factor in lighting. Firing a gun reveals the player even in darkness (shared with group). A `VGGameplayTagVolume` with "PlayerNotVisibleToUnawareAI" tag provides designer-controlled stealth zones.

### Cover System
- **Multithreaded Generation**: Cover points generated along navmesh edges with retry-based quality (up to 7 retries for good body coverage).
- **Dynamic Safety Tracking**: `CoverTracker` with priority-based time-budgeted updates (distance-based staleness). Safe cone pre-generation skips line traces when the target is outside the cone.
- **Cover Selection**: EQS queries pick cover points factoring in distance, safety, obstruction, and friendly-fire avoidance. Separate queries for different states:
  - `EQSQuery_FindCoverForShooting_Defensive` — within firearm range, safe from enemy
  - `EQSQuery_FindAlarmedFiringCover` — during Alarmed state
- **Cover-to-Cover Movement**: Requires a one-at-a-time token (staggered advancement). A recursive HTN picks immediate then intermediate cover to avoid looping between the same two points.
- **Defense Region System**: Designer-placed volumes for cover point control.
- **Hold-Your-Ground**: Cover picking that respects current position and firearm type.

### Combat Behaviors
- **Advancing**: Cover-to-cover movement controlled by tokens (one character moves at a time with cooldown).
- **Shooting**: Behind a `TokenScope` decorator claiming a `ShootAt` token from the player's `BAC_PlayerAITokenPool`. Pop in/out of cover to fire.
- **Suppressive Fire**: When player is in cover, enemies fire at a projected location above the cover (`LocationForSuppressiveFire`). Uses separate `ShootSuppressive` tokens.
- **Reloading**: Triggered when out of ammo; character stays in cover during reload.
- **Alerting Others**: If allies aren't yet aware, sends `BPA_EnemyLocationUpdate` announcement with a voice line.

### Combat Roles
| Role | Description |
|---|---|
| **Defensive** | Default. Maintains safe distance, engages at mid-long range. |
| **Rusher** | Pushes close to the player (e.g., Shambler-wielding enemies). |
| **Hardpoint** | Guards fixed positions. |
| **Flanker** | Attempts to attack from sides or behind. |

### Friendly Fire Avoidance
- **During Planning**: `UVGEnvQueryTest_IsOnTheSameLine` EQS test prevents picking cover where an ally is between self and enemy, or where self is between ally and enemy.
- **During Execution**: `UVGHTNDecorator_IsOnTheSameLine` checks that no ally is in the line of fire in real-time (with configurable line width).

### Dead Body Detection
- `UVGDeadBodyDetectorComponent` (C++) with a BP subclass `BAC_DeadBodyDetector`.
- Multiple sight targets placed on dead character limbs (head, torso, pelvis, limbs) — time-sliced perception detects body parts sticking out from corners.
- Also detects via collision overlap (stepping on a body).
- Distinguishes "saw someone get killed" (→ Alarmed) vs "found an old body" (→ Investigate).
- Bodies tracked with `bDeadBodyWasReported` flag to prevent duplicate reactions.

---

## 3. Nosalis

### Design Intent
The Nosalis is the most common mutant — a big, scary melee creature. The player experience should emphasize:
- **Intimidating**: Size, sound, relentless approach
- **Tactical Movement**: Player must manage positioning to avoid being surrounded
- **Overwhelming**: Multiple Nosalises getting close = death
- **Slow-Paced/Telegraphed**: Every action is clearly signaled
- **Careful Observation**: Player must find windows of opportunity and weakspots
- **Every Bullet Counts**: Weakspot-focused gameplay, not spray-and-pray

### Core Behavior Loop
1. **Approach**: Walk toward player slowly (gallop if >15m away). Player can slow/stop approach by aiming (aim avoidance).
2. **Circle**: Using the **Combat Circle**, Nosalises spread around the player from a short distance, never fully encircling (leaving escape routes).
3. **Telegraph + Attack**: Loud distinctive roar → continuous slashing attacks (no longer hit-and-run jumps from old design). First swipe starts out of reach, closing in over several seconds.
4. **Weakspot Windows**: Belly exposed during attack telegraphs and staggers; mouth exposed during growls. Light stagger from first weakspot hit → heavy "finish-me-off" stagger from second hit.
5. **Repeat**: After attack wave, retreat slightly, then re-engage.

### Combat Circle (C++ System)
- Obstacle-aware sectors around the player, projected onto navmesh.
- $O(n!)$ optimal assignment of Nosalises to sectors (or configurable arc for "combat cone" variant).
- Inner radius keeps minimum distance; sectors account for geometry obstacles.
- Extensively refactored across 2022–2024: obstacle sectors, optimal reassignment algortihm, inner radius tweaking, configurable arc support.
- Extracted to standalone `CombatCircle` module in the AITools plugin.

### Stagger System
- **Light Stagger**: First weakspot hit during attack → interrupts attack, exposes belly briefly.
- **Heavy Stagger ("Finish-Me-Off")**: Second weakspot hit → falls to ground, belly fully exposed. Player can finish with a few more weakspot shots.
- **Armor Hit Reactions**: Non-weakspot hits produce small additive impact reactions (the Nosalis "isn't bothered by it much, like an itch") — but do reduced damage. Full clips to armored areas can eventually kill.
- Stagger pipeline: Data-driven with `HitReactionSelector` data asset for directional animation selection, bone/damage-type multipliers.

### Aim Avoidance
When the player aims at an approaching Nosalis:
- Takes a defensive hunched pose, protecting belly
- Keeps moving toward player but strafes to avoid aim
- Periodically exposes mouth weakspot with a growl (but not while being shot at)
- Won't attack while in this state
- Multiple iteration cycles refined this: initial "freeze in place" was exploitable → changed to strafe-and-advance.

### Investigation (Mutant-specific)
- **Gunshot → Combat**: Nosalis hears gunshot, immediately enters combat.
- **Thrown Can → Investigate**: Nosalis approaches thrown object, sniffs around, returns to idle if nothing found.
- Two-cone simplified vision (compared to humans' three cones).

### Key Iteration Insights (5 iterations)
1. Old hit-and-run jumping felt too fast and arcadey for VR → replaced with continuous slashing (less space required, more pressure).
2. Weakspot shielding (armor plates) was too confusing → simplified to "first hit = light stagger, second = heavy stagger."
3. Aiming-to-freeze was exploitable (lock down entire pack) → changed to strafe-and-advance with aim avoidance affecting only closest Nosalis.
4. Multiple simultaneous attackers (2+) made combat feel engaging instead of waiting for one-at-a-time turns.
5. Galloping at distance added intimidation; walk/gallop switching based on range.

---

## 4. Lurker

### Design Intent
Rat-like agile pack mutant. Contrasts with Nosalis: **stealthy**, **flanking**, **hit-and-run** (vs Nosalis: direct, intimidating, slow pressure). Recreates the Metro original games' stinging swarm experience.

### Core Behavior Loop
1. **Hide**: Lurkers find dark spots and hiding positions throughout the environment. Stay hidden between attack waves.
2. **Attack Wave**: Centralized wave system sends 2 lurkers in quick succession (3–6s intervals), then pauses for 8–11s between waves.
3. **Attack Run**: Lurker leaves hiding spot, runs toward player.
4. **Attack Types** (based on player orientation):
   - **Bounce Attack** (player IS looking at Lurker): Jumps at the player, strikes, bounces off to the side.
   - **Drive-by Attack** (player NOT looking): Lurker runs past, swipes on the way, ends in front of player (so player eventually sees it).
   - **Proximity Attack**: Player walks near a hidden lurker → immediate surprise attack.
5. **Escape**: After attacking, runs to a new hiding location.
6. **Inter-wave Behavior**: Wanders/runs between hiding spots, occasionally visible in the background to maintain tension.

### Key Mechanics
- **Stagger**: One bullet hit staggers a lurker (allows player to interrupt attacks and finish them off). Configurable recovery time.
- **Dodge**: When shot at/near, performs strafing jumps to evade. Triggered by bullet proximity, not by aiming.
- **Scatter**: When a lurker is killed, nearby lurkers within 8m run away in fear.
- **Spotted Reaction**: If player discovers a hiding lurker:
  - Close range → lurker attacks immediately.
  - Far range → lurker flees to a different hiding spot.

### Metrics (from FD)
| Parameter | Value |
|---|---|
| Active attack tokens | 2 (max 2 attacking simultaneously) |
| "Attack from hiding spot" tokens | 1 |
| Movement speed | 600 cm/s |
| Damage per hit | 30 |
| Vision (Normal cone) | ~1s detection time |
| Vision (Periphery cone) | ~1s |
| Vision (Focus cone) | 0.25s (fast detection) |

### Key Iteration Insights (4 iterations)
1. Initial "aggressive circling" behavior felt chaotic and erratic → replaced with hide-between-attacks for more lurker-like feel.
2. Always-from-front attacks made backing into corners too safe → added drive-by (from sides) and proximity attacks.
3. Wave system gave players breathing room to reload/heal while maintaining dread of "when is the next wave?"
4. Stagger was critical for player agency: without it, lurkers felt unresponsive to player actions.

---

## 5. Hunter / Cultist (Blowgun Enemies)

### Design Intent
Late-game enemies: stealthy blowgun-wielding cultists. **"Feels like human lurkers"** (positive playtest feedback). Hit-and-run: hide in darkness → attack from ambush positions → retreat. Designed to be "the most memorable enemy in the game."

### Core Behavior Loop
1. **Hide in Darkness**: Find hiding spots behind walls/objects, preferring dark areas. Uses navmesh-edge hiding spots with wall-width-aware exposure checks.
2. **Run to Attack Position**: Sprint to a position with line-of-sight to the player.
3. **Fire Single Dart**: Walk while aiming blowgun. Loud creepy inhalation telegraph. Single dart shot.
4. **Retreat**: Immediately retreat to a new hiding spot after firing.

### Key Mechanics
- **Dodge**: When the player aims at a Hunter, it dodges — strafing jump toward its next destination and away from the player's aim direction. Improved to look less like "teleporting."
- **Pair Attacks**: If the player stands still too long, two Hunters attack simultaneously from different angles to force repositioning.
- **Ambush Spot Management**: Validated hiding spots with wall-width checks, fallback behavior when no valid spots exist.
- **No Alarmed State in Combat**: Iterative testing removed the Combat → Alarmed transition because it broke the hit-and-run loop. Hunters stay in their unique behavior loop once combat starts.

### Key Iteration Insights (3 documented cycles)
1. Initial version was too easy — Hunters stood exposed too long. Fixed by making them retreat faster.
2. Dodge needed to look like a nimble survival reaction, not a glitch — improved with directional dodge-toward-destination.
3. Single-dart-then-retreat was more effective than sustained fire — emphasizes sniping/ambush identity.
4. Audio telegraph (inhalation before blowgun shot) was critical for player awareness — "hear the danger, locate the threat."

### EQS Query
`EQSQuery_HunterFindShootingSpot` — finds positions with line-of-sight to the player, factoring in darkness, wall proximity, and distance.

---

## 6. Accuracy System

### Overview
A **chance-to-hit** system for enemy shooting, giving designers precise control over how often enemies hit the player. Built into the `VGFirearmComponent`.

### How It Works
1. The firearm uses an **Accuracy value** (float 0–1) which changes based on **time that player was in view** (curve-driven).
2. For each projectile fired:
   - Evaluate chance-to-hit based on current accuracy value.
   - If pass → **force-hit** (projectile is aim-assisted to hit the player, with slight randomization so hits don't always strike center-face).
   - If fail → **force-miss** (projectile is offset in a random direction — not always to the right).
3. **Minimum Accuracy To Shoot**: A threshold below which the `ShootFirearm` task won't fire at all. Characters wait until accuracy rises (player stays in view) before pulling the trigger.
4. Configurable per firearm type via `BPT_Firearm` parameter template.

### Player Experience Impact
- Creates the feeling that enemies "warm up" their aim — early shots miss, sustained engagement becomes dangerous.
- Prevents unfair instant-headshots when a player peeks from cover.
- Combined with the token system (limited simultaneous shooters), creates controllable danger pressure.

### Changelist Evidence
- CL (2022): "When firing a gun, it's now possible to configure it to use an Accuracy value (a float in the 0-1 range)."
- CL (2022): "If bUseAimAssist and bUseAccuracy are enabled, for each projectile the firearm will evaluate a chance-to-hit based on the accuracy value. If it passes, the projectile will force-hit. If it doesn't pass, the projectile will force-miss."
- CL (2022): "Made accuracy of human shooting be affected by time that player was in view."
- CL (2022): "Added 'Minimum Accuracy To Shoot' to firearm template."

---

## 7. HTN (Hierarchical Task Network) Planning

### Role in the AI Architecture
HTN planning is the **central brain** driving all enemy behaviors. Every AI archetype (Human, Nosalis, Lurker, Hunter) uses HTN plans that decompose high-level goals into executable tasks.

### Architecture
- **Master HTN**: A top-level HTN asset per character type acts as a switch between state-specific subnetworks (e.g., `HTN_Human_Unaware`, `HTN_Human_Startled`, `HTN_Human_Investigate`, `HTN_Human_Alarmed`, `HTN_Human_Combat`).
- **IsInAIState Decorator**: Gates branches to only execute when the character is in the matching AI state. Supports scopes: `SelfOnly`, `AllGroupMembers`, `OtherGroupMembers`.
- **Recursive Plans**: Used for cover-to-cover advancement — "if close enough, go to ideal cover, else go to intermediate cover and recurse" — prevents looping between the same two cover spots.

### Custom HTN Nodes Built for Metro Awakening
**Tasks:**
- `HTNTask_ShootFirearm` — fires a weapon with accuracy/aim-assist integration, stores state in a persistent `HTNExtension_Shooting`
- `HTNTask_PlayVoiceLine` — triggers barks with priority/cooldown
- `HTNTask_PlayMotionWarpingMontage` — plays animation with motion warping
- `HTNTask_FaceTargetUsingAnimation` — turns to face a target using turning animations
- `HTNTask_SetAIState` — transitions the AI state machine
- `HTNTask_MarkDeadBodyReported` — marks a dead body as reported
- `HTNTask_PlayAnimation` — generic animation playback
- `HTNTask_GetValueFromParameterTemplate` — reads data-driven config values

**Decorators:**
- `DoOnce` / `DoOnceShared` — one-shot behaviors with gameplay tag tracking
- `ReserveLocationScope` — reserves a location to prevent multiple AIs going to the same spot
- `CooldownScope` — prevents the same character from repeating an action too quickly
- `TokenScope` — claims/releases tokens (combat coordination)
- `IsInAIState` — gates on state machine state (with group scope)
- `IsDeadBody` — checks validity/age of a dead body BB key
- `IsOnTheSameLine` — friendly-fire check

**Services:**
- `HTNService_RunEQS` — runs EQS queries at configurable intervals
- `HTNService_MarkVisibleCoverPointsAsSearched` — uses cover tracker to mark visible points as searched during Alarmed search

### Plugin Evolution
The HTN plugin went through 10+ major versions during Metro Awakening development (v1.8.1 → v1.18.3), with critical fixes including:
- Reentrant `OnTaskFinished` crash fix
- Quest 2 `FRotator` comparison bug
- Parallel node fixes
- Node instance pooling for performance
- BP decorators → C++ port (eliminated 15ms spikes on Quest 2)

---

## 8. Combat Coordination

### AI Groups
- `AIG_EncounterHumans` — automatically created when an encounter starts, all characters in the encounter join.
- Group propagates **AI Announcements** between members.
- Specialized coordinator components on the group handle specific phases:
  - `BAC_GroupInvestigationCoordinator` — assigns an Investigate token to the closest character when multiple hear a suspicious noise.
  - `BAC_GroupAlarmedCoordinator` — assigns AlarmedSearch tokens (closest N to last known location) and AlarmedGetCloser tokens (rest); after timeout, revokes all for patrol.
  - `BAC_KnownEnemyLocationTracker` — maintains last known enemy locations, updates cover tracker and sight target actor positions.
  - `BAC_EncounterGroupCoverTracker` — tracks cover safety relative to enemy positions.

### AI Token System
Tokens are the primary mechanism for **limiting simultaneous actions** and **coordinating turn-taking**:

| Token Type | Pool Location | Purpose |
|---|---|---|
| `ShootAt` | Player Pawn (`BAC_PlayerAITokenPool`) | Limits how many enemies fire simultaneously |
| `ShootSuppressive` | Player Pawn | Limits suppressive fire |
| `Advance` | AI Group | One character moves cover-to-cover at a time |
| `Investigate` | AI Group | Only one character goes to investigate a disturbance |
| `AlarmedSearch` | AI Group | Assigned to closest N characters for searching |
| `AlarmedGetCloser` | AI Group | Assigned to others for advancing |
| `Attack` (Lurker) | Lurker wave system | Max 2 lurkers attacking simultaneously |
| `AttackFromHidingSpot` | Lurker | Max 1 lurker using a hiding spot attack |

### Token Stealing (Fairness Mechanic)
To prevent situations where off-screen enemies hog shooting tokens while on-screen enemies stand around doing nothing:
- `BAC_EnemiesInViewTokenStealingManager` (on player pawn) tracks which enemies the player can see.
- **Enemies in player view**: `CanSteal = true`, `CanBeStolenFrom = false` for ShootAt tokens.
- **Enemies out of player view**: `CanSteal = false`, `CanBeStolenFrom = true`.
- Result: visible enemies can steal tokens from invisible ones, ensuring the player always sees enemies behaving aggressively.

### AI Announcements
Decoupled inter-AI messaging system:
- `BPA_EnemyLocationUpdate` — "I see the player here!" Contains enemy pawn, location, confidence flag. Triggers Combat transition if confident.
- `BPA_EnemyLost` — "Player is not where we thought!" Triggers Alarmed transition.
- Group's `OnMemberAIAnnouncementSent` forwards announcements to all other members.
- The `BAC_KnownEnemyLocationTracker` on the group listens to these announcements and updates the shared cover tracker + sight target positions.

### Nosalis Combat Circle Coordination
The Combat Circle is a spatial coordination system specifically for Nosalis packs:
- Divides the space around the player into **obstacle-aware sectors** projected onto navmesh.
- Assigns each Nosalis an optimal sector using an $O(n!)$ algorithm (viable for small pack sizes).
- Ensures Nosalises spread around the player without fully encircling them (designed escape routes).
- Inner radius maintains minimum approach distance.
- Also adapted as "Combat Cone" (configurable max angle) for the Orc character in Power Demos.

### Lurker Wave Coordination
Centralized attack wave system for lurker packs:
- **Wave Timing**: 8–11 seconds between waves.
- **Intra-wave Timing**: 3–6 seconds between individual attacks within a wave.
- **Max Active Attackers**: 2 simultaneous attack tokens.
- Result: creates rhythmic combat with clear moments of tension (wave) and relief (pause).

---

## Appendix: Key C++ Classes & Components

| Class/Component | Description |
|---|---|
| `UVGAIStateBase` | C++ base for all AI states (awareness, perception events) |
| `UVGStateMachineComponent` | State machine on AI characters |
| `VGSightSensorComponent` | Configurable multi-cone sight with time-slicing |
| `VGHearingSensorComponent` | Hearing with navmesh-based propagation |
| `VGSightTargetWithLightingComponent` | Sight target factoring in lighting |
| `UVGDeadBodyDetectorComponent` | Detects dead bodies via sight + overlap |
| `VGFirearmComponent` | Weapon system with accuracy/aim-assist |
| `BAC_KnownEnemyLocationTracker` | Tracks last known enemy locations on AI group |
| `BAC_GroupInvestigationCoordinator` | Assigns investigate tokens |
| `BAC_GroupAlarmedCoordinator` | Coordinates alarmed search/advance |
| `BAC_EnemiesInViewTokenStealingManager` | Token fairness for visible enemies |
| `VGAITokenPoolComponent` | Token pool for action coordination |
| `VGCombatCircle` | Obstacle-aware sector assignment for Nosalis |
| `BAC_Stagger` | Hit reaction pipeline with bone/damage multipliers |
| `UVGHTNDecorator_IsInAIState` | HTN decorator gating on AI state |
| `UVGHTNTask_SetAIState` | HTN task for state transitions |
| `UVGEnvQueryTest_IsOnTheSameLine` | Friendly-fire avoidance in EQS |
| `UVGHTNService_MarkVisibleCoverPointsAsSearched` | Marks cover points visible to searching AI |
| `UVGAlarmedSearchComponent` | Stores set of searched cover point IDs |
| `BP_SightTargetLastKnownLocation` | Actor at last known player position |

---

## Appendix: EQS Queries

| Query | Purpose |
|---|---|
| `EQSQuery_FindCoverForShooting_Defensive` | Find safe cover within firearm range |
| `EQSQuery_FindAlarmedFiringCover` | Cover for alarmed state engagement |
| `EQSQuery_NosalisFindLocationTowardsEnemy` | Nosalis approach position |
| `EQSQuery_HunterFindShootingSpot` | Hunter ambush/shooting position |
| `EQSQuery_FindCoverPointToSearch` | Next unsearched cover point during alarmed search |

---

## Appendix: HTN Assets

| HTN | Character | Purpose |
|---|---|---|
| `HTN_Human_Unaware` | Human | Idle/patrol/scripted |
| `HTN_Human_Startled` | Human | Startled reaction, return to unaware |
| `HTN_Human_Investigate` | Human | Go to disturbance, look around |
| `HTN_Human_Alarmed` | Human | Dead body reaction, alert others, search, advance |
| `HTN_Human_Combat` | Human | Lost enemy check, alert others, get cover, advance, shoot, suppress |
| `HTN_Human_Stagger` | Human | Stagger reaction handling |
| `HTN_NosalisCombatSwipeAttacks` | Nosalis | Approach, telegraph, attack sequence |
| `HTN_Lurker_Combat` | Lurker | Hide, wave timing, attack from hiding spot |
| `HTN_Hunter_Combat` | Hunter | Hide, run to shoot spot, fire, retreat |

---

## Appendix: Performance Optimizations (Quest 2 Ship)

Key AI-specific optimizations for Quest 2 shipping:
- BP decorators → C++ (eliminated 15ms frame spikes)
- Random timer stagger on synchronized ticks (prevented spike clustering)
- Gameplay tag volume octree: 4ms → 0.03ms (**133× speedup**)
- EQS budget tuning: 5ms → 2.5ms
- Cover system BP → C++ port with `TVGFrameCachedVariable` and 4000-item preallocation
- Animation Budget Allocator for all enemy types
- Actor pooling for Humans, Nosalises, Lurkers with property-comparison verification tests
- Path recalculation fix (120× reduction): stale BP wrapper references retained GC references to path target actors, forcing unnecessary recalculations long after paths were no longer needed
- NavLink auto-generation for obstacle navigation

---

## Appendix: Nosalis Iteration Summary (5 iterations)

| Iteration | Focus | Key Changes |
|---|---|---|
| 1 | Basic prototype | Continuous slashing (replacing old jump attacks), basic stagger, belly weakspot |
| 2 | Stagger + approach | Light/heavy stagger distinction, aim-to-threaten (makes them growl), leg-shot slowdown |
| 3 | Weakspot shielding, attack limit, aiming-stops-them | Armor shield on belly, attack count limits, Nosalis stops when aimed at (later deemed too exploitable) |
| 4 | Multiple attackers, retreat when aimed at | Aim → strafe + defensive pose (not freeze), 2 simultaneous attackers, hit reactions restored |
| 5 | Final L0 | Shield removed (first hit = light stagger, second = heavy), gallop at distance, extended weakspot hitboxes during attacks |

---

## Appendix: Lurker Iteration Summary (4 iterations)

| Iteration | Focus | Key Changes |
|---|---|---|
| 1 | Basic behavior | Run around, jump-attack from front, token-limited attacks |
| 2 | Dodging + locomotion | Side-dodge when shot near, actual lurker mesh, scatter on ally death |
| 3 | Stealthier behavior | Hide-between-attacks, drive-by attacks from sides, audio telegraph before attack |
| 4 | Wave system | Centralized wave timing (8-11s intervals), stagger-on-hit, spotted-reaction from hiding spots, wandering between waves |
