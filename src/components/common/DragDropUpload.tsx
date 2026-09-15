import { Image } from "lucide-react";
import { useState, useRef } from "react";

function DragDropUpload({
  className,
  uploadCallBack,
}: {
  className?: string;
  uploadCallBack?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (uploadCallBack) uploadCallBack();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="h-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 flex items-center justify-center"
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full aspect-video object-cover h-full "
          />
        ) : (
          <Image className="w-full h-full max-h-30" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}

export default DragDropUpload;
