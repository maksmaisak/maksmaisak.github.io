import { clipComposition } from "../clipComposition";

export const spec = clipComposition({
  id: "cover-dynamic-safety",
  src: "cover_dynamic_safety.mp4",
  durationSeconds: 12,
  placeholder:
    "Enable cover point safety visualization and walk the player around. " +
    "Points near the player update more often. " +
    "Show green (safe) turning red (unsafe) as player flanks. 10-15s.",
});
