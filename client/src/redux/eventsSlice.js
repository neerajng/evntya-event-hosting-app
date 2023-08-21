import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allEvents: [],
    selectedCategory: 'all',
    searchResults: [],
    location: 'World Wide',
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setAllEvents: (state, action) => {
      state.allEvents = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setAllEvents, setSelectedCategory, setSearchResults, setLocation,resetState } = eventsSlice.actions;

export default eventsSlice.reducer;
