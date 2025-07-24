const Link = (
  props: { url: string; children: React.ReactNode } | undefined
) => {
  return (
    <a
      href={props?.url}
      className="text-white underline transition-colors hover:text-ssw-red"
    >
      {props?.children}
    </a>
  );
};

export default Link;
