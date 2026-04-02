import { clipComposition } from "../clipComposition";

export const spec = clipComposition({
  id: "rvo-avoidance",
  src: "rvo_avoidance.mp4",
  durationSeconds: 10,
  placeholder:
    "Multiple characters navigating past each other in a corridor or tight space. " +
    "Enable debug visualization showing candidate avoidance directions " +
    "and navmesh edge clipping. 8-12s.",
});
