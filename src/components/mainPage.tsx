import React, { useEffect, useState } from "react";
import { createFile, getFiles } from "../services/codeApi";
import type { CreateRolProps, RolProps } from "../utils/types/ApiTypes";
import PhotoCard from "./photoCard/PhotoCard";

type MainPageProps = {
  onAddClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
const generateRandomName = () => {
  const firstNames = ["John", "Jane", "Alex", "Emily", "Chris"];
  const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown"];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

const generateRandomText = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomImage = (width: number, height: number) =>
  `https://picsum.photos/${width}/${height}?random=${Math.random()}`;

const onAddClick = async (
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
): Promise<void> => {
  const file: CreateRolProps = {
    type: "Rol",
    name: generateRandomName(),
    description: generateRandomText(20),
    image: generateRandomImage(200, 250),
  };
  await createFile(file);
};

export function MainPage() {
  const [roles, setRoles] = useState<RolProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      const response = await getFiles();
      if (response) {
        setRoles(response.message.children as RolProps[]);
      }
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="photo-grid sibling-fade">
        {roles.map((photo) => (
          <PhotoCard
            key={photo.id}
            id={photo.id}
            name={photo.name}
            image={photo.image}
          />
        ))}
        <div className="add-card" onClick={onAddClick}>
          <div className="add-icon">+</div>
          <div className="add-text">Añadir</div>
        </div>
      </div>
      <button className="trash-button">Papelera</button>
    </>
  );
}
