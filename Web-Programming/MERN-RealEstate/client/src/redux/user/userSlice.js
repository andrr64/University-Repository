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
        }
    }
})

export const { signInStart, signInFailure, signInSuccess} = userSlice.actions;
export default userSlice.reducer;