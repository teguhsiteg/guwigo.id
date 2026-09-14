"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

type UserRole = "admin" | "member" | null;

interface AuthContextType {
  currentUser: any;
  userRole: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  switchRole: (role: "admin" | "member") => void;
  resetRole: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  isLoading: true,
  isAuthenticated: false,
  switchRole: () => {},
  resetRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actualRole, setActualRole] = useState<UserRole>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const isSuperAdminEmail =
            user.email === "parthner@guwigo.com" ||
            user.email === "admin@guwigo.com" ||
            user.email === "teguhsiteg95@gmail.com";
          let role: UserRole = isSuperAdminEmail ? "admin" : "member";

          try {
            // Get user role from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            const rawRole = (userData?.role || "").toLowerCase();

            const isAdminRole =
              isSuperAdminEmail ||
              rawRole === "admin" ||
              rawRole === "super_admin" ||
              rawRole === "superadmin";

            role = isAdminRole ? "admin" : "member";
          } catch (docErr) {
            console.warn("Could not fetch user document from Firestore, using email fallback:", docErr);
          }

          setCurrentUser(user);
          setActualRole(role);

          // Check if there's a role override in localStorage (for role switching)
          const overrideRole = localStorage.getItem('guwigo_role_override');
          if (overrideRole) {
            setUserRole(overrideRole as UserRole);
          } else {
            setUserRole(role);
          }

          // Update localStorage
          if (role === "admin") {
            localStorage.setItem("guwigo_admin_session", "ACTIVE");
            localStorage.setItem("admin_uid", user.uid);
          } else {
            localStorage.setItem("guwigo_user_session", "ACTIVE");
            localStorage.setItem("user_uid", user.uid);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setActualRole(null);
          localStorage.removeItem("guwigo_admin_session");
          localStorage.removeItem("guwigo_user_session");
          localStorage.removeItem("guwigo_role_override");
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const switchRole = (role: "admin" | "member") => {
    if (actualRole === "admin") {
      localStorage.setItem("guwigo_role_override", role);
      setUserRole(role);
      router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  };

  const resetRole = () => {
    localStorage.removeItem("guwigo_role_override");
    setUserRole(actualRole);
    if (actualRole === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        isLoading,
        isAuthenticated: !!currentUser,
        switchRole,
        resetRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
