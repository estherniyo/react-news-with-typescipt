import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StateType } from "../data/types";

const API_KEY = "f3a45a464fe34f2b9249a2d9a6b5be2a";

interface LatestStateType extends StateType {
  latest: string[];
}

const initialArticlesState: LatestStateType = {
  latest: [],
  status: "idle",
  error: null,
};

export const fetchLatestArticles = createAsyncThunk(
  "articles/fetchLatestArticles",
  async () => {
    try {
      const response = await fetch(
        `https://news-proxy.netlify.app/api/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      return data.articles;
    } catch (error) {
      throw error;
    }
  }
);

export const LatestArticlesSlice = createSlice({
  name: "articles",
  initialState: initialArticlesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLatestArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.latest = action.payload;
      })
      .addCase(fetchLatestArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectLatestArticles = (state) => state.articles.latest;
