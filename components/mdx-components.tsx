import { CodeBlock } from "@/components/code-block";

interface PreProps {
  children: {
    props: {
      children: string;
      className?: string;
    };
  };
}

export const components = {
  pre: ({ children }: PreProps) => {
    const code = children?.props?.children;
    const lang = children?.props?.className;
    return <CodeBlock className={lang}>{code}</CodeBlock>;
  },
};
