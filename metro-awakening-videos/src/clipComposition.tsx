import React from "react";
import { Clip } from "./Clip";
import type { CompositionSpec } from "./CompositionSpec";

/**
 * Helper to define a single-clip composition with minimal boilerplate.
 * Each call produces a CompositionSpec ready for auto-discovery.
 */
export function clipComposition(opts: {
  id: string;
  src: string;
  /** Duration in seconds (converted to frames at composition fps) */
  durationSeconds: number;
  placeholder?: string;
}): CompositionSpec {
  const fps = 60;
  const Component: React.FC = () => (
    <Clip src={opts.src} placeholder={opts.placeholder} />
  );
  Component.displayName = opts.id;

  return {
    id: opts.id,
    component: Component,
    durationInFrames: Math.round(opts.durationSeconds * fps),
    fps,
  };
}
