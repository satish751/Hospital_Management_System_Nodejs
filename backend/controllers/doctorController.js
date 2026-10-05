import User from "../models/User.js";

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: "doctor" },
      {
        name: 1,
        email: 1,
        phone: 1,
        role: 1,
      }
    );

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch doctors",
    });
  }
};