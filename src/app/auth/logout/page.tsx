import { LogOut } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { useState } from "react";


export const LogoutButton = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    // Start loading state
    setIsLoggingOut(true);
   
    try{
       // 1. Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Redirect to login page
    router.push("/auth/login");

} catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 transition-all rounded-md hover:bg-red-50 hover:text-red-700 active:scale-95"
    >
      {/* Inline Icon - positioned slightly before the text */}
      <LogOut size={16} strokeWidth={2.5} />
      
      <span>Logout</span>
    </button>
  );
};