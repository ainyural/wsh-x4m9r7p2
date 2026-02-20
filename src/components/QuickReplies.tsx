interface QuickRepliesProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}

export function QuickReplies({ options, selected, onSelect }: QuickRepliesProps) {
  return (
    <div className="quick-grid">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={`chip${selected === option ? " selected" : ""}`}
          data-i={String(index)}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
