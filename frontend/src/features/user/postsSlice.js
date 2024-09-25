import { createSlice } from "@reduxjs/toolkit";
const initialState = { posts: [] };
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    deletePost: (state, action) => {
      state.posts.filter((post) => post.id !== action.payload);
    },
  },
});
export const { setPosts, addPost } = postsSlice.actions;
export default postsSlice.reducer;
