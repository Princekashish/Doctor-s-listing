"use client";
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import Head from "next/head";
import { ChevronDown, Info } from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  experience: number;
  location: string;
  clinic?: string;
  fee: number;
  onlineFee?: number;
  visitFee?: number;
  qualifications?: string;
}

export default function DoctorConsultationPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  console.log(doctors);

  const [doctordetails, setDoctordetails] = useState<Doctor>({
    _id: "",
    name: "",
    specialty: "",
    experience: 0,
    location: "",
    clinic: "",
    fee: 0,
    onlineFee: 0,
    visitFee: 0,
    qualifications: "",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [doctorspopup, setDoctorspopup] = useState(false);
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    minFee: 0,
    maxFee: 5000,
    experience: [] as number[],
    consultMode: ["hospital", "online"],
    language: [] as string[],
    feeRange: [] as string[],
  });
  const [showMore, setShowMore] = useState({
    experience: false,
    language: false,
  });

  // Fetch doctors from the API
  const fetchDoctors = async () => {
    try {
      const query = {
        page,
        limit,
        specialty: filters.specialty,
        location: filters.location,
        minFee: filters.minFee,
        maxFee: filters.maxFee,
        experience: filters.experience.join(','),
        consultMode: filters.consultMode.join(','),
        feeRange: filters.feeRange.join(','),
      };

      const response = await axios.get(`/api/list-doctor`, {
        params: query,
        paramsSerializer: {
          indexes: null // This prevents array indexes in params
        }
      });

      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  console.log("Doctors:", doctors);

  console.log();
  const handleDoctor = () => {
    setDoctorspopup(true);
  };

  // Fetch doctors 
  useEffect(() => {
    fetchDoctors();
  }, [filters, page]);

  const handleConsultModeChange = (mode: string) => {
    const updatedModes = filters.consultMode.includes(mode)
      ? filters.consultMode.filter(item => item !== mode)
      : [...filters.consultMode, mode];

    setFilters({
      ...filters,
      consultMode: updatedModes,
    });
  };

  const handleExperienceChange = (range: number) => {
    const updatedExperience = filters.experience.includes(range)
      ? filters.experience.filter(item => item !== range)
      : [...filters.experience, range];

    setFilters({
      ...filters,
      experience: updatedExperience,
    });
  };

  const handleFeeRangeChange = (range: string) => {
    const updatedFeeRange = filters.feeRange.includes(range)
      ? filters.feeRange.filter(item => item !== range)
      : [...filters.feeRange, range];

    setFilters({
      ...filters,
      feeRange: updatedFeeRange,
    });
  };

  const handleLanguageChange = (language: string) => {
    const updatedLanguages = filters.language.includes(language)
      ? filters.language.filter(item => item !== language)
      : [...filters.language, language];

    setFilters({
      ...filters,
      language: updatedLanguages,
    });
  };

  const clearAllFilters = () => {
    setFilters({
      specialty: "",
      location: "",
      minFee: 0,
      maxFee: 5000000,
      experience: [],
      consultMode: ["hospital", "online"],
      language: [],
      feeRange: [],
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctordetails({
      ...doctordetails,
      [name]: value,
    });
  };

  const handlesubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!doctordetails.name || !doctordetails.specialty || !doctordetails.location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(`/api/add-doctor`, doctordetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data.Doctors);

      if (response.status === 201) {
        alert("Doctor added successfully!");
        setDoctorspopup(false);
        setDoctordetails({
          _id: "",
          name: "",
          specialty: "",
          experience: 0,
          location: "",
          clinic: "",
          fee: 0,
          onlineFee: 0,
          visitFee: 0,
          qualifications: "",
        });
        // Refresh the doctor list
        if (response.data.newDoctor) {
          setDoctors(prev => [...prev, response.data.newDoctor]);
        }

        // Then refresh from server to ensure consistency
        await fetchDoctors();
      } else {
        alert("Failed to add doctor. Please try again.");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("An error occurred while adding the doctor. Please try again.");
    }
  };


  return (
    <>
      <Head>
        <title>General Physicians Online - Internal Medicine Specialists</title>
        <meta
          name="description"
          content="Consult with General Physicians and Internal Medicine Specialists online or visit in-person."
        />
      </Head>

      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className="w-1/4 p-6 border-r">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={clearAllFilters}
              className="text-blue-600 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Mode of Consult */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Mode of Consult</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.consultMode.includes("hospital")}
                  onChange={() => handleConsultModeChange("hospital")}
                />
                <span>Hospital Visit</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.consultMode.includes("online")}
                  onChange={() => handleConsultModeChange("online")}
                />
                <span>Online Consult</span>
              </label>
            </div>
          </div>

          {/* Experience (In Years) */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Experience (In Years)</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.experience.includes(5)}
                  onChange={() => handleExperienceChange(5)}
                />
                <span>0-5</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.experience.includes(10)}
                  onChange={() => handleExperienceChange(10)}
                />
                <span>6-10</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.experience.includes(16)}
                  onChange={() => handleExperienceChange(16)}
                />
                <span>11-16</span>
              </label>
            </div>
            <button
              className="text-blue-600 font-medium mt-2 flex items-center"
              onClick={() => setShowMore({ ...showMore, experience: !showMore.experience })}
            >
              +1 More
            </button>
          </div>

          {/* Fees (In Rupees) */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Fees (In Rupees)</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.feeRange.includes("100-500")}
                  onChange={() => handleFeeRangeChange("100-500")}
                />
                <span>100-500</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.feeRange.includes("500-1000")}
                  onChange={() => handleFeeRangeChange("500-1000")}
                />
                <span>500-1000</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.feeRange.includes("1000+")}
                  onChange={() => handleFeeRangeChange("1000+")}
                />
                <span>1000+</span>
              </label>
            </div>
          </div>

          {/* Language */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-800">Language</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.language.includes("English")}
                  onChange={() => handleLanguageChange("English")}
                />
                <span>English</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.language.includes("Hindi")}
                  onChange={() => handleLanguageChange("Hindi")}
                />
                <span>Hindi</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 mr-3 text-blue-600 rounded"
                  checked={filters.language.includes("Telugu")}
                  onChange={() => handleLanguageChange("Telugu")}
                />
                <span>Telugu</span>
              </label>
            </div>
            <button
              className="text-blue-600 font-medium mt-2 flex items-center"
              onClick={() => setShowMore({ ...showMore, language: !showMore.language })}
            >
              +1 More
            </button>
          </div>

          <button
            onClick={handleDoctor}
            className="bg-black px-3 py-2 rounded-3xl text-white text-sm"
          >
            Add doctor
          </button>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Consult General Physicians Online - Internal Medicine Specialists</h1>
            <p className="text-gray-600">({doctors.length} doctors)</p>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex justify-end mb-6">
            <div className="relative border rounded-lg flex items-center px-4 py-2">
              <span className="pr-2">Availability</span>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="space-y-6">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div key={doctor._id} className="border rounded-lg p-6 relative">
                  {doctor._id === "1" && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 text-sm font-semibold">
                      DOCTOR OF THE HOUR
                    </div>
                  )}
                  <div className="flex">
                    {/* Doctor Image and Details */}
                    <div className="flex-shrink-0 w-24 h-24 mr-6">
                      <img
                        src={`https://avatar.iran.liara.run/public?username=${encodeURIComponent(doctor.name)}`}
                        alt={doctor.name}
                        className="w-full h-full object-cover rounded-full border-4 border-blue-100"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h2 className="text-xl font-bold">{doctor.name}</h2>
                        <Info size={18} className="ml-2 text-gray-500" />
                      </div>
                      <p className="text-gray-600">{doctor.specialty}</p>
                      <p className="text-indigo-600 font-semibold my-1">
                        {doctor.experience} YEARS • {doctor.qualifications}
                      </p>
                      <p className="text-gray-600">{doctor.clinic}</p>
                    </div>

                    {/* Fee and Consultation Options */}
                    <div className="flex items-start gap-4">
                      {doctor.onlineFee && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">₹{doctor.onlineFee}</p>
                          <button className="mt-4 w-full bg-white border border-blue-600 text-blue-600 rounded-md py-3 px-6 hover:bg-blue-50 transition">
                            Consult Online
                            {doctor._id === "2" && <div className="text-xs mt-1">Available in 12 minutes</div>}
                            {doctor._id === "3" && <div className="text-xs mt-1">Available in 22 minutes</div>}
                          </button>
                        </div>
                      )}

                      {doctor.visitFee && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">₹{doctor.visitFee}</p>
                          <button className="mt-4 w-full bg-blue-600 text-white rounded-md py-3 px-6 hover:bg-blue-700 transition">
                            Visit Doctor
                            {(doctor._id === "2" || doctor._id === "3") && <div className="text-xs mt-1">Available in 2 minutes</div>}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No doctors found matching your criteria</p>
              </div>
            )}
          </div>
          <div className="flex justify-around items-center mt-6">
            <button
              className={`bg-black text-white px-6 py-3 rounded-3xl flex justify-center items-center ${page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Pre
            </button>
            <span className="text-gray-700 font-medium">Page {page}</span>
            <button
              className={`bg-black text-white px-6 py-3 rounded-3xl flex justify-center items-center ${doctors.length < limit ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={doctors.length < limit}
            >
              Next
            </button>
          </div>

        </main>

        {doctorspopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300" />

            {/* Popup Container */}
            <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl w-[90vw] md:w-[70vw] max-h-[90vh] overflow-y-auto p-8 animate-fadeIn">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add Doctor Details</h2>

              <form onSubmit={handlesubmit} className="space-y-6">
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={doctordetails.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialty</label>
                    <input
                      type="text"
                      value={doctordetails.specialty}
                      onChange={handleChange}
                      name="specialty"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (years)</label>
                    <input
                      type="number"
                      value={doctordetails.experience}
                      onChange={handleChange}
                      name="experience"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={doctordetails.location}
                      onChange={handleChange}
                      name="location"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Clinic (optional)</label>
                    <input
                      type="text"
                      value={doctordetails.clinic}
                      onChange={handleChange}
                      name="clinic"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Base Fee (₹)</label>
                    <input
                      type="number"
                      value={doctordetails.fee}
                      onChange={handleChange}
                      name="fee"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Third Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Online Fee (₹, optional)</label>
                    <input
                      type="number"
                      value={doctordetails.onlineFee}
                      onChange={handleChange}
                      name="onlineFee"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Visit Fee (₹, optional)</label>
                    <input
                      type="number"
                      value={doctordetails.visitFee}
                      onChange={handleChange}
                      name="visitFee"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-sm font-medium mb-1">Qualifications (optional)</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={doctordetails.qualifications}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setDoctorspopup(false)}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-md transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg shadow-md transition"
                  >
                    Save
                  </button>
                </div>
              </form>

              {/* Close Button */}
              <button
                onClick={() => setDoctorspopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}