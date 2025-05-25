interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg text-center text-white w-[300px]">
        <p className="mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
