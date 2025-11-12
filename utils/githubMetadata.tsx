"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaHistory } from "react-icons/fa";
import { formatDate } from "./formatDate";
import { getRelativeTime } from "./timeUtils";

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface GitHubMetadataProps {
  /** GitHub repository owner (e.g., 'tinacms') */
  owner?: string;
  /** GitHub repository name (e.g., 'tina.io') */
  repo?: string;
  /** Optional path to a specific file in the repository */
  path?: string;
  /** Additional CSS classes to apply to the component */
  className?: string;
}

export interface GitHubMetadataResponse {
  latestCommit: GitHubCommit;
  firstCommit: GitHubCommit | null;
  historyUrl: string;
}

async function fetchGitHubMetadata(
  owner: string,
  repo: string,
  path?: string
): Promise<GitHubMetadataResponse> {
  const params = new URLSearchParams({
    owner,
    repo,
  });

  if (path) {
    params.append("path", path);
  }

  const response = await fetch(`/api/github-metadata?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export default function GitHubMetadata({
  owner = "SSWConsulting",
  repo = "SSW.Products",
  path,
  className = "",
}: GitHubMetadataProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["github-metadata", owner, repo, path],
    queryFn: () => fetchGitHubMetadata(owner, repo, path),
    enabled: !!owner && !!repo,
  });

  if (isLoading) {
    return <div className={`${className}`}>Loading last updated info...</div>;
  }

  if (error || !data) {
    return (
      <div className={`${className}`}>Unable to load last updated info</div>
    );
  }

  const { latestCommit, firstCommit, historyUrl } = data;
  const lastUpdatedDate = latestCommit.commit.author.date;
  const lastUpdateInRelativeTime = getRelativeTime(lastUpdatedDate);
  const lastUpdateInAbsoluteTime = formatDate(lastUpdatedDate);
  const createdDate = firstCommit?.commit.author.date;
  const createdTime = createdDate ? formatDate(createdDate) : null;

  const tooltipContent = createdTime
    ? `Created ${createdTime}\nLast updated ${lastUpdateInAbsoluteTime}`
    : `Last updated ${lastUpdateInAbsoluteTime}`;

  return (
    <div className={`${className}`}>
      <div className="flex md:flex-row flex-col md:items-center gap-2">
        <span>
          Last updated by{" "}
          <span className="font-bold text-white">
            {latestCommit.commit.author.name}
          </span>
          {` ${lastUpdateInRelativeTime} -`}
        </span>
        <div className="relative group">
          <Link
            href={historyUrl}
            target="_blank"
            title={tooltipContent}
            rel="noopener noreferrer"
            className="hover:text-ssw-red text-white underline flex flex-row items-center gap-1.5"
          >
            See history
            <FaHistory className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
