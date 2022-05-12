import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
/* eslint-disable */

// 하나의 게시물의 디테일한 요소를 모두 띄어주는 요소들을 모두 다뤄야한다.
// 게시글의 제목, 유저이름, 생성 날짜, 게시글 내용 (사진 + 텍스트)
// + 좋아요 갯수와 댓글까지?! <-- 어떻게 구현할지 고민...

export interface IContentType {
  id: number;
  title: string;
  username: string;
  picture?: string | Blob; // 사진 자체를 multer을 사용해 보내야하는데 form data는 어떤 타입인가...?
  text: string;
  category: string;
  createdAt: string;
}

export interface ContentType {
  id: number;
  title: string;
  username: string;
  imgref?: string;
  content: string;
  param: string;
}

export const contentSlice = createSlice({
  name: 'contents',
  initialState: {
    contentId: 0,
  },
  reducers: {
    saveContentId: (state, action) => {
      // 게시물을 수정할 때 여기로 ContentDetail에 있는 게시글 내용을 올려줄거임.
      // 그리고 EditContent에서 여기에 저장된 상태값들을 가져간다.
      // state.contentId = action.payload.contentId;
      // console.log([action.payload]);
      console.log(state.contentId);

      // state.push(action.payload); // RTK uses immerJS, let you code like js.
      // console.log('액션객체 안엔 뭐가있을까!? ' + action.payload);
    },
  },
  extraReducers: {
    // [postContents.fulfilled.type]: (state, action) => {
    //   state.push(action.payload);
    //   console.log('서버에 컨텐츠 전송?');
    //   console.log(action.payload);
    // },
    // [postContents.rejected.type]: (state, action) => {
    //   console.log('sir, content uploading has been rejected');
    // },
  },
});

export const { saveContentId } = contentSlice.actions;

export default contentSlice.reducer;

// const selectAllContents = (state) => state.contents;
