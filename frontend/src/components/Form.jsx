import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "./Form.css"; // Custom CSS file

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    duedate: "",
    status: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await api.get(`/api/projects/${id}`);
          setFormData(response.data);
          setIsEditMode(true);
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/api/projects/${id}`, formData);
        alert("Project updated successfully!");
      } else {
        await api.post("/api/projects", formData);
        alert("Project added successfully!");
      }
      navigate("/projects");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">{isEditMode ? "Edit Project" : "Add Project"}</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duedate">Due Date</label>
          <input
            type="date"
            id="duedate"
            name="duedate"
            value={formData.duedate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="form-button">
          {isEditMode ? "Update Project" : "Add Project"}
        </button>
      </form>
    </div>
  );
}

export default Form;
