import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
};



export const getGenres = createAsyncThunk("cineflix/genres", async () => {

    const { data: { genres } } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
    return genres;
});

const createArrayFromRawData = (array, moviesArray, genres) => {
    array.forEach((movie) => {
        const movieGenres = [];
        movie.genre_ids.forEach((genre) => {
            const name = genres.find(({ id }) => id === genre);
            if (name) movieGenres.push(name.name);
        });

        if (movie.backdrop_path) {
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
            });
        }
    });
}

const getRawData = async (api, genres, paging) => {
    const moviesArray = [];
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const { data: { results } } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`);
        createArrayFromRawData(results, moviesArray, genres);
    }
    return moviesArray;
}

export const fetchMovies = createAsyncThunk("cineflix/trending", async ({ type }, thunkApi) => {
    const { cineflix: { genres } } = thunkApi.getState();
    return getRawData(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}`, genres, true);
});


export const fetchDataByGenre = createAsyncThunk("cineflix/moviesByGenres", async ({ genre, type }, thunkApi) => {
    const { cineflix: { genres } } = thunkApi.getState();
    return getRawData(`${TMDB_BASE_URL}/discover/${type}/?api_key=${process.env.REACT_APP_TMDB_API_KEY}&with_genres=${genre}`, genres);
});

export const getUserLikedMovies = createAsyncThunk("cineflix/getLiked", async (email) => {
    const { data: { movies } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/liked/${email}`);
    return movies;
});

export const removeMovieFromLiked = createAsyncThunk("cineflix/deleteLiked", async ({ email, movieId }) => {
    const { data: { movies } } = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user/remove`,
        {
            email,
            movieId,
        });
    return movies;
});

const CineflixSlice = createSlice({
    name: "Cineflix",
    initialState,
    reducers: {
        clearData: (state) => {
            state.movies = [];
            state.genresLoaded = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload;
            state.genresLoaded = true;
        })
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        })
        builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
            state.movies = action.payload;
        })
        builder.addCase(getUserLikedMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        })
        builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
            state.movies = action.payload;
        })
    },
});

export const store = configureStore({
    reducer: {
        cineflix: CineflixSlice.reducer,
    }
});

export const { clearData } = CineflixSlice.actions;