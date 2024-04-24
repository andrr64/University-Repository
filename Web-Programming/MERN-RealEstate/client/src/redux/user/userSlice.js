import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        /*
        user/signInSuccess
        params:
            - state: variabel data
            - action: berisi data akun
        function: mengubah nilai state
        */
        loadingStart: (state) => {
            state.loading = true;
        },
        loadingFinished: (state) => {
            state.loading = false;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        /*
        user/signInFailure
        params:
            - state: variabel data
            - action: berisi pesan error
        function: mengubah nilai error menjadi action.payload atau pesan error serta mengubah satte loading menjadi false
        */
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        }, 
        deleteUserFailed: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const { 
    signInStart, 
    signInFailure, 
    signInSuccess, 
    updateUserFailure, 
    updateUserSuccess, 
    updateUserStart,
    loadingStart,
    loadingFinished,
    deleteUserFailed,
    deleteUserStart,
    deleteUserSuccess
} = userSlice.actions;
export default userSlice.reducer;