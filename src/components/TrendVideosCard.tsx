import CreatorVideosGrid from "./CreatorVideosGrid";

interface TrendVideosCardProps {
  selectedTrendId: string;
  selectedButton: string;
}

const TrendVideosCard = ({ selectedTrendId, selectedButton }: TrendVideosCardProps) => {
  return (
    <div className="rounded-2xl p-8 h-full">
      <CreatorVideosGrid selectedTrendId={selectedTrendId} />
    </div>
  );
};

export default TrendVideosCard;