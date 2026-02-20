import { useEffect, useRef } from "react";
import { QuickReplies } from "./QuickReplies";
import { RatingCard } from "./RatingCard";
import type { Message } from "../types/chat";

interface MessageListProps {
  messages: Message[];
  onRating: (id: string, rating: number) => void;
  onRatingSubmit: (id: string) => void;
  onQuickReply: (id: string, option: string) => void;
  onTripSelect: (id: string, cardIndex: number) => void;
}

function linkify(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/(https?:\/\/[^\s]+|whoosh\.bike\/[^\s]+)/g, '<a href="#">$1</a>')
    .replaceAll("\n", "<br>");
}

export function MessageList({ messages, onRating, onRatingSubmit, onQuickReply, onTripSelect }: MessageListProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <section className="messages" ref={containerRef}>
      {messages.map((message) => {
        const classes = `msg ${message.side} ${message.kind === "quickReplies" ? "quick-replies" : message.kind}${"size" in message && message.size ? ` ${message.size}` : ""}`;

        return (
          <article key={message.id} className={classes}>
            {message.kind === "text" || message.kind === "bot" ? (
              <>
                {message.label ? <div className="support-label">{message.label}</div> : null}
                <div className="bubble" dangerouslySetInnerHTML={{ __html: linkify(message.text) }} />
              </>
            ) : null}

            {message.kind === "image" ? (
              <div className="bubble image-bubble">
                <div className="media-wrap">
                  <img src={message.src} alt="Фото" />
                </div>
              </div>
            ) : null}

            {message.kind === "csat" ? (
              <>
                {message.label ? <div className="support-label">{message.label}</div> : null}
                <RatingCard
                  title={message.title}
                  rating={message.rating}
                  onSelect={(rating) => onRating(message.id, rating)}
                  onSubmit={() => onRatingSubmit(message.id)}
                />
              </>
            ) : null}

            {message.kind === "tripCards" ? (
              <div className="trip-carousel">
                {message.cards.map((card, i) => (
                  <button
                    key={i}
                    className="trip-card"
                    onClick={() => onTripSelect(message.id, i)}
                  >
                    <div className="trip-card-date">{card.date}</div>
                    <div className="trip-card-time">{card.timeRange}</div>
                    <div className="trip-card-vehicle">{card.vehicleId}</div>
                  </button>
                ))}
              </div>
            ) : null}

            {message.kind === "quickReplies" ? (
              <QuickReplies
                options={message.options}
                selected={message.selected}
                onSelect={(option) => onQuickReply(message.id, option)}
              />
            ) : null}

            {message.time ? <div className="time">{message.time}</div> : null}
          </article>
        );
      })}
    </section>
  );
}
