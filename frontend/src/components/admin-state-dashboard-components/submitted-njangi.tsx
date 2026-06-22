/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { EditNjangiModal } from "./edit-njangi-modal";
import { useQuery } from "@tanstack/react-query";
import { useNjangiStateStore } from "../../store/njangi.state.store";
import { useNavigate } from "react-router-dom";
import UpgradeModal from "../upgradePlan";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function SubmittedNjangis({ njangiId }: { njangiId: string | null }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNjangi, setSelectedNjangi] = useState<any>(null);
  const { getMyNjangis } = useNjangiStateStore();
  const [openModal, setOpenModal] = useState(false);

  const {
    data: njangis = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["njangis", njangiId],
    queryFn: () => getMyNjangis(njangiId!),
    enabled: !!njangiId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 30 * 1000, // Refetch every 30 seconds in the background
    refetchOnWindowFocus: true, // Refetch when window/tab regains focus
  });

  // const handleEdit = (njangi: any) => {
  //   setSelectedNjangi(njangi);
  //   setIsEditModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedNjangi(null);
  };
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          My Submitted Njangis
        </h2>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shrink-0"
          onClick={() => navigate("/njangi-form")}
        >
          Create New Njangi
        </button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-blue-400 text-sm animate-pulse">
            Fetching your recent Submitted Njangi, Hang on...
          </p>
        ) : error ? (
          <p className="text-red-400 font-semibold text-sm animate-pulse">
            Error: {error.message}
          </p>
        ) : njangis.length === 0 ? (
          <p className="text-sm text-blue-400 animate-pulse">
            Couldn't find your recent submitted Njangi. Please try again or
            Create one.
          </p>
        ) : (
          njangis.map((njangi, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow border-l-4 border-l-blue-500"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {njangi.njangiName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <p className="flex items-center gap-1">
                          {njangi.contributionAmmount.toLocaleString()}
                          <span>FCFA</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{njangi.contributionFrequency}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{njangi.numberOfMember} members</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        njangi.status
                      )}`}
                    >
                      {njangi.status.charAt(0).toUpperCase() +
                        njangi.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <p>
                      Submitted on{" "}
                      {njangi.submittonDate
                        ? `${new Date(njangi.submittonDate).toLocaleDateString(
                            "en-US"
                          )} at ${new Date(
                            njangi.submittonDate
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}`
                        : "N/A"}
                    </p>
                    <p>
                      Njangi Start Date:{" "}
                      {njangi.startDate
                        ? `${new Date(njangi.startDate).toLocaleDateString(
                            "en-US"
                          )} at ${new Date(njangi.startDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}`
                        : "N/A"}
                    </p>
                  </div>
                  {/* Edit can still be done in Njangi detail page, reason its commented */}

                  {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button className="border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(njangi)}
                      className="border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {openModal && (
        <UpgradeModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      )}

      {isEditModalOpen && selectedNjangi && (
        <EditNjangiModal njangi={selectedNjangi} onClose={handleCloseModal} />
      )}
    </div>
  );
}
