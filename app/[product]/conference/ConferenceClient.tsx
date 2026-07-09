/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FaRegCalendar, FaRegMap, FaRegStar } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import { IoMdBook } from "react-icons/io";
import { useTina } from "tinacms/dist/react";
import { Components, TinaMarkdown } from "tinacms/dist/rich-text";
import Container from "../../../components/Container";
import { Button } from "../../../components/ui/button";

const FALLBACK_SPEAKER_IMAGE = "/YakShaver/People/uly-avatar.png";

const HeaderBanner = ({
  banner,
  scrollToAgenda,
}: {
  banner: any;
  scrollToAgenda: () => void;
}) => {
  return (
    <div className="relative isolate overflow-hidden rounded-none lg:rounded-3xl lg:mx-auto lg:max-w-6xl bg-linear-to-r from-[#0e0e0e] via-[#131313] to-[#141414] text-white">
      <div
        className="absolute w-full h-full blur-[150px] opacity-40 rounded-full -left-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom right, #CC4141 0%, #F46772 50%, black 100%)",
        }}
      />
      <div className="relative flex flex-col justify-center items-center text-center lg:p-16 p-10">
        <h1 className="text-4xl md:text-5xl font-bold pb-4 bg-linear-to-br from-red-400 to-red-700 bg-clip-text text-transparent">
          {banner?.bannerTitle}
        </h1>
        <h2 className="text-2xl max-w-4xl font-bold pb-4">
          {banner?.bannerTagline}
        </h2>
        <h3 className="text-lg md:text-xl max-w-4xl text-gray-300">
          {banner?.bannerDescription}
        </h3>
        <div className="flex flex-col md:flex-row py-6 gap-6 md:gap-10">
          <div className="flex gap-2 items-center justify-center">
            <FaRegCalendar className="text-[#CC4141]" />
            <span>{banner?.date}</span>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <FaRegClock className="text-[#CC4141]" />
            <span>{banner?.time}</span>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <FaRegMap className="text-[#CC4141]" />
            {banner?.locationLink ? (
              <Link
                href={banner.locationLink}
                target="_blank"
                className="underline hover:text-[#CC4141] transition-colors"
              >
                {banner?.location}
              </Link>
            ) : (
              <span>{banner?.location}</span>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          {banner?.actionButton?.title && (
            <Button variant="white" onClick={scrollToAgenda}>
              {banner.actionButton.title}
            </Button>
          )}
          {banner?.rightButton?.title && banner?.rightButton?.link && (
            <Link href={banner.rightButton.link} target="_blank">
              <Button>{banner.rightButton.title}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const icons = {
  FaRegStar: <FaRegStar size={40} />,
  IoMdBook: <IoMdBook size={40} />,
  GoPeople: <GoPeople size={40} />,
};

const KeyHighlights = ({ highlights }: { highlights: any }) => {
  if (!highlights) return null;
  return (
    <div className="flex flex-col md:flex-row py-12 gap-8 max-w-5xl text-lg">
      {[
        ["headerLeft", "descriptionLeft", "iconLeft"],
        ["headerMiddle", "descriptionMiddle", "iconMiddle"],
        ["headerRight", "descriptionRight", "iconRight"],
      ].map(([header, description, icon]) => (
        <div
          key={header}
          className="flex flex-col gap-2 items-center w-full md:w-1/3 rounded-[20px] bg-linear-to-r from-[#0e0e0e] via-[#131313] to-[#141414] p-8"
        >
          <div className="text-white bg-linear-to-br from-red-400 to-red-700 p-2 mb-4 rounded-full [&>svg]:p-1">
            {icons[highlights[icon] as keyof typeof icons] ?? icons.FaRegStar}
          </div>
          <h3 className="font-bold text-white">{highlights[header]}</h3>
          <p className="text-gray-300 text-base">{highlights[description]}</p>
        </div>
      ))}
    </div>
  );
};

const conferenceMarkdownComponents: Components<object> = {
  a: (props) => (
    <Link
      href={props?.url ?? "#"}
      target="_blank"
      className="underline hover:text-[#CC4141] transition-colors"
    >
      {props?.children}
    </Link>
  ),
};

interface Speaker {
  name: string;
  position: string;
  image: string;
  socialLink: string;
}

interface Session {
  talkSpeakerName: string | null;
  talkSpeakerImage: string | null;
  speechTitle: string;
  speechDescription: string;
  talkTimeStart: number;
  talkTimeEnd?: number;
  sessionType: "Talk" | "Workshop" | "Break";
}

const ExpertSpeakers = ({ speakers }: { speakers: Speaker[] }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 md:pt-16">
      <h2 className="text-3xl font-bold pb-12 bg-linear-to-br from-red-400 to-red-700 bg-clip-text text-transparent">
        Expert Speakers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-14">
        {speakers.map((speaker) => (
          <div
            key={speaker.name}
            className="col-span-1 flex flex-col items-center"
          >
            <Link href={speaker.socialLink || "#"} target="_blank">
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-xl border-2 border-white/10 hover:border-[#CC4141] transition-colors">
                <Image
                  src={speaker.image || FALLBACK_SPEAKER_IMAGE}
                  alt={speaker.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <h3 className="font-bold text-lg pt-5 text-white">
              {speaker.name}
            </h3>
            <h4 className="text-gray-400 text-lg">{speaker.position}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatTime(time: number) {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHour}:${formattedMinutes} ${ampm}`;
}

function Agenda({
  sessions,
  agendaRef,
}: {
  sessions: Session[];
  agendaRef: React.RefObject<HTMLDivElement>;
}) {
  // Group sessions by start time
  const sessionsByTime = sessions.reduce(
    (acc, session) => {
      const timeKey = session.talkTimeStart.toString();
      if (!acc[timeKey]) {
        acc[timeKey] = {
          timeStart: session.talkTimeStart,
          timeEnd: session.talkTimeEnd,
          talks: [],
          breaks: [],
        };
      }

      if (session.sessionType === "Break") {
        acc[timeKey].breaks.push(session);
      } else {
        acc[timeKey].talks.push(session);
      }

      return acc;
    },
    {} as Record<
      string,
      {
        timeStart: number;
        timeEnd?: number;
        talks: Session[];
        breaks: Session[];
      }
    >
  );

  const timeSlots = Object.values(sessionsByTime).sort(
    (a, b) => a.timeStart - b.timeStart
  );

  return (
    <div className="flex flex-col items-center w-full" ref={agendaRef}>
      <h2
        id="agenda"
        className="text-3xl font-bold pt-16 pb-8 bg-linear-to-br from-red-400 to-red-700 bg-clip-text text-transparent"
      >
        Agenda
      </h2>

      {timeSlots.length === 0 ? (
        <p className="text-lg text-gray-300 pb-16">
          The full agenda is coming soon.
        </p>
      ) : (
        <>
          {/* Desktop view (table) */}
          <div className="w-full max-w-5xl overflow-x-auto hidden md:block rounded-xl border border-white/10">
            <table className="w-full border-collapse text-white">
              <thead>
                <tr className="bg-[#141414]">
                  <th className="border border-white/10 p-4 w-1/6 text-left">
                    Time
                  </th>
                  <th className="border border-white/10 p-4 w-4/5 text-center">
                    Talks
                  </th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.timeStart} className="bg-[#1a1a1a]">
                    <td className="border border-white/10 p-4 align-top text-left">
                      <div className="font-bold leading-6">
                        {formatTime(slot.timeStart)} -
                        <br />
                        {slot.timeEnd ? formatTime(slot.timeEnd) : ""}
                      </div>
                    </td>

                    {slot.breaks.length > 0 ? (
                      <td className="border border-white/10 p-4 text-center">
                        {slot.breaks.map((breakSession) => (
                          <div
                            key={breakSession.speechTitle}
                            className="mb-4 last:mb-0"
                          >
                            <h3 className="text-lg font-bold">
                              {breakSession.speechTitle}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {breakSession.speechDescription}
                            </p>
                          </div>
                        ))}
                      </td>
                    ) : (
                      <td className="border border-white/10 p-4 align-top text-left">
                        {slot.talks.map((talk) => (
                          <div
                            key={talk.speechTitle}
                            className="mb-4 last:mb-0 flex"
                          >
                            <div>
                              <h3 className="text-lg leading-6 font-bold">
                                {talk.speechTitle}
                              </h3>
                              {talk.talkSpeakerName && (
                                <div className="flex items-center gap-2 text-gray-400 mt-1">
                                  <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center">
                                    <Image
                                      src={
                                        talk.talkSpeakerImage ||
                                        FALLBACK_SPEAKER_IMAGE
                                      }
                                      alt={talk.talkSpeakerName || "Speaker"}
                                      width={100}
                                      height={100}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {talk.talkSpeakerName}
                                  </span>
                                </div>
                              )}
                              <p className="text-gray-400 text-sm pt-2">
                                {talk.speechDescription}
                              </p>
                            </div>
                          </div>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view (cards) */}
          <div className="w-full max-w-6xl md:hidden text-left text-white">
            {timeSlots.map((slot) => (
              <div key={slot.timeStart} className="mb-8">
                <div className="bg-[#141414] py-3 px-4 rounded-t-lg font-bold border border-white/10">
                  {formatTime(slot.timeStart)} -{" "}
                  {slot.timeEnd ? formatTime(slot.timeEnd) : ""}
                </div>

                {slot.breaks.length > 0 ? (
                  <div className="border border-t-0 border-white/10 p-4 bg-[#1a1a1a]">
                    {slot.breaks.map((breakSession) => (
                      <div
                        key={breakSession.speechTitle}
                        className="mb-4 last:mb-0"
                      >
                        <div className="bg-[#CC4141]/20 text-[#CC4141] text-sm rounded-full px-2 w-fit mb-2">
                          Break
                        </div>
                        <h3 className="text-lg leading-5 font-bold">
                          {breakSession.speechTitle}
                        </h3>
                        <p className="text-gray-400 text-sm pt-1">
                          {breakSession.speechDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-t-0 border-white/10 p-4 space-y-6 bg-[#1a1a1a]">
                    {slot.talks.map((talk) => (
                      <div
                        key={talk.speechTitle}
                        className="pb-4 border-b border-white/10 last:border-b-0 last:pb-0"
                      >
                        <div className="bg-white/10 text-white text-sm rounded-full px-2 w-fit mb-2">
                          Talk
                        </div>
                        <h3 className="text-lg font-bold leading-5">
                          {talk.speechTitle}
                        </h3>
                        {talk.talkSpeakerName && (
                          <div className="flex items-center gap-2 text-gray-400 mt-1">
                            <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center">
                              <Image
                                src={
                                  talk.talkSpeakerImage ||
                                  FALLBACK_SPEAKER_IMAGE
                                }
                                alt={talk.talkSpeakerName || "Speaker"}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm">
                              {talk.talkSpeakerName}
                            </span>
                          </div>
                        )}
                        <p className="text-gray-400 text-sm pt-2">
                          {talk.speechDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ConferenceClient({
  query,
  data,
  variables,
}: {
  query: string;
  data: any;
  variables: any;
}) {
  const tinaData = useTina({
    query,
    data,
    variables,
  });

  const conference = tinaData.data?.conference;

  const sessions: Session[] = (conference?.speakerSchedule || []).map(
    (session: any) => ({
      speechTitle: session.speechTitle || "TBD",
      speechDescription: session.speechDescription || "",
      talkSpeakerName:
        session.sessionType === "Break" ? null : session.talkSpeakerName,
      talkSpeakerImage:
        session.sessionType === "Break"
          ? null
          : session.talkSpeakerImage || FALLBACK_SPEAKER_IMAGE,
      talkTimeStart: session.talkTimeStart || 0,
      talkTimeEnd: session.talkTimeEnd ?? undefined,
      sessionType: session.sessionType || "Break",
    })
  );

  const agendaRef = useRef<HTMLDivElement>(null);
  const scrollToAgenda = () => {
    if (agendaRef.current) {
      const offset = 100;
      const top =
        agendaRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-6 text-white">
      <HeaderBanner banner={conference?.banner} scrollToAgenda={scrollToAgenda} />
      <Container className="flex flex-col justify-center items-center text-center py-16">
        <h2 className="text-3xl font-bold pb-4 bg-linear-to-br from-red-400 to-red-700 bg-clip-text text-transparent">
          {conference?.about?.heading}
        </h2>
        <div className="text-lg max-w-4xl text-gray-300 flex flex-col gap-4">
          <TinaMarkdown
            content={conference?.about?.description}
            components={conferenceMarkdownComponents}
          />
        </div>
        <KeyHighlights highlights={conference?.about?.keyHighlights} />
        {conference?.speakers?.length > 0 && (
          <ExpertSpeakers speakers={conference.speakers} />
        )}
        <Agenda sessions={sessions} agendaRef={agendaRef} />
      </Container>
    </div>
  );
}
