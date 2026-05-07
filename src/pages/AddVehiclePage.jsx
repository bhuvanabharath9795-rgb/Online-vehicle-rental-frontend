import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AddVehiclePage() {
  const initialForm = {
    title: "",
    make: "",
    model: "",
    year: "",
    type: "Car",
    pricePerDay: "",
    location: "",
    availability: true,
    description: "",
    fuelType: "",
    transmission: "",
    seats: "",
  };

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const currentYear = new Date().getFullYear();

    if (!form.title || !form.make || !form.model || !form.location || !form.description) {
      return toast.error("Please fill all required fields");
    }

    if (Number(form.year) < 2000 || Number(form.year) > currentYear) {
      return toast.error("Enter a valid vehicle year");
    }

    if (Number(form.pricePerDay) <= 0) {
      return toast.error("Price must be greater than 0");
    }

    if (Number(form.seats) <= 0) {
      return toast.error("Seats must be greater than 0");
    }

    if (!imageFile) {
      return toast.error("Vehicle image is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("make", form.make);
      formData.append("model", form.model);
      formData.append("year", form.year);
      formData.append("type", form.type);
      formData.append("pricePerDay", form.pricePerDay);
      formData.append("location", form.location);
      formData.append("availability", form.availability);
      formData.append("description", form.description);
      formData.append("fuelType", form.fuelType);
      formData.append("transmission", form.transmission);
      formData.append("seats", form.seats);
      formData.append("image", imageFile);

      await api.post("/vehicles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Vehicle submitted successfully");

      setForm(initialForm);
      setImageFile(null);
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Add Vehicle Listing</h1>

      <form onSubmit={submitHandler} className="grid md:grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Make"
          value={form.make}
          onChange={(e) => setForm({ ...form, make: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Model"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          required
        />

        <input
          className="input"
          type="number"
          min="2000"
          max={new Date().getFullYear()}
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
        />

        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Scooter">Scooter</option>
          <option value="SUV">SUV</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
        </select>

        <input
          className="input"
          type="number"
          min="1"
          placeholder="Price per day"
          value={form.pricePerDay}
          onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Fuel Type"
          value={form.fuelType}
          onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
        />

        <input
          className="input"
          placeholder="Transmission"
          value={form.transmission}
          onChange={(e) => setForm({ ...form, transmission: e.target.value })}
        />

        <input
          className="input"
          type="number"
          min="1"
          placeholder="Seats"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: e.target.value })}
          required
        />

        <textarea
          className="input md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary md:col-span-2"
        >
          {loading ? "Submitting..." : "Submit Vehicle"}
        </button>
      </form>
    </div>
  );
}

export default AddVehiclePage;