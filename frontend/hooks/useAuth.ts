"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/services/auth/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetCurrentUserQuery,
} from "@/services/auth/authApi";
import { ROUTES } from "@/constants/routes";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { accessToken, isAuthenticated } = useAppSelector((s) => s.auth);

  const { data: user, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [refreshMutation] = useRefreshMutation();

  const login = useCallback(
    (data: Parameters<typeof loginMutation>[0]) => loginMutation(data),
    [loginMutation]
  );

  const register = useCallback(
    (data: Parameters<typeof registerMutation>[0]) => registerMutation(data),
    [registerMutation]
  );

  const refresh = useCallback(() => refreshMutation(), [refreshMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // ignore logout API errors — always clear local state
    }
    dispatch(clearCredentials());
    router.push(ROUTES.LOGIN);
  }, [logoutMutation, dispatch, router]);

  return { user, accessToken, isAuthenticated, isLoading, login, register, logout, refresh };
}
