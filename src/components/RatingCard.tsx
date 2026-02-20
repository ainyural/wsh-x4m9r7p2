const STAR_PATH =
  "M12.2467 0.959378C12.8056 -0.319906 14.6202 -0.319903 15.1791 0.959381L17.8357 7.04027C18.0984 7.64169 18.6677 8.05244 19.3212 8.11219L25.9696 8.72003C27.3743 8.84844 27.9376 10.5996 26.8714 11.5229L21.8903 15.8364C21.3872 16.272 21.1656 16.9496 21.3139 17.5983L22.7769 23.9972C23.0893 25.3635 21.6186 26.4427 20.409 25.7346L14.6222 22.3475C14.0605 22.0188 13.3652 22.0188 12.8036 22.3475L7.01683 25.7347C5.8072 26.4427 4.33644 25.3635 4.64884 23.9972L6.11189 17.5983C6.26021 16.9496 6.03854 16.272 5.5355 15.8364L0.554408 11.5229C-0.511848 10.5996 0.051513 8.84844 1.45614 8.72003L8.10455 8.11219C8.75813 8.05244 9.32739 7.64169 9.59013 7.04027L12.2467 0.959378Z";

interface RatingCardProps {
  title: string;
  rating: number;
  onSelect: (value: number) => void;
  onSubmit?: () => void;
}

export function RatingCard({ title, rating, onSelect, onSubmit }: RatingCardProps) {
  return (
    <div className="csat-card">
      <h3 className="csat-title" dangerouslySetInnerHTML={{ __html: title.replaceAll("\n", "<br>") }} />
      <div className="stars">
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const active = value <= rating;

          return (
            <button
              key={value}
              type="button"
              className={`star-btn${active ? " active" : ""}`}
              aria-label={`Оценка ${value}`}
              onClick={() => onSelect(value)}
            >
              <svg viewBox="0 0 28 26" aria-hidden="true" className="star-icon">
                <path d={STAR_PATH} fill={active ? "#FF6B45" : "#D5D5D8"} />
              </svg>
            </button>
          );
        })}
      </div>
      {rating > 0 ? (
        <button type="button" className="csat-submit" onClick={onSubmit}>
          Отправить
        </button>
      ) : null}
    </div>
  );
}
