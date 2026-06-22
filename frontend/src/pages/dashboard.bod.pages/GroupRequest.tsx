import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/theme.context";
import Sidebar from "../../components/dashboard.bod.components/Sidebar";
import Header from "../../components/dashboard.bod.components/Header";
import GroupRequestTable from "../../components/dashboard.bod.components/GroupRequestTable";
import GroupRequestDetails from "../../components/dashboard.bod.components/GroupRequestDetails";
import DecisionModal from "../../components/dashboard.bod.components/DecisionModal";
import { useBodStore } from "../../store/create.bod.store";
import { GroupRequest } from "../../types/group.request";
import { GroupDetails } from "../../types/create-njangi-types";
import toast from "react-hot-toast";

const GroupRequests: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [modalRequestId, setModalRequestId] = useState<string | null>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const {
    requests,
    isLoading,
    error,
    fetchRequests,
    acceptRequest,
    rejectRequest,
  } = useBodStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    const onResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openDecisionModal = (
    action: "approve" | "reject",
    requestId: string
  ) => {
    setModalAction(action);
    setModalRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (reason: string) => {
    if (modalAction && modalRequestId) {
      if (modalAction === "approve") {
        acceptRequest(modalRequestId, reason);
        toast.success("Request approved successfully!", {
          position: "top-right",
        });
      } else {
        rejectRequest(modalRequestId, reason);
      }
    }
    setIsModalOpen(false);
  };

  const selectedRequest = requests.find((r) => r._id === selectedRequestId);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen((p) => !p)}
      />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <motion.main
          className={`flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 transition-all duration-300 `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Group Requests <span className="text-green-500">👥</span>
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading requests...</div>
          ) : error ? (
            <div className="text-red-500 py-10 text-center">Error: {error}</div>
          ) : (
            <>
              {selectedRequest ? (
                <GroupRequestDetails
                  request={selectedRequest as GroupRequest}
                  isDarkMode={isDarkMode}
                  onBack={() => setSelectedRequestId(null)}
                />
              ) : (
                <GroupRequestTable
                  requests={requests}
                  isDarkMode={isDarkMode}
                  onSelectRequest={setSelectedRequestId}
                  onAccept={(id) => openDecisionModal("approve", id)}
                  onReject={(id) => openDecisionModal("reject", id)}
                  selectedGroup={
                    (selectedRequest as unknown as GroupDetails) ||
                    ({} as GroupDetails)
                  }
                />
              )}
            </>
          )}

          <AnimatePresence>
            {isModalOpen && (
              <DecisionModal
                isOpen={isModalOpen}
                action={modalAction!}
                isDarkMode={isDarkMode}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
              />
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default GroupRequests;
