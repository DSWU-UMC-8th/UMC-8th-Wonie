import { createSlice } from "@reduxjs/toolkit";

// 🧩 상태 타입 정의
interface ModalState {
  isOpen: boolean;
}

// 🧩 초기 상태
const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // 모달 열기
    openModal: (state) => {
      state.isOpen = true;
    },

    // 모달 닫기
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
