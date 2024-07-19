import React, {
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import "./ResizableRotatableComponent.css";

interface ResizableRotatableComponentProps {
  children: ReactNode;
  style?: CSSProperties; // Hacemos que style sea opcional
}

interface StyleState {
  width: number;
  height: number;
  top: number;
  left: number;
  rotate: number;
}

const ResizableRotatableComponent: React.FC<
  ResizableRotatableComponentProps
> = ({ children, style = {} }) => {
  const parseDimension = (
    value: string | number | undefined,
    defaultValue: number
  ): number => {
    if (typeof value === "number") {
      return value;
    } else if (typeof value === "string") {
      return parseFloat(value) || defaultValue;
    } else {
      return defaultValue;
    }
  };

  const [componentStyle, setComponentStyle] = useState<StyleState>({
    width: parseDimension(style.width, 200),
    height: parseDimension(style.height, 100),
    top: parseDimension(style.top, 100),
    left: parseDimension(style.left, 100),
    rotate: parseDimension(style.rotate, 0),
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    action: "resize" | "rotate" | "move"
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = componentStyle.width;
    const startHeight = componentStyle.height;
    const startRotate = componentStyle.rotate;
    const startTop = componentStyle.top;
    const startLeft = componentStyle.left;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (action === "resize") {
        setComponentStyle((prevStyle) => ({
          ...prevStyle,
          width: Math.max(50, startWidth + dx),
          height: Math.max(50, startHeight + dy),
        }));
      } else if (action === "rotate") {
        const angle = startRotate + (dx * 180) / 200;
        setComponentStyle((prevStyle) => ({
          ...prevStyle,
          rotate: angle,
        }));
      } else if (action === "move") {
        setComponentStyle((prevStyle) => ({
          ...prevStyle,
          top: startTop + dy,
          left: startLeft + dx,
        }));
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className="resizable-rotatable-container"
      style={{
        width: `${componentStyle.width}px`,
        height: `${componentStyle.height}px`,
        top: `${componentStyle.top}px`,
        left: `${componentStyle.left}px`,
        transform: `rotate(${componentStyle.rotate}deg)`,
        transformOrigin: "center center",
        position: "absolute", // Asegurar que esté posicionado absolutamente
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleMouseDown(e, "move");
      }}
    >
      {children}
      <div
        className="resizable-rotatable-control top-left"
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e, "resize");
        }}
      ></div>
      <div
        className="resizable-rotatable-control top-right"
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e, "resize");
        }}
      ></div>
      <div
        className="resizable-rotatable-control bottom-left"
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e, "resize");
        }}
      ></div>
      <div
        className="resizable-rotatable-control bottom-right"
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e, "resize");
        }}
      ></div>
      <div
        className="resizable-rotatable-control rotate"
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e, "rotate");
        }}
      ></div>
    </div>
  );
};

export default ResizableRotatableComponent;
