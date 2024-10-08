import React, { useEffect, useState, useContext } from "react";
import Menubar from "../../components/menuBar";
import axios from "../../utils/axiosInstance";
import AuthContext from "../../components/auth/authcontext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function MaterialPage() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/material", {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setMaterials(res.data.data);
      setFilteredMaterials(res.data.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      Swal.fire("Error", "Failed to fetch materials", "error");
    }
  };

  const handleAddMaterial = () => {
    navigate("/addmaterial");
  };

  const handleEdit = (id) => {
    navigate(`/editmaterial`, { state: { id } });
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: `Do you want to delete this material with ID: ${id}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await axios.delete(`/material/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Delete success",
          showConfirmButton: false,
          timer: 1000,
        });

        fetchMaterials(); // Refresh materials list
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Deletion cancelled");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      Swal.fire("Error", "Failed to delete material", "error");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [authData.token]);

  useEffect(() => {
    const filtered = materials.filter((material) =>
      // Ensure m_name is a string before calling toLowerCase
      (material.m_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [searchTerm, materials]);

  return (
    <div>
      <Menubar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Raw Materials</h1>
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-1/4"
          />
          <button
            onClick={handleAddMaterial}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Material
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b">No.</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Unit</th>
              <th className="px-4 py-2 border-b">Img</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material, index) => {
                return (
                  <tr key={material.id}>
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">
                      {material.m_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {material.u_name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-b flex justify-center items-center">
                      {material.m_img ? (
                        <img
                          src={`http://localhost:5000/uploads/material/${material.m_img}`}
                          alt={material.m_name || "Material Image"}
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="mr-8"
                        onClick={() => handleEdit(material.id)}
                      >
                        edit
                      </button>
                      <button onClick={() => handleDelete(material.id)}>
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MaterialPage;
