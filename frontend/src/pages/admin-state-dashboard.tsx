import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useValidateInvitationToken } from "../store/validate.registration.token.draftid";
import UILoader from "../components/ui.messages/ui.loader";
import InviteTokenStatusUi from "../components/ui.messages/invalid.token.ui.msg";
import { NjangiOverview } from "../components/admin-state-dashboard-components/njangi-overview";
import { SubmittedNjangis } from "../components/admin-state-dashboard-components/submitted-njangi";
import { NjangiDetails } from "../components/admin-state-dashboard-components/njangi-details";
import StatusTracking from "../components/admin-state-dashboard-components/status-tracking";
import { DashboardInfoModal } from "../components/admin-state-dashboard-components/njangi-info-modal";
import toast from "react-hot-toast";
export default function NjangiStateDashBoard() {
  const [searchParams] = useSearchParams();
  const njangiId = searchParams.get("draftId");
  const [draftIdStatus, setDraftIdStatus] = useState<
    "valid" | "invalid" | "missing" | "redirect"
  >("valid");
  const [loading, setLoading] = useState(true);
  const { validateAdminStateDasboardId } = useValidateInvitationToken();

  const [activeTab, setActiveTab] = useState("overview");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "submitted", label: "My Njangis" },
    { id: "details", label: "Details" },
    { id: "tracking", label: "Status" },
  ];

  useEffect(() => {
    if (!njangiId) {
      setDraftIdStatus("missing");
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const result = await validateAdminStateDasboardId(njangiId);
        console.log("Draft ID validation result:", result);
        if (!isMounted) return;
        if (!result) {
          setDraftIdStatus("invalid");
        } else if (result.status === "redirect") {
          setDraftIdStatus("redirect");
          setLoading(false);
          navigate("/login");
          toast.success(
            "Your Njangi has been approved. Please login to continue...",
            {
              position: "top-right",
            }
          );
          return;
        } else if (result.status === "missing") {
          setDraftIdStatus("missing");
        } else if (result.status === "invalid") {
          setDraftIdStatus("invalid");
        } else {
          setDraftIdStatus("valid");
        }
      } catch (error) {
        console.error("Error validating draftId:", error);
        setDraftIdStatus("invalid");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [njangiId, validateAdminStateDasboardId, navigate]);

  // Show info modal after content loads and dashboard is valid
  useEffect(() => {
    if (draftIdStatus === "valid" && !loading) {
      const shouldHide = localStorage.getItem("hideDashboardInfoModal");
      if (shouldHide !== "true") {
        const timer = setTimeout(() => {
          setShowInfoModal(true);
        }, 1000); // 1 second delay
        return () => clearTimeout(timer);
      }
    }
  }, [draftIdStatus, loading]);

  if (loading) {
    return (
      <>
        <UILoader
          text="Validating your njangi state dashboard"
          subtitle="Please wait while we verify your njangi state dashboard."
        />
      </>
    );
  }
  if (draftIdStatus !== "valid") {
    return (
      <>
        <InviteTokenStatusUi inviteStatus={draftIdStatus} itemType="draft Id" />
      </>
    );
  }

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-3 sm:p-4 lg:p-5 max-w-7xl">
          <div className="">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              My Njangi State Dashboard
            </h1>
            <p className="text-sm lg:text-base text-gray-600 mt-2">
              View, edit, and track the status of your Njangi submissions
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Mobile Navigation - Scrollable */}
            <div className="w-full overflow-x-auto sm:overflow-x-visible">
              <div className="inline-flex h-12 items-center justify-start rounded-lg bg-blue-50 p-1 text-gray-600 min-w-max sm:grid sm:w-full sm:grid-cols-4">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[80px] sm:min-w-0 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:bg-blue-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              {activeTab === "overview" && (
                <NjangiOverview njangiId={njangiId} />
              )}
              {activeTab === "submitted" && (
                <SubmittedNjangis njangiId={njangiId} />
              )}
              {activeTab === "details" && <NjangiDetails njangiId={njangiId} />}
              {activeTab === "tracking" && (
                <StatusTracking njangiId={njangiId} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Info Modal */}
      <DashboardInfoModal
        isOpen={showInfoModal}
        onClose={handleCloseInfoModal}
      />
    </>
  );
}
