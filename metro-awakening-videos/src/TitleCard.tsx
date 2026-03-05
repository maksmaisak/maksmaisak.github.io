import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Simple title card with fade-in, shown at the start of a montage.
 */
export const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        opacity,
      }}
    >
      <h1
        style={{
          color: "#d4883a",
          fontSize: 64,
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
          margin: 0,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: "#aaa",
            fontSize: 28,
            fontFamily: "Arial, sans-serif",
            fontWeight: 400,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
