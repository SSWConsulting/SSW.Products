import { Author } from "@/types/author";
import Image from "next/image";
import Link from "next/link";
import { ReadingTime } from "./ReadingTime";

type AuthorInfoProps = {
  date: string;
  readingTime?: number;
} & Author;

export function AuthorInfo({
  sswPeopleLink,
  author,
  date,
  readingTime,
}: AuthorInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="h-10 w-10 overflow-hidden rounded-full">
        <Image
          src={sswPeopleLink || "/placeholder.svg"}
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        {author && (
          <AuthorWrapper sswPeopleLink={sswPeopleLink} author={author} />
        )}
        <div className="text-sm text-gray-400">
          {date}{" "}
          {readingTime && (
            <span>
              • <ReadingTime minutes={readingTime} inline />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const AuthorWrapper = ({ sswPeopleLink, author }: Author) => {
  return (
    <>
      {sswPeopleLink ? (
        <Link href={sswPeopleLink}>{author}</Link>
      ) : (
        <span>{author}</span>
      )}
    </>
  );
};
