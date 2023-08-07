import "./text-editor.css";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Cell } from "../state";
import { useActions } from "../hooks/use-actions";
import CustomTableRenderer from "./custom-table-renderer";
import CustomParagraphRenderer from "./custom-paragraph-renderer";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);

  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className='text-editor' ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || "")}
        />
      </div>
    );
  }

  // Define the default content
  const defaultContent = `## Welcome to the RTLSheet

This is an interactive coding environment where you can explore the following libraries:

| Name                        | Docs                                 |
| --------------------------- | ------------------------------------ |
| React                       | [docs](https://reactjs.org/docs)     |
| @testing-library/react      | [docs](https://testing-library.com/) |
| @testing-library/user-event | [docs](https://testing-library.com/) |
| @testing-library/react-hooks| [docs](https://testing-library.com/) |
| @testing-library/jest-dom   | [docs](https://testing-library.com/) |
| expect                      | [docs](https://jestjs.io/docs/expect) |

In between each 'cell' there are buttons that can add in a new code editor or a text section.`;

  return (
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown
          source={cell.content || defaultContent}
          renderers={{
            table: CustomTableRenderer,
            paragraph: CustomParagraphRenderer,
          }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
