import { clipComposition } from "../clipComposition";

export const spec = clipComposition({
  id: "perception-sight-fields",
  src: "perception_sight_fields.mp4",
  durationSeconds: 10,
  placeholder:
    "Select a human AI, enable sight field debug drawing. " +
    "Show Focus, Normal, and Periphery cones tracking the player, " +
    "with trace lines changing color as awareness builds. 8-12s.",
});
