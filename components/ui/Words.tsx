import { Fragment, type CSSProperties, type JSX } from "react";

type Props = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  br?: number;
  style?: CSSProperties;
  children: string;
  "aria-hidden"?: boolean | "true";
};

// Headline words
export default function Words({ as: Tag = "h1", className = "", br = 0, style, children, ...rest }: Props) {
  const words = children.trim().split(/\s+/);
  return (
    <Tag className={`${className} is-in`.trim()} style={style} aria-hidden={rest["aria-hidden"]}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {br && i === br ? <br /> : i > 0 ? " " : null}
          <span className="w" style={{ "--i": i } as CSSProperties}>
            {w}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
