import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import type { ChatModel, Message } from "../types/chat";
import { cloneMessages } from "../data/chatPrototype";

interface ChatScreenProps {
  model: ChatModel;
}

function findLastMessageTime(messages: Message[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.time) return messages[index].time;
  }

  return "18:35";
}

export function ChatScreen({ model }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(() => cloneMessages(model.messages));
  const [inputEnabled, setInputEnabled] = useState(false);
  const [addressAttempts, setAddressAttempts] = useState(0);

  const cssVars = useMemo(
    () =>
      ({
        "--content-scale": String(model.layout.contentScale),
        "--page-bg": model.theme.pageBg,
        "--screen-bg": model.theme.screenBg,
        "--header-bg": model.theme.headerBg,
        "--bubble-in": model.theme.bubbleIn,
        "--text-in": model.theme.textIn,
        "--link": model.theme.link,
        "--muted": model.theme.muted,
        "--composer-bg": model.theme.composerBg,
        "--composer-field": model.theme.composerField,
        "--composer-line": model.theme.composerLine,
        "--icon": model.theme.icon,
        "--send-bg": model.theme.sendBg,
      }) as CSSProperties,
    [model],
  );

  const handleRating = (id: string, rating: number) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id && message.kind === "csat" ? { ...message, rating } : message,
      ),
    );
  };

  const handleRatingSubmit = (id: string) => {
    setMessages((current) =>
      current.map((message): Message =>
        message.id === id && message.kind === "csat"
          ? {
              id: message.id,
              kind: "bot",
              side: "in",
              label: message.label,
              text: "Спасибо за оценку",
              time: message.time,
            }
          : message,
      ),
    );
  };

  const greetingMessage: Message = {
    id: "bot-1",
    kind: "bot",
    side: "in",
    label: "Поддержка Whoosh",
    text: "Привет! Мы всегда рады помочь.\nО чем хотите спросить? 👇",
    time: "18:35",
  };

  const mainMenuReplies: Message = {
    id: "quick-1",
    kind: "quickReplies",
    side: "out",
    options: [
      "Не могу завершить поездку",
      "Вушбайк не едет",
      "Списали больше",
      "Не вернулся депозит",
      "Пакет минут",
      "Проишествие",
      "Другое",
    ],
    selected: null,
  };

  const handleQuickReply = (id: string, option: string) => {
    if (option === "≡ Главное меню") {
      setMessages((current) => {
        const filtered = current.filter((m) => m.id !== id);
        return [...filtered, { ...greetingMessage, id: `bot-${Date.now()}` }, { ...mainMenuReplies, id: `qr-${Date.now()}`, selected: null }];
      });
      setAddressAttempts(0);
      return;
    }

    if (option === "Спасибо, все понятно") {
      setMessages((current) => {
        const time = findLastMessageTime(current);
        const filtered = current.filter((m) => m.id !== id);
        const csatMsg: Message = {
          id: `csat-${Date.now()}`,
          kind: "csat",
          side: "in",
          label: "Поддержка Whoosh",
          title: "Пожалуйста, оцените работу\nподдержки",
          time,
          rating: 0,
        };
        return [
          ...filtered,
          csatMsg,
          { ...greetingMessage, id: `bot-${Date.now()}` },
          { ...mainMenuReplies, id: `qr-${Date.now()}`, selected: null },
        ];
      });
      setAddressAttempts(0);
      return;
    }

    if (option === "Проблема не решена") {
      setMessages((current) => {
        const filtered = current.filter((m) => m.id !== id);
        return filtered;
      });

      setTimeout(() => {
        setMessages((current) => {
          const time = findLastMessageTime(current);
          const botMsg: Message = {
            id: `bot-${Date.now()}`,
            kind: "bot",
            side: "in",
            label: "Поддержка Whoosh",
            text: "Позвали ребят из поддержки, они помогут",
            time,
          };
          return [...current, botMsg];
        });
        setInputEnabled(true);
      }, 800);

      return;
    }

    if (option === "У меня нет фото") {
      setMessages((current) => {
        const time = findLastMessageTime(current);
        const userMsg: Message = {
          id: `user-${Date.now()}`,
          kind: "text",
          side: "out",
          text: option,
          time,
        };
        const filtered = current.filter((m) => m.id !== id);
        return [...filtered, userMsg];
      });

      setTimeout(() => {
        setMessages((current) => {
          const time = findLastMessageTime(current);
          const botMsg: Message = {
            id: `bot-${Date.now()}`,
            kind: "bot",
            side: "in",
            label: "Поддержка Whoosh",
            text: "Готово, завершили поездку!\n\nЕсли снова не выйдет закончить аренду самостоятельно, пожалуйста, не забудьте все равно сделать фото вушбайка на парковке — можем попросить отправить его в чат",
            time,
          };
          const replies: Message = {
            id: `qr-${Date.now()}`,
            kind: "quickReplies",
            side: "in",
            options: ["Спасибо, все понятно", "Проблема не решена", "≡ Главное меню"],
            selected: null,
          };
          return [...current, botMsg, replies];
        });
      }, 800);

      return;
    }

    if (option === "Списали больше") {
      setMessages((current) => {
        const time = findLastMessageTime(current);
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          kind: "text",
          side: "out",
          text: option,
          time,
        };

        const next = current.filter(
          (m) =>
            m.id !== id &&
            !(m.kind === "bot" && m.text === greetingMessage.text),
        );
        return [...next, userMessage];
      });

      setTimeout(() => {
        setMessages((current) => {
          const time = findLastMessageTime(current);
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            kind: "bot",
            side: "in",
            label: "Поддержка Whoosh",
            text: "В какой поездке заметили несоответствие?",
            time,
          };
          const tripCards: Message = {
            id: `trips-${Date.now()}`,
            kind: "tripCards",
            side: "in",
            cards: [
              { date: "Поездка 23 августа", timeRange: "11:01-11:02", vehicleId: "ASB-456" },
              { date: "Поездка 23 января", timeRange: "11:01-11:02", vehicleId: "ASB-456" },
              { date: "Поездка 15 января", timeRange: "09:30-09:45", vehicleId: "WHS-112" },
              { date: "Поездка 10 января", timeRange: "18:20-18:35", vehicleId: "WHS-089" },
              { date: "Поездка 3 января", timeRange: "14:00-14:22", vehicleId: "ASB-201" },
            ],
          };
          return [...current, botMessage, tripCards];
        });
      }, 800);

      return;
    }

    if (option === "Не могу завершить поездку") {
      setMessages((current) => {
        const quickReplyIndex = current.findIndex((message) => message.id === id);
        if (quickReplyIndex < 0) return current;

        const time = findLastMessageTime(current);
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          kind: "text",
          side: "out",
          text: option,
          time,
        };

        const next = current.filter(
          (m) =>
            m.id !== id &&
            !(m.kind === "bot" && m.text === greetingMessage.text),
        );
        return [...next, userMessage];
      });

      setTimeout(() => {
        setMessages((current) => {
          const time = findLastMessageTime(current);
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            kind: "bot",
            side: "in",
            label: "Поддержка Whoosh",
            text: "Напишите, пожалуйста, полный адрес места, где оставили вушбайк, в формате «улица, дом».\n\nУточним, что оставлять самокаты можно только на парковках — их на карте отмечаем знаком Р. За неправильную парковку можем выписать штраф от 500 до 1000₽.",
            time,
          };
          const menuReplies: Message = {
            id: `qr-${Date.now()}`,
            kind: "quickReplies",
            side: "in",
            options: ["≡ Главное меню"],
            selected: null,
          };
          return [...current, botMessage, menuReplies];
        });
        setInputEnabled(true);
      }, 800);

      return;
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === id && message.kind === "quickReplies"
          ? { ...message, selected: option }
          : message,
      ),
    );
  };

  const handleTripSelect = (id: string, cardIndex: number) => {
    setMessages((current) => {
      const tripMsg = current.find((m) => m.id === id);
      if (!tripMsg || tripMsg.kind !== "tripCards") return current;
      const card = tripMsg.cards[cardIndex];
      const time = findLastMessageTime(current);
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        kind: "text",
        side: "out",
        text: `${card.date}. С ${card.timeRange}.\nСамокат ${card.vehicleId}`,
        time,
      };
      const filtered = current.filter((m) => m.id !== id);
      return [...filtered, userMessage];
    });

    setTimeout(() => {
      setMessages((current) => {
        const time = findLastMessageTime(current);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          kind: "bot",
          side: "in",
          label: "Поддержка Whoosh",
          text: "Проверим и вернемся с ответом. Обычно это занимает пару минут",
          time,
        };
        const replies: Message = {
          id: `qr-${Date.now()}`,
          kind: "quickReplies",
          side: "in",
          options: ["Спасибо, все понятно", "Проблема не решена", "≡ Главное меню"],
          selected: null,
        };
        return [...current, botMsg, replies];
      });
    }, 800);
  };

  const handleSend = (text: string) => {
    const time = findLastMessageTime(messages);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      kind: "text",
      side: "out",
      text,
      time,
    };

    setMessages((current) => {
      const filtered = current.filter((m) => m.kind !== "quickReplies");
      return [...filtered, userMessage];
    });
    setInputEnabled(false);

    const hasAddress = text.toLowerCase().includes("ул");
    const currentAttempt = addressAttempts + (hasAddress ? 0 : 1);

    if (!hasAddress) {
      setAddressAttempts(currentAttempt);
    }

    setTimeout(() => {
      setMessages((current) => {
        const t = findLastMessageTime(current);
        const newMessages: Message[] = [...current];

        if (hasAddress || currentAttempt >= 2) {
          if (!hasAddress) {
            newMessages.push({
              id: `bot-${Date.now()}-fail`,
              kind: "bot",
              side: "in",
              label: "Поддержка Whoosh",
              text: "Адрес распознать так и не удалось —  в следующий раз, пожалуйста, указывайте верный",
              time: t,
            });
          }

          newMessages.push({
            id: `bot-${Date.now()}`,
            kind: "bot",
            side: "in",
            label: "Поддержка Whoosh",
            text: "Теперь нужно отправить фото припаркованного самоката",
            time: t,
          });
          newMessages.push({
            id: `qr-${Date.now()}`,
            kind: "quickReplies",
            side: "in",
            options: ["У меня нет фото", "≡ Главное меню"],
            selected: null,
          });
          return newMessages;
        }

        newMessages.push({
          id: `bot-${Date.now()}`,
          kind: "bot",
          side: "in",
          label: "Поддержка Whoosh",
          text: "Не распознали адрес. Попробуйте еще раз, пожалуйста, с указанием улицы, дома или ближайшего ориентира",
          time: t,
        });
        newMessages.push({
          id: `qr-${Date.now()}`,
          kind: "quickReplies",
          side: "in",
          options: ["≡ Главное меню"],
          selected: null,
        });
        return newMessages;
      });
      if (!hasAddress && currentAttempt < 2) {
        setInputEnabled(true);
      }
    }, 800);
  };

  return (
    <main className="app" style={cssVars}>
      <section className="phone">
        <section className="status">
          <div className="status-time">{model.statusBar.time}</div>
          <div className="status-right">
            <div className="signal">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="wifi" />
            <div className="battery" />
          </div>
        </section>

        <header className="header">
          <svg className="back" width="18" height="15" viewBox="0 0 18 15" fill="none" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.67828 0.265202C8.0841 0.639805 8.10941 1.27246 7.7348 1.67829L3.28398 6.5H17C17.5523 6.5 18 6.94772 18 7.5C18 8.05229 17.5523 8.5 17 8.5H3.28398L7.7348 13.3217C8.10941 13.7275 8.0841 14.3602 7.67828 14.7348C7.27246 15.1094 6.6398 15.0841 6.2652 14.6783L0.265197 8.17828C-0.0883988 7.79522 -0.0883988 7.20479 0.265197 6.82172L6.2652 0.321725C6.6398 -0.0840959 7.27246 -0.109402 7.67828 0.265202Z" fill="#393939"/>
          </svg>
          <div className="title">{model.header.title}</div>
        </header>

        <MessageList messages={messages} onRating={handleRating} onRatingSubmit={handleRatingSubmit} onQuickReply={handleQuickReply} onTripSelect={handleTripSelect} />

        <Composer composer={model.composer} theme={model.theme} inputEnabled={inputEnabled} onSend={handleSend} />
      </section>
    </main>
  );
}
