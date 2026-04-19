import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "@/types";

const KEY = "mp_auth_user_v1";

// TODO: wire to real POST /auth/login + GET /auth/me
export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch (e) {
      console.log("[authService] getCurrentUser error", e);
      return null;
    }
  },

  async login(email: string, _password: string): Promise<AuthUser> {
    console.log("[authService] mock login", email);
    await new Promise((r) => setTimeout(r, 700));
    const user: AuthUser = {
      id: "user_local_1",
      name: email.split("@")[0] || "Researcher",
      email,
      organization: "SoCal Coastal Research",
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
  },
};
