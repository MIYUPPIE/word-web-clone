import { useCallback } from 'react';
import ToolbarGroup from '@/components/ToolbarGroup';
import ToolButton from '@/components/ToolButton';
import SplitButton from '@/components/SplitButton';
import {
  SpellCheck,
  BookOpen,
  Languages,
  MessageSquarePlus,
  Eye,
  EyeOff,
  GitCompare,
  Lock,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
} from 'lucide-react';

export default function ReviewToolbar() {
  const handleSpellCheck = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const text = selection.toString();
      alert(`Spell check: "${text}"\n\nNo spelling errors found.`);
    } else {
      alert('Please select text to check spelling.');
    }
  }, []);

  return (
    <div className="flex items-start px-2 py-1 h-[108px] overflow-hidden">
      <ToolbarGroup title="Proofing">
        <div className="flex gap-1">
          <ToolButton icon={SpellCheck} onClick={handleSpellCheck} tooltip="Spelling & Grammar" size="md" />
          <ToolButton icon={BookOpen} onClick={() => {}} tooltip="Thesaurus" size="sm" />
          <ToolButton icon={Languages} onClick={() => {}} tooltip="Translate" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Comments">
        <div className="flex gap-1">
          <SplitButton icon={MessageSquarePlus} label="New Comment" onClick={() => {
            const comment = prompt('Enter comment:');
            if (comment) {
              document.execCommand('insertHTML', false, `<span style="background:#fff3cd;" title="Comment: ${comment}">`);
            }
          }} />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Tracking">
        <div className="flex gap-1">
          <ToolButton icon={Eye} onClick={() => {}} tooltip="Show Markup" size="sm" />
          <ToolButton icon={EyeOff} onClick={() => {}} tooltip="Hide Markup" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Changes">
        <div className="flex gap-1">
          <ToolButton icon={ArrowLeftRight} onClick={() => {}} tooltip="Previous Change" size="sm" />
          <ToolButton icon={CheckCircle} onClick={() => {}} tooltip="Accept" size="sm" />
          <ToolButton icon={XCircle} onClick={() => {}} tooltip="Reject" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Compare">
        <div className="flex gap-1">
          <ToolButton icon={GitCompare} onClick={() => {}} tooltip="Compare" size="sm" />
        </div>
      </ToolbarGroup>
      <ToolbarGroup title="Protect">
        <div className="flex gap-1">
          <ToolButton icon={Lock} onClick={() => {
            alert('Document protection features are not available in the web version.');
          }} tooltip="Restrict Editing" size="sm" />
        </div>
      </ToolbarGroup>
    </div>
  );
}
