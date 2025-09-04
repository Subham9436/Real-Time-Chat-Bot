import { Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useChatStore } from "../store/msgstore";

export function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>("");
  const { sendMessage } = useChatStore();
  const InputFileRef = useRef<HTMLInputElement | null>(null);

  const removeImage = () => {
    setImagePreview(null);
    if (InputFileRef.current) {
      InputFileRef.current.value = "";
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result == "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!text.trim() && !imagePreview) {
        return;
      }
      sendMessage({
        text: text.trim() || null, // send null if empty
        image: imagePreview || null, // send null if no image
      });
      setText("");
      setImagePreview(null);
      if (InputFileRef.current) InputFileRef.current.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  return (
    <div className="relative">
      {imagePreview && (
        <div className="absolute -top-20  flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
              onClick={removeImage}
              style={{ cursor: "pointer" }}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form className=" w-96 sm:w-164 md:w-216 flex" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Message"
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 w-96 sm:w-164 md:w-216"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={InputFileRef}
          onChange={handleImageChange}
        ></input>

        <button
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
          style={{ cursor: "pointer" }}
          onClick={() => InputFileRef.current?.click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <button
          className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
          style={{ cursor: "pointer" }}
          type="submit"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
