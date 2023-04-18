import { combineReducers, configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./slices/snackbarSlice";
// import deleteConfirmDialogReducer from "./slices/deleteConfirmDialogSlice";
// import storage from "redux-persist/lib/storage";
// import userReducer from "./slices/userSlice";
// import emailReducer from "./slices/emailSlice";
// import popoverReducer from "./slices/popoverSlice";
// import {
  // persistStore,
  // persistReducer,
  // FLUSH,
  // REHYDRATE,
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
// } from "redux-persist";
// import { encryptTransform } from "redux-persist-transform-encrypt";

// const userPersistConfig = {
//   key: "user",
//   storage,
// };
// const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
// const persistedUserReducer = persistReducer({
//   transforms: [
//     encryptTransform({

//     })
//   ]
// })

const reducers = combineReducers({
  snackbar: snackbarReducer,
  // confirmDeleteDialog: deleteConfirmDialogReducer,
  // user: persistedUserReducer,
  // email: emailReducer,
  // popover: popoverReducer,
});

export const store = configureStore({
  reducer: reducers,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// export const persistor = persistStore(store);
