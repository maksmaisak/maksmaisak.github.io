import { clipComposition } from "../clipComposition";

export const spec = clipComposition({
  id: "enemy-lurker",
  src: "enemy_lurker.mp4",
  durationSeconds: 12,
  placeholder:
    "Lurkers hiding, attacking in waves (bounce/drive-by), " +
    "and retreating to new hiding spots. Show scatter when one dies. 10-15s.",
});
