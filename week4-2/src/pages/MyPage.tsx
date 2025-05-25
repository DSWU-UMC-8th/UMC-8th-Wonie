import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useGetInfo from "../hooks/mutation/useGetinfo";
import useUpdateMyInfo from "../hooks/mutation/useUpdateMyInfo";
import { uploadImage } from "../apis/lp";
import { FiSettings } from "react-icons/fi";
import fallbackImg from "../assets/profile.jpg";

const MyPage = () => {
  const navigate = useNavigate();

  const { logout, setUser } = useAuth();

  const { data, isLoading } = useGetInfo();
  const { mutate: updateMyInfo } = useUpdateMyInfo();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (data) {
      const user = data.data;
      setName(user.name);
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
      setImagePreview(user.avatar || null);
      setUploadedImageUrl(user.avatar || "");
    }
  }, [data]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const url = await uploadImage(file);
        setUploadedImageUrl(url);
      } catch (err) {
        console.error("이미지 업로드 실패", err);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("닉네임은 빈칸일 수 없습니다.");
      return;
    }

    updateMyInfo(
      {
        name,
        bio,
        avatar: uploadedImageUrl,
      },
      {
        onSuccess: () => {
          setAvatar(uploadedImageUrl);
          setEditMode(false);

          // ✅ 닉네임 및 bio/아바타 전역 상태로 업데이트
          setUser((prevUser: any) => ({
            ...prevUser,
            name,
            bio,
            avatar: uploadedImageUrl,
          }));

          // ✅ localStorage도 동기화
          const updatedUser = {
            ...data?.data,
            name,
            bio,
            avatar: uploadedImageUrl,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        },
      }
    );
  };

  if (isLoading)
    return <div className="text-center mt-10 text-white">불러오는 중...</div>;

  return (
    <div className="w-full px-4 py-12 max-w-4xl mx-auto">
      <div className="bg-zinc-900 rounded-xl shadow-lg p-8 text-center">
        <img
          src={imagePreview || avatar || fallbackImg}
          alt="프로필 이미지"
          onClick={editMode ? handleImageClick : undefined}
          className="w-28 h-28 rounded-full object-cover mx-auto cursor-pointer border"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = fallbackImg;
          }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {editMode ? (
          <div className="flex flex-col gap-3 mt-6 text-left">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개"
              rows={3}
              className="w-full p-2 rounded bg-zinc-800 text-white border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                저장
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="border border-gray-500 text-white px-4 py-2 rounded hover:bg-zinc-800 transition"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold">{name}</h2>
            <p className="text-gray-300 mt-1">{bio || "자기소개 없음"}</p>

            <p className="text-gray-500 text-sm mt-1">{data?.data?.email}</p>

            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => setEditMode(true)}
                className="text-white hover:text-pink-400 transition"
                aria-label="설정"
              >
                <FiSettings size={24} />
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:underline mt-1"
              >
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;
