import { Comment } from "../../types/lp";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComment, deleteComment } from "../../apis/comment";
import { useAuth } from "../../context/AuthContext";
import fallbackImg from "../../assets/profile.jpg";

interface CommentItemProps {
  comment: Comment;
  lpId: number;
}

const CommentItem = ({ comment, lpId }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ 메뉴 토글 상태
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAuthor = user?.id === comment.author.id;

  const patchMutation = useMutation({
    mutationFn: patchComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
      setIsEditing(false);
      setIsMenuOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
      setIsMenuOpen(false);
    },
  });

  const handleEdit = () => {
    if (!editedContent.trim()) return;
    patchMutation.mutate({
      lpId,
      commentId: comment.id,
      content: editedContent,
    });
  };

  const handleDelete = () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      deleteMutation.mutate({
        lpId,
        commentId: comment.id,
      });
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 border-b border-gray-700 relative">
      <img
        src={comment.author.avatar || fallbackImg}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          target.src = fallbackImg;
        }}
      />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">{comment.author.name}</span>
          {isAuthor && (
            <div className="relative">
              {/* 점 3개 버튼 */}
              <button
                className="text-gray-400 text-xl px-2"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                ⋯
              </button>

              {/* 메뉴 토글 시에만 보이기 */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded shadow p-1 z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setIsMenuOpen(false);
                    }}
                    className="text-sm px-3 py-1 hover:bg-gray-700 w-[60px] text-left"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm px-3 py-1 hover:bg-gray-700 w-full text-left text-red-400"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <span className="text-xs text-gray-400 mb-1">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>

        {isEditing ? (
          <div className="flex gap-2">
            <input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-grow border border-gray-500 bg-gray-900 text-white p-1 rounded text-sm"
            />
            <button onClick={handleEdit} className="text-sm text-blue-400">
              저장
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
              className="text-sm text-gray-400"
            >
              취소
            </button>
          </div>
        ) : (
          <p className="text-sm">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
