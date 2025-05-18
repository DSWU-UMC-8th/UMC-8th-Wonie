import { useRef, useState } from "react";
import { postLp, uploadImage } from "../apis/lp";
import { useMutation } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";

interface LPModalProps {
  onClose: () => void;
}

export default function LPModal({ onClose }: LPModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<string>("/lp.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      alert("LP가 성공적으로 등록되었습니다.");
      onClose();
    },
  });

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    let imageUrl = "/lp.png";
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
    }

    mutate({
      title,
      content,
      tags,
      thumbnail: imageUrl,
      published: true,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 text-white w-[400px] p-6 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          <IoClose size={24} />
        </button>

        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={image}
            alt="LP 썸네일"
            className="w-28 h-28 rounded-full object-cover"
          />
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <input
          type="text"
          placeholder="LP Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded bg-zinc-800 text-white"
        />
        <input
          type="text"
          placeholder="LP Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded bg-zinc-800 text-white"
        />
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="LP Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-grow px-3 py-2 rounded bg-zinc-800 text-white"
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-2 bg-gray-500 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-zinc-700 rounded-full px-3 py-1 text-sm"
            >
              {tag}{" "}
              <button
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-pink-500 hover:bg-pink-600 rounded"
        >
          Add LP
        </button>
      </div>
    </div>
  );
}
