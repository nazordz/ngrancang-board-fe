import { combineReducers, configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./slices/snackbarSlice";
import formProjectSlice from "./slices/formProjectSlice";
import storage from 'redux-persist/lib/storage'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import authenticateSlice from "./slices/authenticateSlice";
import NavbarSlice from "./slices/navbarSlice";
import confirmDeleteSlice from "./slices/confirmDeleteSlice";

const persistConfig = {
  key: process.env.SECURE_LOCAL_STORAGE_HASH_KEY!,
  storage,
};

const persistedNavbarSlice = persistReducer(persistConfig, NavbarSlice)
const persistedAuthenticateSlice = persistReducer(persistConfig, authenticateSlice)

const reducers = combineReducers({
  snackbar: snackbarReducer,
  formProjectDialog: formProjectSlice,
  navbarSlice: persistedNavbarSlice,
  authenticateSlice: persistedAuthenticateSlice,
  // confirmDeleteSlice: confirmDeleteSlice,
});

export const store = configureStore({
  reducer: reducers,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
