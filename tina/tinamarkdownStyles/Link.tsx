const Link = (
  props: { url: string; children: React.ReactNode } | undefined
) => {
  return (
    <a
      href={props?.url}
      className="text-ssw-red underline transition-colors hover:text-white"
    >
      {props?.children}
    </a>
  );
};

export default Link;
