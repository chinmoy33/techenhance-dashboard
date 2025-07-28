import React, { useState, useEffect } from "react";
import { BarChart3, Sparkles, User as LucideUser } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { LogOut,Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { toggleMenu } from "../store/uiSlice";

interface HeaderProps {
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({isMobile}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({
          username: user.user_metadata.full_name || user.email,
          avatarUrl: user.user_metadata.avatar_url,
        });
      }
    };

    getUser();
  }, []);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
    } else {
      toast.success("Logged out");
      localStorage.clear();
      navigate("/login");
    }
  };

  const [user, setUser] = useState<any>(null);

  // return (
  //   <header className="glass-card border-b border-white/10 h-24 p-2 py-5 px-16">
  //     <div className="max-w-8xl mx-auto flex items-center justify-between">
  //       <div className="flex items-center space-x-3">
  //         <div className="relative">
  //           <BarChart3 size={32} className="text-primary-400" />
  //           <Sparkles
  //             size={16}
  //             className="absolute -top-1 -right-1 text-accent-400"
  //           />
  //         </div>
  //         <div>
  //           <h1 className="text-2xl font-bold gradient-text">
  //             Data Visualizer Pro
  //           </h1>
  //           <p className="text-sm text-gray-400">
  //             Professional data analytics & visualization platform
  //           </p>
  //         </div>
  //       </div>

  //       <div className="flex items-center space-x-4">
  //         {user && (
  //           <div className="flex items-center space-x-3">
  //             <div className="flex items-center space-x-2 glass-card px-3 py-2 rounded-lg">
  //               {user.avatarUrl ? (
  //                 <img
  //                   src={user.avatarUrl}
  //                   alt={user.username}
  //                   className="w-6 h-6 rounded-full"
  //                 />
  //               ) : (
  //                 <LucideUser size={16} className="text-gray-400" />
  //               )}
  //               <span className="text-sm text-gray-300">{user.username}</span>
  //             </div>

  //             {/* Right side: Logout Button */}
  //             <button
  //               onClick={handleLogout}
  //               className="glass-button p-2 rounded-lg hover:bg-red-500/20 transition-colors"
  //               title="Logout"
  //             >
  //               <LogOut
  //                 size={16}
  //                 className="text-gray-400 hover:text-red-400"
  //               />
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </header>
  // );
  let attributes = "";

  if(!isMobile)
  {
    attributes = "glass-card px-3 py-2 rounded-lg"
  }

  return (
    <header className="glass-card border-b border-white/10 h-20 px-4 sm:px-16 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <BarChart3 size={isMobile ? 24 : 32} className="text-primary-400" />
            <Sparkles
              size={isMobile ? 12 : 16}
              className="absolute -top-1 -right-1 text-accent-400"
            />
          </div>
          {!isMobile && (
            <div>
              <h1 className="text-xl font-bold gradient-text">
                FinSight
              </h1>
              <p className="text-xs text-gray-400">
                Delivering AI Powered Insights
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={() => dispatch(toggleMenu())}
              className="p-2 rounded hover:bg-white/10"
            >
              <Menu className="text-gray-400" size={24} />
            </button>
          )}

          {user && (
            <div className={`flex items-center space-x-2 ${attributes}`}>
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <LucideUser size={20} className="text-gray-400" />
              )}

              {!isMobile && (
                <span className="text-sm text-gray-300">{user.username}</span>
              )}

              
            </div>
          )}
          <button
                onClick={handleLogout}
                className="glass-button p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                title="Logout"
              >
                <LogOut size={16} className="text-gray-400 hover:text-red-400" />
              </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
