import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            console.log('status', state.status, 'userData', state.userData);
            console.log('payload:', action.payload);
            // what i am sending when i dispatch this login function is stored as action.payload.userData
            // remember the JS shortcut of {userData:userData} is {userData} so we use .userData
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;