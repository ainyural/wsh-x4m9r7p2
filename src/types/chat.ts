export type MessageSide = "in" | "out";
export type MessageKind = "text" | "bot" | "image" | "csat" | "quickReplies" | "tripCards";

export interface Theme {
  pageBg: string;
  screenBg: string;
  headerBg: string;
  bubbleIn: string;
  textIn: string;
  link: string;
  muted: string;
  composerBg: string;
  composerField: string;
  composerLine: string;
  icon: string;
  sendBg: string;
}

export interface Layout {
  contentScale: number;
}

export interface StatusBar {
  time: string;
}

export interface Header {
  back: string;
  title: string;
}

export interface Composer {
  placeholder: string;
  attachPath: string;
  sendBgPath: string;
  sendArrowPath: string;
}

interface MessageBase {
  id: string;
  side: MessageSide;
  kind: MessageKind;
  time?: string;
  label?: string;
}

export interface TextMessage extends MessageBase {
  kind: "text" | "bot";
  text: string;
  size?: "small" | "main";
}

export interface ImageMessage extends MessageBase {
  kind: "image";
  src: string;
}

export interface CsatMessage extends MessageBase {
  kind: "csat";
  title: string;
  rating: number;
}

export interface QuickRepliesMessage extends MessageBase {
  kind: "quickReplies";
  options: string[];
  selected: string | null;
}

export interface TripCard {
  date: string;
  timeRange: string;
  vehicleId: string;
}

export interface TripCardsMessage extends MessageBase {
  kind: "tripCards";
  cards: TripCard[];
}

export type Message = TextMessage | ImageMessage | CsatMessage | QuickRepliesMessage | TripCardsMessage;

export interface ChatModel {
  layout: Layout;
  theme: Theme;
  statusBar: StatusBar;
  header: Header;
  composer: Composer;
  messages: Message[];
}
