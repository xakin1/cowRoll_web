import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getI18N } from "../i18n";
import { getLang } from "../i18n/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (inputValue: string) => void;
  initialText?: string;
  label: string;
  showInput?: boolean;
}

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  initialText,
  label,
  showInput = true,
}) => {
  const [inputValue, setInputValue] = useState<string>(initialText || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoverAccept, setHoverAccept] = useState(false); // Estado para manejar hover en el botón Aceptar
  const [hoverCancel, setHoverCancel] = useState(false); // Estado para manejar hover en el botón Cancelar

  if (!isOpen) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onAccept(inputValue); // Ejecuta la acción de aceptar cuando se presiona Enter
    }
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <label>
          {label}
          {showInput && (
            <input
              type="text"
              ref={inputRef}
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
              style={styles.input}
            />
          )}
        </label>
        <div style={styles.buttons}>
          <button
            onMouseEnter={() => setHoverCancel(true)}
            onMouseLeave={() => setHoverCancel(false)}
            onClick={onClose}
            style={
              hoverCancel
                ? { ...styles.button, ...styles.hover }
                : styles.button
            }
          >
            {i18n.General.cancel}
          </button>
          <button
            onMouseEnter={() => setHoverAccept(true)}
            onMouseLeave={() => setHoverAccept(false)}
            onClick={() => onAccept(inputValue)}
            style={
              hoverAccept
                ? { ...styles.button, ...styles.hover }
                : styles.button
            }
          >
            {i18n.General.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  label: {},
  modal: {
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
    padding: 20,
    borderRadius: 5,
    minWidth: 300,
    maxWidth: 500,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, color 0.3s",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: 10,
    marginTop: "1rem",
    border: "2px solid var(--text-color)",
    borderRadius: 4,
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
    transition: "border-color 0.3s, background-color 0.3s, color 0.3s",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
    border: "1px solid var(--text-color)",
    borderRadius: 4,
    transition: "background-color 0.3s, color 0.3s",
  },
  hover: {
    backgroundColor: "var(--text-color)", // Hover style
    color: "var(--background-color)",
  },
};

export default Modal;
