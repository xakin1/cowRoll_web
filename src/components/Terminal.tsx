import CodeEditor from './codeEditor/CodeEditor.jsx';

import { useAppSelector } from '../hooks/customHooks.js';



function Terminal() {
  const formatOutput = (text: string) => {
    if (typeof text == "string") {
      return text.replace(/\\n/g, '\n');
    }
  };
  const output = String(useAppSelector((state) => state.code.output))
  
  console.log(output)
	return (
        <main style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          width: "100%", 
          boxSizing: "border-box", 
          padding: "10px" 
        }} >
            <section>
              <CodeEditor></CodeEditor>
          </section>
          <textarea value={formatOutput(output)} readOnly />
        </main>	
	);
}

export default Terminal;