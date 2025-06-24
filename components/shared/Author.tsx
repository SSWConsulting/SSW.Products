import Image from "next/image";
import Link from "next/link";

const Author = ({
  authorImage,
  sswPeopleLink,
  author,
}: {
  authorImage?: string | null;
  sswPeopleLink?: string | null;
  author?: string | null;
}) => {
  return (
    <div className="flex gap-3 items-center">
      <div className="size-8 items-center relative rounded-full overflow-hidden">
        <Image
          src={authorImage || "/default-images/Placeholder-profile.png"}
          alt="placeholder blog author"
          fill
          className="object-cover"
        />
      </div>
      <p className="font-medium h-fit">
        {sswPeopleLink ? (
          <Link className="hover:underline" href={sswPeopleLink}>
            {author}
          </Link>
        ) : (
          <>{author}</>
        )}
      </p>
    </div>
  );
};

export default Author;
