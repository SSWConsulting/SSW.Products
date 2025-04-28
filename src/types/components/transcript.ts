import {
  PagesPageBlocksHeroReportUiLeftHandSide as LeftHandSide,
  PagesPageBlocksHeroReportUiRightHandSide as RightHandSide,
} from "../../../tina/__generated__/types";

export type TypewriterTextProps = {
  onTypingComplete?: () => void;
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
