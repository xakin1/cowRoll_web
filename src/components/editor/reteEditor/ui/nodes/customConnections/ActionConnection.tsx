import { Presets, type ClassicScheme } from "rete-react-plugin";
import { css } from "styled-components";

const { Connection } = Presets.classic;

const styles = css`
  stroke: #00000045;
  stroke-dasharray: 10 5;
  animation: dash 1s linear infinite;
  stroke-dashoffset: 45;
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
`;

export function ActionConnectionComponent(props: {
  data: ClassicScheme["Connection"] & { isLoop?: boolean };
}) {
  return <Connection {...props} styles={() => styles} />;
}
