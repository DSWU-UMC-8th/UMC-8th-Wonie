import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import usePostLike from "../hooks/mutation/usePostLike";
import useDeleteLike from "../hooks/mutation/useDeleteLike";
import useDeleteLp from "../hooks/mutation/useDeleteLp";
import useUpdateLp from "../hooks/mutation/useUpdateLp";
import CommentList from "../components/Comment/CommentList";
import fallbackImg from "../assets/profile.jpg";
import { useState } from "react";

const LpDetailPage = () => {
  const { id } = useParams();
  const lpId = Number(id);

  const { data: lpData } = useGetLpDetail(lpId);
  const { data: userInfo } = useQuery<ResponseMyInfoDto>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  /*const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();*/
  const { mutate: deleteLp } = useDeleteLp();
  const { mutate: updateLp } = useUpdateLp();
  const { mutate: likeMutate } = usePostLike(lpId, userInfo?.data.id);
  const { mutate: dislikeMutate } = useDeleteLike(lpId, userInfo?.data.id);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editThumbnail, setEditThumbnail] = useState("");

  const [editTagInput, setEditTagInput] = useState("");
  const handleAddTag = () => {
    const trimmed = editTagInput.trim();
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed]);
    }
    setEditTagInput("");
  };

  if (!lpData) {
    return (
      <div className="text-white text-center mt-10">
        해당 LP를 찾을 수 없습니다. (id: {lpId})
      </div>
    );
  }

  const lp = lpData.data;
  const isAuthor = lp.author.id === userInfo?.data.id;
  const isLiked = lp.likes.some((like) => like.userId === userInfo?.data.id);

  const handleLikeToggle = () => {
    isLiked ? dislikeMutate({ lpId }) : likeMutate({ lpId });
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteLp(lpId);
    }
  };

  const handleEditClick = () => {
    setEditTitle(lp.title);
    setEditContent(lp.content);
    setEditTags(lp.tags.map((tag) => tag.name));
    setEditThumbnail(lp.thumbnail ?? "");
    setIsEditMode(true);
  };
  const handleUpdateSubmit = () => {
    updateLp(
      {
        lpId,
        title: editTitle,
        content: editContent,
        tags: editTags,
        thumbnail: editThumbnail,
      },
      {
        onSuccess: () => {
          setIsEditMode(false); // 수정 성공 시 수정 모드 종료
        },
      }
    );
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-zinc-900 text-white rounded-xl p-13 shadow-md space-y-4 mt-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img
              src={userInfo?.data.avatar || fallbackImg}
              alt="프로필 이미지"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = fallbackImg;
              }}
            />
            <span className="font-medium">{userInfo?.data.name}</span>
          </div>
          <span>{new Date(lp.createdAt).toISOString().slice(0, 10)}</span>
        </div>

        <div className="flex justify-between mt-8">
          {isEditMode ? (
            <input
              className="text-xl font-semibold bg-zinc-800 rounded p-2 w-full"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          ) : (
            <h1 className="text-xl font-semibold">{lp.title}</h1>
          )}
          {isAuthor && !isEditMode && (
            <div className="text-xl text-white flex gap-3 items-end">
              <button className="hover:text-blue-600" onClick={handleEditClick}>
                <GoPencil />
              </button>
              <button className="hover:text-blue-600" onClick={handleDelete}>
                <RiDeleteBin6Line />
              </button>
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mt-10">
          <div className="w-80 h-80 shadow-xl/60 rounded-lg flex items-center justify-center">
            <div
              className="animate-spin relative w-72 h-72 rounded-full border-[6px] border-zinc-700"
              style={{ animationDuration: "13s" }}
            >
              <img
                src={lp.thumbnail ?? "/lp.png"}
                alt="lp cover"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10 border border-gray-800" />
            </div>
          </div>
        </div>

        <div className="mt-10">
          {isEditMode ? (
            <textarea
              className="w-full p-2 text-sm bg-zinc-800 rounded text-gray-100"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <p className="text-sm text-gray-200 text-center leading-relaxed">
              {lp.content}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {isEditMode ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {editTags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-zinc-700 rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      onClick={() =>
                        setEditTags(editTags.filter((t) => t !== tag))
                      }
                      className="ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="bg-zinc-800 text-white px-2 py-1 rounded w-full"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="태그를 입력하고 Enter"
                />
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={handleAddTag}
                >
                  추가
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {lp.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {isEditMode && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-gray-500 px-4 py-2 rounded"
              onClick={() => setIsEditMode(false)}
            >
              취소
            </button>
            <button
              className="bg-blue-500 px-4 py-2 rounded"
              onClick={handleUpdateSubmit}
            >
              수정 완료
            </button>
          </div>
        )}

        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            className="text-pink-500 text-xl hover:scale-110 transition"
            onClick={handleLikeToggle}
          >
            <FcLike />
          </button>
          <span className="text-sm">{lp.likes.length}</span>
        </div>
      </div>

      <div className="mt-20">
        <CommentList lpId={lpId} />
      </div>
    </div>
  );
};

export default LpDetailPage;
