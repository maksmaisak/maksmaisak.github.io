import type React from "react";

export interface CompositionSpec {
  id: string;
  component: React.FC;
  durationInFrames: number;
  fps?: number;
  width?: number;
  height?: number;
}
