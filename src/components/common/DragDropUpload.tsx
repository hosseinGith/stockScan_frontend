import { Image } from "lucide-react";
import { useState, useRef } from "react";

function DragDropUpload({ className }: { className?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
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
        style={{
          border: `2px dashed ${dragging ? "#007bff" : "#ccc"}`,
          borderRadius: 10,
          padding: 40,
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#f0f8ff" : "#fafafa",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full aspect-video h-full"
          />
        ) : (
          <Image className="w-full h-full max-h-30"/>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      {file && (
        <button onClick={() => console.log(file)} style={{ marginTop: 10 }}>
          آپلود {file.name}
        </button>
      )}
    </div>
  );
}

export default DragDropUpload;
