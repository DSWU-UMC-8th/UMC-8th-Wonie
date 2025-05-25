import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/comment";

interface CommentFormProps {
  lpId: number;
}

const CommentForm = ({ lpId }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    mutate({ lpId, content });
  };

  return (
    <div className="flex gap-2 border-gray-700">
      <input
        type="text"
        placeholder="댓글을 입력해주세요"
        className="flex-grow border border-gray-400 text-white p-2 rounded focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={isPending}
      >
        작성
      </button>
    </div>
  );
};

export default CommentForm;
