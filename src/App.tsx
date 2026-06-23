import { EditorProvider } from '@/contexts/EditorContext';
import WordEditor from '@/pages/WordEditor';

export default function App() {
  return (
    <EditorProvider>
      <WordEditor />
    </EditorProvider>
  );
}
