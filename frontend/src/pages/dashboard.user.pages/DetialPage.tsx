import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";

// Type definition for group data
type Group = {
  id: string;
  name: string;
  description: string;
  members: { id: string; name: string }[];
  paidCount: number;
  totalCount: number;
};

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Attempt to get group data passed via Link state
  const passedGroup = (location.state as { group?: Group } | undefined)?.group;

  const [group, setGroup] = useState<Group | null>(passedGroup || null);

  useEffect(() => {
    // If no passed data, fetch from API
    if (!group && groupId) {
      async function fetchGroup() {
        const response = await fetch(`/api/groups/${groupId}`);
        if (!response.ok) throw new Error("Failed to load group");
        const data: Group = await response.json();
        setGroup(data);
      }
      fetchGroup();
    }
  }, [groupId, group]);

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        Loading group details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <HiArrowNarrowLeft className="w-5 h-5 mr-2" />
        Back to My Groups
      </button>

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {group.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {group.description}
          </p>
        </div>

        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Members
            </h2>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {group.members.length}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
              Paid
            </h2>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {group.paidCount}
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Membership
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {group.members.map((m) => (
              <li key={m.id} className="text-gray-700 dark:text-gray-300">
                {m.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Payment Progress
          </h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-green-500 transition-width duration-300"
              style={{
                width: `${(group.paidCount / group.totalCount) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {group.paidCount} of {group.totalCount} have paid
          </p>
        </div>
      </div>
    </div>
  );
}
