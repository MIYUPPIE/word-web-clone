import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface InsertPictureDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (src: string) => void;
}

export default function InsertPictureDialog({
  open,
  onClose,
  onInsert,
}: InsertPictureDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = () => {
    if (preview) {
      onInsert(preview);
      setPreview(null);
    }
  };

  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-normal" style={{ color: '#323130' }}>
            Insert Picture
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!preview ? (
            <div
              className="border-2 border-dashed border-[#d5d5d5] rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#217346] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-12 h-12" style={{ color: '#a0a0a0' }} />
              <p className="text-sm" style={{ color: '#605e5c' }}>
                Click to select a picture from your device
              </p>
              <p className="text-xs" style={{ color: '#a0a0a0' }}>
                Supports: JPG, PNG, GIF, BMP
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="border border-[#d5d5d5] rounded-lg p-2 max-h-[300px] overflow-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[250px] object-contain"
                />
              </div>
              <p className="text-xs" style={{ color: '#605e5c' }}>
                Preview
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!preview}
            className="text-sm"
            style={{ backgroundColor: preview ? '#217346' : '#c5c5c5' }}
          >
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
