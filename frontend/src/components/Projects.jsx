import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FaEdit, FaTrash, FaRegCheckCircle } from "react-icons/fa";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("unpaid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      alert("Project deleted");
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  const handleStatusClick = (project) => {
    setSelectedProject(project);
    setAmount("");
    setDate("");
    setStatus("unpaid");
    setShowStatusModal(true);
  };

  const handleStatusSave = async () => {
    try {
      await api.post(`/api/payments/add`, {
        projectId: selectedProject._id,
        amount,
        date,
        status,
      });
      setShowStatusModal(false);
      alert("Project status updated successfully.");
      navigate("/payments");
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Our Ongoing Projects</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex flex-wrap justify-center gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="w-full max-w-sm bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
              <p className="text-gray-600 mb-1">Due Date: {new Date(project.duedate).toLocaleDateString()}</p>
              <p className="text-lg font-medium text-blue-600">Status: {project.status}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(project._id)}
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
                <button
                  onClick={() => handleStatusClick(project)}
                  className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  <FaRegCheckCircle className="mr-2" /> Update Status
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No projects available at the moment.</p>
        )}
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Project Payment Status</h2>

            <input
              type="hidden"
              value={selectedProject?._id}
              readOnly
            />

            <label className="block mb-2 text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2 text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <label className="block mb-2 text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
