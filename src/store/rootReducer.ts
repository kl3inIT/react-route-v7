import { combineReducers } from "@reduxjs/toolkit";
import { usersReducer } from "@/features/users";

export const rootReducer = combineReducers({
    users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
