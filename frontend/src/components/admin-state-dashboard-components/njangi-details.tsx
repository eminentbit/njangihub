import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNjangiStateStore } from "../../store/njangi.state.store";
import {
  Edit,
  Calendar,
  Users,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Trash,
} from "lucide-react";
import { EditNjangiModal } from "./edit-njangi-modal";
import { MyNjangiResponse } from "../../types/my.njangi.types";
import { ConfirmModal } from "../confirm.delete.modal";
import { useUpdateNjangiStore } from "../../store/updateNjangiDetails.store";
import toast from "react-hot-toast";
import NoNjangiMessage from "../NoNjangiMessage";
import { useNavigate } from "react-router-dom";
import { useCreateNjangiStore } from "../../store/create.njangi.store";

export function NjangiDetails({ njangiId }: { njangiId: string | null }) {
  const [isEditModalOpen, setIsEditModalOpen] =
    useState<MyNjangiResponse | null>(null);
  const [cancelNjangiId, setCancelNjangiId] = useState<string | null>(null);
  const { getMyNjangiDetails } = useNjangiStateStore();
  const { cancelNjangi, loading } = useUpdateNjangiStore();
  const { clearDraftId } = useCreateNjangiStore();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: njangiDetails = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["njangiDetails", njangiId],
    queryFn: () => getMyNjangiDetails(njangiId!),
    enabled: !!njangiId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isLoading && njangiDetails.length === 0) {
      clearDraftId(); // clear draft id so user donnnot access state dashboard in landing page
      navigate("/no-njangi-message");
    }
  }, [isLoading, njangiDetails, navigate, clearDraftId]);

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

  const handleEdit = (njangi: MyNjangiResponse) => {
    setIsEditModalOpen(njangi);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(null);
  };

  const handleDeleteNjangi = async (id: string) => {
    const result = await cancelNjangi(id);
    await queryClient.invalidateQueries({
      queryKey: ["njangiDetails", njangiId],
    });
    if (result?.sucess) {
      toast.success(result.message, {
        position: "top-right",
        duration: 5000,
      });
      setCancelNjangiId(null);

      if (njangiDetails.length === 0) {
        clearDraftId(); // clear draft id so user donnnot access state dashboard in landing page
        navigate("/no-njangi-message");
      }
    } else {
      toast.error(result?.message || "Update failed", {
        position: "top-right",
        duration: 5000,
      });
      setCancelNjangiId(null);
    }
  };

  return (
    <>
      <ConfirmModal
        open={cancelNjangiId === njangiId}
        message={`Are you sure you want to cancel this Njangi? This action cannot be undone.`}
        onCancel={() => setCancelNjangiId(null)}
        onConfirm={() => handleDeleteNjangi(njangiId!)}
        loading={loading}
      />
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-blue-500 animate-pulse">
            Fetching your Njangi Details...
          </div>
        ) : error ? (
          <div className="text-red-500 animate-pulse">
            Error loading Njangi details.
          </div>
        ) : njangiDetails.length === 0 ? (
          <NoNjangiMessage />
        ) : (
          njangiDetails.map((njangiData, index) => (
            <div key={index} className="space-y-6 mb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Njangi Details
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(njangiData)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </button>
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto flex items-center justify-center"
                    onClick={() => setCancelNjangiId(njangiId)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Cancel Njangi
                  </button>
                </div>
              </div>

              {/* Edit Deadline */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Edits can only be done within 24 hours
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                {/* Account Setup */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Setup
                  </h3>
                  <div className="space-y-4">
                    {/* Name + Role */}
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {njangiData.accountSetup.firstName[0]}
                          {njangiData.accountSetup.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {njangiData.accountSetup.firstName}{" "}
                          {njangiData.accountSetup.lastName}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            njangiData.accountSetup.status
                          )}`}
                        >
                          {njangiData.accountSetup.role}
                        </span>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Email + Phone */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {njangiData.accountSetup.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {njangiData.accountSetup.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Group Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {njangiData.groupDetails.groupName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          njangiData.groupDetails.status
                        )}`}
                      >
                        {njangiData.groupDetails.status}
                      </span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-600">Contribution</p>
                          <p className="font-medium flex gap-1">
                            {njangiData.groupDetails.contributionAmount.toLocaleString()}{" "}
                            <span>FCFA</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-600">Frequency</p>
                          <p className="font-medium">
                            {njangiData.groupDetails.contributionFrequency}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-600">Members</p>
                          <p className="font-medium">
                            {njangiData.groupDetails.numberOfMember}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-600">Payout Method</p>
                          <p className="font-medium">
                            {njangiData.groupDetails.payoutMethod}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-600 mb-1">Duration</p>
                      <p className="font-medium">
                        {new Date(
                          njangiData.groupDetails.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          njangiData.groupDetails.endDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Group Rules
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {njangiData.groupDetails.rules}
                </p>
              </div>

              {/* Invited Members */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Invited Members ({njangiData.inviteMembers.length})
                </h3>
                <div className="space-y-3">
                  {njangiData.inviteMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="font-medium text-gray-900">
                          {member.contact}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600">
                          {member.type === "email" ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <Phone className="h-4 w-4" />
                          )}
                          <span>{member.value}</span>
                        </div>
                      </div>
                      <span className="border border-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 w-fit">
                        {member.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Modal */}
              {isEditModalOpen && (
                <EditNjangiModal
                  njangi={isEditModalOpen}
                  onClose={handleCloseModal}
                />
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
