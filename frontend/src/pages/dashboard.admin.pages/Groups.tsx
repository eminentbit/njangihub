import { useState, useEffect } from "react";
import { FaInfoCircle, FaUsers, FaCalendarAlt, FaCogs } from "react-icons/fa";
import Sidebar from "../../components/dashboard.admin.components/Sidebar";
import Header from "../../components/dashboard.admin.components/Header";
import { useNavigate } from "react-router-dom";
import { useFetchGroups } from "../../hooks/useAdmin";
import { useAdminState } from "../../store/create.admin.store";
import { User } from "../../types/auth.validator";

// Loading skeleton component
const GroupCardSkeleton = () => (
  <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full"></div>
      </div>
      <div className="mt-4 md:mt-0 w-24 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
    </div>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center p-4 bg-white dark:bg-gray-700 rounded"
        >
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mr-3"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Enhanced loading state
const LoadingState = () => (
  <div className="flex-1 pt-20 px-4 sm:px-6 md:px-8 lg:px-12">
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Loading Groups
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we fetch your group information...
        </p>
      </div>

      {[...Array(3)].map((_, i) => (
        <GroupCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Members preview component
const MembersPreview = ({
  members,
  groupId,
  onNavigate,
}: {
  members: User[];
  groupId: string;
  onNavigate: (path: string) => void;
}) => {
  const displayMembers = members.slice(0, 5);
  const remainingCount = Math.max(0, members.length - 5);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);
  };

  return (
    <div className="absolute left-full top-0 ml-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 transform translate-x-0 opacity-100 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Group Members
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {members.length} total
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {displayMembers.map((member, index) => (
          <div
            key={member.id || index}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(member.firstName + " " + member.lastName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {`${member.firstName} ${member.lastName}`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {member.role || member.email}
              </p>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                member.status === "Active" || member.isActive
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
            ></div>
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              +{remainingCount}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {remainingCount} more member{remainingCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={() => onNavigate(`/admin/group/${groupId}/members`)}
          className="w-full text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors duration-200"
        >
          View All Members
        </button>
      </div>

      {/* Arrow pointer */}
      <div className="absolute left-0 top-6 transform -translate-x-1 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white dark:border-r-gray-800"></div>
    </div>
  );
};

const GroupInfoPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [, setActiveTab] = useState("/group");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hoveredMembersGroup, setHoveredMembersGroup] = useState<string | null>(
    null
  );

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const navigate = useNavigate();

  const { groups, isLoading, error } = useFetchGroups();
  const { setGroupId } = useAdminState();

  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <Sidebar
          isOpen={isSidebarOpen}
          onTabChange={setActiveTab}
          onToggle={toggleSidebar}
          notifications={[]}
          onClose={toggleSidebar}
        />
        <div
          className={`flex flex-col flex-1 h-full ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          } transition-all duration-300`}
        >
          <Header darkMode={isDarkMode} setDarkMode={setIsDarkMode} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Error Loading Groups
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {error.message ||
                  "Something went wrong while fetching your groups."}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onTabChange={setActiveTab}
        onToggle={toggleSidebar}
        notifications={[]}
        onClose={toggleSidebar}
      />

      {/* Content panel */}
      <div
        className={`
          flex flex-col flex-1 h-full
          ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
          transition-all duration-300
          overflow-y-auto
        `}
      >
        {/* Sticky Header */}
        <Header darkMode={isDarkMode} setDarkMode={setIsDarkMode} />

        {/* Loading State */}
        {isLoading ? (
          <LoadingState />
        ) : (
          /* Scrollable Main */
          <main className="flex-1 pt-20 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-6">
              {groups?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Groups Found
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    You don't have any groups yet. Create your first group to
                    get started.
                  </p>
                </div>
              ) : (
                groups?.map((group) => (
                  <section
                    key={group._id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div
                        onClick={() => {
                          setGroupId(group._id);
                          navigate(`/admin/group/${group._id}`);
                        }}
                        className="cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-all duration-200"
                      >
                        <h1 className="flex items-center text-3xl font-bold text-blue-700 dark:text-gray-100 mb-2 group-hover:text-blue-600">
                          <FaInfoCircle className="mr-2 transition-transform group-hover:scale-110" />
                          {group.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500">
                          {group.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setGroupId(group._id);
                          navigate(`/admin/group/${group._id}`);
                        }}
                        className="mt-4 md:mt-0 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        Group Info
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Members Card with Hover Preview */}
                      <div className="relative flex items-center p-4 bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                        <FaUsers className="text-blue-500 text-2xl mr-3" />
                        <div
                          onClick={() => {
                            setGroupId(group._id);
                            navigate(`/admin/group/${group._id}/members`);
                          }}
                          onMouseEnter={() => setHoveredMembersGroup(group._id)}
                          onMouseLeave={() => setHoveredMembersGroup(null)}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 rounded p-2 relative"
                        >
                          <p className="text-xl font-semibold dark:text-gray-100">
                            {group.groupMembers?.length || 0}
                          </p>
                          <p className="text-sm text-blue-500 dark:text-blue-400 font-medium cursor-pointer">
                            Members
                          </p>
                        </div>
                      </div>
                      {/* Members Preview Popup */}
                      {hoveredMembersGroup == group._id &&
                        group.groupMembers?.length > 0 && (
                          <MembersPreview
                            members={group.groupMembers}
                            groupId={group._id}
                            onNavigate={(path) => {
                              setGroupId(group._id);
                              navigate(path);
                            }}
                          />
                        )}

                      <div className="flex items-center p-4 bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <FaCalendarAlt className="text-green-500 text-2xl mr-3" />
                        <div>
                          <p className="text-xl font-semibold dark:text-gray-100">
                            {group.nextMeeting || "Not scheduled"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Next Meeting
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <FaCalendarAlt className="text-blue-500 text-2xl mr-3" />
                        <div>
                          <p className="text-xl font-semibold dark:text-gray-100">
                            {new Date(group?.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Created On
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-white dark:bg-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                        <FaCogs className="text-blue-500 text-2xl mr-3" />
                        <div
                          onClick={() => {
                            setGroupId(group._id);
                            navigate(`/admin/group/${group._id}/settings`);
                          }}
                          className="cursor-pointer"
                        >
                          <p className="text-xl font-semibold dark:text-gray-100">
                            Settings
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Manage Settings
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                ))
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default GroupInfoPage;
