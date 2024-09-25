import { createSlice } from "@reduxjs/toolkit";
const initialState = { user: null };
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    updateStories: (state, action) => {
      state.user.stories = action.payload;
    },
    addStory: (state, action) => {
      state.user.stories.push(action.payload);
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    followUnfollowUser: (state, action) => {
      const isFollowing = state.user.following.includes(action.payload);
      if (isFollowing) {
        state.user.following = state.user.following.filter(
          (user) => user !== action.payload
        );
      } else {
        state.user.following.push(action.payload);
      }
    },
    saveUnsavePost: (state, action) => {
      const isSaved = state.user.saved.includes(action.payload);
      if (isSaved) {
        state.user.saved = state.user.saved.filter(
          (id) => id !== action.payload
        );
      } else {
        state.user.saved.push(action.payload);
      }
    },
  },
});
export const {
  login,
  followUnfollowUser,
  updateUser,
  addStory,
  updateStories,
  saveUnsavePost,
} = userSlice.actions;
export default userSlice.reducer;
