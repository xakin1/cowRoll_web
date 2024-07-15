import React from "react";
import PhotoCard from "./PhotoCard";
import PhotoCardAdd from "./PhotoCardAdd";
import "./styles.css";

interface PhotoElement {
  id: any;
  name: string;
  image?: string;
}
interface PhotoCardProps {
  elements: PhotoElement[];
  image?: string;
  handleClick: (...args: any[]) => void;
  handleOpen: () => void;
}

const PhotoCardList: React.FC<PhotoCardProps> = ({
  elements,
  image,
  handleClick,
  handleOpen,
}) => {
  return (
    <div className="photo-grid sibling-fade">
      {elements.map((element) => (
        <PhotoCard
          key={element.id}
          handleClick={() => handleClick(element.id)}
          name={element.name}
          image={element.image || image || "public/file.svg"}
        />
      ))}
      <PhotoCardAdd handleOpen={handleOpen}></PhotoCardAdd>
    </div>
  );
};

export default PhotoCardList;
