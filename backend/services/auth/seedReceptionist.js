import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export const seedReceptionist = async () => {
  const email = process.env.RECEPTIONIST_EMAIL?.trim().toLowerCase();
  const password = process.env.RECEPTIONIST_PASSWORD;

  if (!email || !password) {
    console.warn(
      "Receptionist account is not provisioned; set RECEPTIONIST_EMAIL and RECEPTIONIST_PASSWORD."
    );
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.role !== "receptionist") {
    throw new Error("RECEPTIONIST_EMAIL belongs to a non-receptionist account.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const receptionist = existingUser || new User({ email });

  receptionist.name = process.env.RECEPTIONIST_NAME?.trim() || "Receptionist";
  receptionist.phone = process.env.RECEPTIONIST_PHONE?.trim() || "0000000000";
  receptionist.password = hashedPassword;
  receptionist.role = "receptionist";

  await receptionist.save();
  console.log(`Receptionist account provisioned: ${email}`);
};
