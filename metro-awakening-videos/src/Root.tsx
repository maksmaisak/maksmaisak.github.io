import "./index.css";
import { Composition } from "remotion";
import type { CompositionSpec } from "./CompositionSpec";

const FPS = 60;
const WIDTH = 1280;
const HEIGHT = 720;

/**
 * Auto-discovers all compositions from src/compositions/.
 *
 * To add a new composition:
 *   1. Create a .tsx file in src/compositions/
 *   2. Export `spec: CompositionSpec` from it
 *   3. It appears automatically in Remotion Studio and render scripts
 */

const ctx = require.context("./compositions", true, /\.tsx$/);
const specs: CompositionSpec[] = ctx
  .keys()
  .map((key: string) => (ctx(key) as { spec?: CompositionSpec }).spec)
  .filter((s): s is CompositionSpec => s != null);

export const RemotionRoot: React.FC = () => (
  <>
    {specs.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={s.component}
        durationInFrames={s.durationInFrames}
        fps={s.fps ?? FPS}
        width={s.width ?? WIDTH}
        height={s.height ?? HEIGHT}
      />
    ))}
  </>
);
