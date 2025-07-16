import React, { useState, useEffect } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import ApperIcon from "@/components/ApperIcon";
import listService from "@/services/api/listService";

const Layout = ({ 
  children,
  activeListId,
  onListSelect,
  showMobileMenu = false,
  onToggleMobileMenu
}) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const allLists = await listService.getAll();
      setLists(allLists);
    } catch (err) {
      console.error("Failed to load lists:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="Menu" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 h-screen sticky top-0">
          <Sidebar
            activeListId={activeListId}
            onListSelect={onListSelect}
            className="h-full"
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={showMobileMenu}
          onClose={onToggleMobileMenu}
          lists={lists}
          loading={loading}
          activeListId={activeListId}
          onListSelect={onListSelect}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;