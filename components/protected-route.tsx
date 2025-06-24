import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/Context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isAllowed, setIsAllowed] = useState(false);
  const [prevPath, setPrevPath] = useState("");

  useEffect(() => {
    if (router.pathname.startsWith("/admin") && !user) {
      setPrevPath(router.asPath);
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsAllowed(true);
  }, [router.pathname, user]);

  if (!isAllowed) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-3xl">You are not allowed to access this page</p>
          <p className="mt-2">
            You will be redirected to the previous page in 3 seconds
          </p>
        </div>
      </div>
    );
  }

  return children;
};
