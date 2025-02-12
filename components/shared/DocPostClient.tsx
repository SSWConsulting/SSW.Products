'use client';

import Link from 'next/link';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { DocAndBlogMarkdownStyle } from './DocAndBlogMarkdownStyle';
import { useTina } from 'tinacms/dist/react';
import { Docs } from '../../tina/__generated__/types';

interface DocPostClientProps {
  query: string;
  variables: object;
  pageData: { docs: Docs };
}

const BreadCrumbs = ({ title }: { title: string }) => {
  return (
    <div className="font-light mb-8 text-base inline-flex items-top">
      <Link className="underline cursor-pointer" href="/docs">
        DOCS
      </Link>
      <span className="mx-2">
        <MdOutlineKeyboardArrowRight size={20} />
      </span>
      <span>{title.toUpperCase()}</span>
    </div>
  );
};

export default function DocPostClient({
  query,
  variables,
  pageData,
}: DocPostClientProps) {
  const { data } = useTina<{ docs: Docs }>({
    query,
    variables,
    data: pageData,
  });

  

  if (!data?.docs) {
    return <p className="text-center text-white">No content available.</p>;
  }

  const { title, date, body } = data.docs;

  // Ensure the date is valid before formatting
  const parsedDate = date ? new Date(date) : null;
  const formattedDate = parsedDate && !isNaN(parsedDate.getTime()) 
    ? `${parsedDate.getDate()} ${parsedDate.toLocaleString('default', { month: 'long' })} ${parsedDate.getFullYear()}`
    : 'Unknown Date';

  return (
    <div className="p-4 lg:pt-32 md:pt-32 mt-20 font-semibold max-w-3xl mx-auto text-white">
      <BreadCrumbs title={title} />
      <h2 className="text-3xl mb-2 tracking-wide">{title}</h2>

      <div className="text-sm font-light text-gray-300 uppercase mb-4">
        <div>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="text-base font-light lg:prose-xl">
        <TinaMarkdown content={body ?? { type: 'root', children: [] }} components={DocAndBlogMarkdownStyle} />
      </div>
    </div>
  );
}
