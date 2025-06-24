import Cookies from "js-cookie";

const CookieHelper = {
  setAuthToken(token: string): void {
  const isLocal = process.env.NODE_ENV !== "production";
  Cookies.set("token", token, {
    expires: 30,
    secure: !isLocal,
  });
},

  getAuthToken(): string | null {
    return Cookies.get("token") || null;
  },

  removeAuthToken(): void {
    Cookies.remove("token");
  },

  clearAllCookies(): void {
    const allCookies: Record<string, string> = Cookies.get();
    Object.keys(allCookies).forEach((cookie) => {
      Cookies.remove(cookie);
    });
  },
};

export default CookieHelper;