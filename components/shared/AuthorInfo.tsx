import Image from "next/image";
import { ReadingTime } from "./ReadingTime";

interface AuthorInfoProps {
  name: string;
  role: string;
  avatarUrl: string;
  date: string;
  readingTime?: number;
}

export function AuthorInfo({
  name,
  role,
  avatarUrl,
  date,
  readingTime,
}: AuthorInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="h-10 w-10 overflow-hidden rounded-full">
        <Image
          src={avatarUrl || "/placeholder.svg"}
          alt={name}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <div className="font-medium text-white">{name}</div>
        <div className="text-sm text-gray-400">
          {role} • {date}{" "}
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
