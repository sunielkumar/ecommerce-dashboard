import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { apiFetch, ApiError } from "@/lib/api";
import type {
  AuthStatus,
  LoginCredentials,
  LoginResponse,
  StoredAuth,
} from "@/types/auth";

type AuthState = {
  token: string | null;
  username: string | null;
  status: AuthStatus;
  error: string | null;
  isHydrated: boolean;
};

const initialState: AuthState = {
  token: null,
  username: null,
  status: "idle",
  error: null,
  isHydrated: false,
};

export const loginUser = createAsyncThunk<
  StoredAuth,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: credentials,
      cache: "no-store",
    });

    return {
      token: response.token,
      username: credentials.username,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue("Login failed. Please try again.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<StoredAuth | null>) {
      state.token = action.payload?.token ?? null;
      state.username = action.payload?.username ?? null;
      state.status = action.payload ? "authenticated" : "idle";
      state.error = null;
      state.isHydrated = true;
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.status = "authenticated";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Login failed. Please try again.";
      });
  },
});

export const { hydrateAuth, logout } = authSlice.actions;

export default authSlice.reducer;
