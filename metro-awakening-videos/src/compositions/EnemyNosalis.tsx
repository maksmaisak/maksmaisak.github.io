import { clipComposition } from "../clipComposition";

export const spec = clipComposition({
  id: "enemy-nosalis",
  src: "enemy_nosalis.mp4",
  durationSeconds: 12,
  placeholder:
    "Nosalises in combat, surrounding the player and attacking in a group. " +
    "Enable combat circle debug visualization during part of the clip. 10-15s.",
});
