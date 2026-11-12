import Image from "next/image";
import type { CSSProperties } from "react";
import manifest from "@/lib/image-manifest.json";

const dims = manifest as unknown as Record<string, [number, number]>;

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  eager?: boolean;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  "aria-hidden"?: "true" | boolean;
};

export default function Img({ src, alt, sizes, priority, eager, fill, className, style, width, height, ...rest }: Props) {
  const d: [number, number] = dims[src] ?? [width ?? 1600, height ?? 1000];
  if (src.endsWith(".svg")) {
    const h = height ?? d[1];
    const w = height && !width ? Math.round((d[0] / d[1]) * height) : (width ?? d[0]);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        className={className}
        style={style}
        loading={priority ? undefined : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        aria-hidden={rest["aria-hidden"]}
      />
    );
  }
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority || eager ? "eager" : undefined}
        className={className}
        style={{ objectFit: "cover", ...style }}
        aria-hidden={rest["aria-hidden"]}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={d[0]}
      height={d[1]}
      sizes={sizes ?? "(max-width: 860px) 100vw, 50vw"}
      preload={priority}
      fetchPriority={priority ? "high" : undefined}
      loading={priority || eager ? "eager" : undefined}
      className={className}
      style={style}
      aria-hidden={rest["aria-hidden"]}
    />
  );
}
