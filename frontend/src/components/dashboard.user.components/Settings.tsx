"use client";

import  { useState, useEffect } from "react";
//import Sidebar from "../dashboard.admin.components/Sidebar";
import SettingsSidebar from "./SettingsSidebar";
import SettingsProfileForm from "./Profile";
import SettingsPasswordForm from "./Password";
import SettingsPayment from "./SettingsPayment";
import SettingsNotifications from "./SettingsNotification";
import SettingsSecurity from "./Security";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isOpen, setIsOpen] = useState(true);

  // 1️⃣ Auto‑collapse on mobile, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsOpen(false);
      else setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const sidebarVariants = {
    open: { width: 256, transition: { type: "spring", stiffness: 200, damping: 25 } },
    closed: { width: 64, transition: { type: "spring", stiffness: 200, damping: 25 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex h-full">
      {/*  
        2️⃣ Slide‑in/out on mobile when closed, always visible on md+  
        transform + transition so click events on the page won't be blocked  
      */}
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          overflow-hidden h-screen shrink-0
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* FIXED: now actually closes */}
        

        {/* Collapse/expand button */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-4 right-[-12px] p-1 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 focus:outline-none"
          style={{ transform: "translateX(50%)" }}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </motion.div>

      {/*  
        Push content over on md+ only; on mobile we remove left margin  
      */}
      <div className={`flex-1 overflow-auto px-6 py-8 ml-0 ${isOpen ? "md:ml-64" : "md:ml-16"}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Settings</h1>
            <p className="text-gray-600 dark:text-blue-400 mt-1">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings tabs */}
            <motion.div
              className="md:w-64 shrink-0"
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{ open: { opacity: 1 }, closed: { opacity: 0.6 } }}
            >
              <SettingsSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOpen={isOpen}
                onToggle={toggleSidebar}
              />
            </motion.div>

            {/* Tab content */}
            <div className="flex-1 dark:bg-gray-800 p-6">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div key="profile" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <SettingsProfileForm />
                  </motion.div>
                )}
                {activeTab === "password" && (
                  <motion.div key="password" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <SettingsPasswordForm />
                  </motion.div>
                )}
                {activeTab === "payment" && (
                  <motion.div key="payment" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <SettingsPayment />
                  </motion.div>
                )}
                {activeTab === "notifications" && (
                  <motion.div key="notifications" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <SettingsNotifications />
                  </motion.div>
                )}
                {activeTab === "security" && (
                  <motion.div key="security" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <SettingsSecurity />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
