import bcrypt from "bcrypt";
import User from "../database/models/userModel";

const adminSeed = async () => {
  const [data] = await User.findAll({
    where: {
      email: "admin@gmail.com",
    },
  });
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, saltRounds);
  if(!data) {
    await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin created successfully");
  }else {
    console.log("ℹ️ Admin already exists, skipping seeding");
  }
};

export default adminSeed;