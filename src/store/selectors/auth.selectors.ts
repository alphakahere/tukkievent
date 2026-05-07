import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectAuth = (state: RootState) => state.auth;

export const selectAuthUser = createSelector([selectAuth], (auth) => auth.user);

export const selectAccessToken = createSelector(
	[selectAuth],
	(auth) => auth.accessToken,
);

export const selectIsAuthenticated = createSelector(
	[selectAuth],
	(auth) => Boolean(auth.user && auth.accessToken),
);

export const selectUserRoles = createSelector(
	[selectAuthUser],
	(user) => user?.roles ?? [],
);
