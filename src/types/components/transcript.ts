import {
  PagesPageBlocksHeroReportUiLeftHandSide as LeftHandSide,
  PagesPageBlocksHeroReportUiRightHandSide as RightHandSide,
} from "../../../tina/__generated__/types";

export type TypewriterTextProps = {
  setShouldStartTyping?: (value: boolean) => void;
  shouldStartTyping: boolean;
  text: string;
  repeatDelay?: number;
  startDelay?: number;
  className?: string;
};

export type TranscriptBoxProps = {
  leftHandSide: LeftHandSide;
  rightHandSide: RightHandSide;
};

export type TextPart = {
  text: string;
  highlight: boolean;
};

export type UseTypewriterProps = {
  text: string;
  shouldStartTyping: boolean;
};
