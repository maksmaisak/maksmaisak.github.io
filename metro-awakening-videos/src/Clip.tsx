import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import React, { useEffect, useMemo, useRef, useState } from "react";

const availabilityCache = new Map<string, boolean>();

const finishRenderHandle = (
  renderHandle: number,
  finishedRef: React.MutableRefObject<boolean>,
) => {
  if (finishedRef.current) {
    return;
  }

  finishedRef.current = true;
  continueRender(renderHandle);
};

const MissingVideoPlaceholder: React.FC<{ src: string; placeholder?: string }> = ({ src, placeholder }) => {
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, rgba(25,25,25,1) 0%, rgba(45,32,20,1) 100%)",
        color: "#f2f2f2",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          border: "2px dashed rgba(212, 136, 58, 0.7)",
          borderRadius: 24,
          padding: "36px 42px",
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        <div
          style={{
            color: "#d4883a",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 14,
            textTransform: "uppercase",
          }}
        >
          Missing Preview Video
        </div>
        {placeholder ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.4,
              marginBottom: 18,
            }}
          >
            {placeholder}
          </div>
        ) : (
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 18,
            }}
          >
            Add the source clip to the public folder.
          </div>
        )}
        <div
          style={{
            color: "#c7c7c7",
            fontSize: 24,
            lineHeight: 1.45,
            marginBottom: 24,
          }}
        >
          This composition is using a safe placeholder so preview and render do not
          crash when footage is not available yet.
        </div>
        <div
          style={{
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            padding: "16px 18px",
            fontSize: 24,
            color: "#ffffff",
            wordBreak: "break-word",
          }}
        >
          public/{src}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Full-frame video clip that fills the composition.
 * Place raw footage in public/ and reference by filename.
 */
export const Clip: React.FC<{
  src: string;
  /** Trim start in seconds */
  trimStart?: number;
  /** Trim end in seconds */
  trimEnd?: number;
  /** Instruction text shown in placeholder when clip is missing */
  placeholder?: string;
}> = ({ src, trimStart, trimEnd, placeholder }) => {
  const { fps } = useVideoConfig();
  const resolvedSrc = staticFile(src);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(() => {
    return availabilityCache.has(resolvedSrc)
      ? (availabilityCache.get(resolvedSrc) ?? false)
      : null;
  });
  const renderHandle = useMemo(() => {
    if (availabilityCache.has(resolvedSrc)) {
      return null;
    }

    return delayRender(`Checking video asset: ${src}`);
  }, [resolvedSrc, src]);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (availabilityCache.has(resolvedSrc)) {
      setIsAvailable(availabilityCache.get(resolvedSrc) ?? false);

      if (renderHandle !== null) {
        finishRenderHandle(renderHandle, finishedRef);
      }

      return;
    }

    const abortController = new AbortController();
    const timeout = window.setTimeout(() => {
      availabilityCache.set(resolvedSrc, false);
      setIsAvailable(false);

      if (renderHandle !== null) {
        finishRenderHandle(renderHandle, finishedRef);
      }
    }, 2500);

    const markResolved = (available: boolean) => {
      availabilityCache.set(resolvedSrc, available);
      setIsAvailable(available);
      window.clearTimeout(timeout);

      if (renderHandle !== null) {
        finishRenderHandle(renderHandle, finishedRef);
      }
    };

    fetch(resolvedSrc, {
      method: "HEAD",
      signal: abortController.signal,
    })
      .then((response) => {
        markResolved(response.ok);
      })
      .catch(() => {
        markResolved(false);
      });

    return () => {
      abortController.abort();
      window.clearTimeout(timeout);

      if (renderHandle !== null) {
        finishRenderHandle(renderHandle, finishedRef);
      }
    };
  }, [renderHandle, resolvedSrc]);

  if (isAvailable !== true) {
    return <MissingVideoPlaceholder src={src} placeholder={placeholder} />;
  }

  return (
    <Video
      src={resolvedSrc}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      volume={0}
      trimBefore={trimStart ? trimStart * fps : undefined}
      trimAfter={trimEnd ? trimEnd * fps : undefined}
    />
  );
};
