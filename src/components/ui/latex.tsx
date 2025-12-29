import "katex/dist/katex.min.css"; // 必须引入 CSS，否则公式会乱
import katex from "katex";
import { useMemo } from "react";

interface LatexProps {
  children: string; // 公式字符串，例如 "E=mc^2"
  block?: boolean;  // 是否块级显示 (display mode)
}

export default function Latex({ children, block = false }: LatexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, {
        displayMode: block,
        throwOnError: false, // 解析错误时不抛出异常，而是显示源码
        errorColor: "#cc0000",
      });
    } catch (e) {
      return children; // 兜底策略
    }
  }, [children, block]);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ display: block ? "block" : "inline-block" }}
    />
  );
}