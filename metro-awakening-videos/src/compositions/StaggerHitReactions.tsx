import { clipComposition } from "../clipComposition";

export const spec = clipComposition({
  id: "stagger-hit-reactions",
  src: "stagger_hit_reactions.mp4",
  durationSeconds: 10,
  placeholder:
    "Shoot enemies in different body parts. " +
    "Show directional hit reactions (additive flinch) " +
    "and full stagger when damage threshold is reached. 8-12s.",
});
