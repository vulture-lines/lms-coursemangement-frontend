import { useState, useEffect } from "react";
import { GetAllUsers } from "../../service/api"; // Assuming this API service exists
import PageHeader from "../../components/PageHeader";

function QueryPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const Token = JSON.parse(localStorage.getItem("loginData"));

  // Default profile picture URL
  const defaultProfilePic =
    "https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg";

  // Check authentication and role
  useEffect(() => {
    if (!Token?.token) {
      window.location.href = "/login";
      return;
    }

    if (Token?.user?.role !== "mentor") {
      setError("Access denied: Only mentors can view this page");
      return;
    }

    // Fetch users if mentor
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await GetAllUsers();
        setUsers(response.data || response);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [Token]);

  return (
    <>
      <PageHeader title="User Query" />
      <div className="mx-4">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg mb-4">
            Loading...
          </div>
        )}

        {!error && !isLoading && (
          <div className="bg-white rounded-lg shadow border border-gray-300">
            <div className="p-4 border-b bg-gray-100">
              <h2 className="text-lg font-medium">Users</h2>
            </div>
            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 rounded-md mb-2 flex items-center hover:bg-gray-100"
                  >
                    <img
                      src={user.profilePicture || defaultProfilePic}
                      alt={`${user.username}'s profile`}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-sm text-gray-600">{user.role}</span>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600">No users available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default QueryPage;