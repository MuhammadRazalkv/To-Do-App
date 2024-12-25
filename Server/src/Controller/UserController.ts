import { Request, Response } from "express"
import Users from '../Model/userModel'
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

const hashPassword = async (password: string) => {
  try {
    const hashPassword = bcrypt.hashSync(password, 8)
    return hashPassword
  } catch (error) {
    console.error(error)
  }
}


export const signUp = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { name, email, password } = req.body
    console.log(name, email, password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[A-Za-z ]{4,10}$/;

    if (!usernameRegex.test(name)) {
      return res.status(400).json({ error: "Enter a valid name" })
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Enter a valid email" })
    }

    const isExisting = await Users.findOne({ email });

    if (isExisting) {
      return res.status(401).json({ error: 'User already exists' })
    }

    const hashedPassword = await hashPassword(password)
    Users.create({ name: name, email: email, password: hashedPassword }).then(() => {
      res.status(200).json({ message: 'User Created successfully' })
    }).catch((error) => {
      console.error(error)
    })


  } catch (error) {

  }
}

export const login = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { email, password } = req.body
    console.log(email, password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Enter a valid email" })
    }

    const user = await Users.findOne({ email: email })
    if (user) {
      const match: boolean = bcrypt.compareSync(password, user.password)
      if (match) {

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        return res.status(200).json({
          success: "User verified successfully",
          token,
          user: { id: user._id, name: user.name, email: user.email, profilePicture: user?.profilePicture },
        })
      } else {
        return res.status(400).json({ error: "Incorrect email or password " })
      }

    } else {
      return res.status(400).json({ error: "Incorrect email or password " })
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

}

interface UpdateProfileBody {
  id: string;
  name: string;
  email: string;
  profileImage?: any
}



// export const updateProfile = async (req: Request<{}, {}, UpdateProfileBody>, res: Response): Promise<any | void> => {
//   try {



//     const { id, name, email } = req.body;

//     const emailExists = await Users.findOne({ email: email, _id: { $ne: id } });
//     if (emailExists) {
//       return res.status(400).json({ error: "Email already exists. Please choose another one." });
//     }

//     const updatedUser = await Users.findByIdAndUpdate(
//       id,
//       { name: name, email: email },
//       { new: true, runValidators: true }
//     );

//     if (updatedUser) {
//       return res.status(200).json({
//         success: "Profile updated successfully",
//         user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email },
//       });
//     } else {
//       return res.status(404).json({ error: "User not found" });
//     }

//   } catch (error) {
//     console.error("Updating error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const updateProfile = async (req: Request<{}, {}, UpdateProfileBody>, res: Response): Promise<any | void> => {
  try {
    const { id, name, email, profileImage } = req.body;

    console.log(req.body);
    console.log('profileImage', profileImage);

    const emailExists = await Users.findOne({ email: email, _id: { $ne: id } });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists. Please choose another one." });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { name, email, profilePicture: profileImage }, // Use profileImage instead of profilePicture
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      return res.status(200).json({
        success: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture
        },
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }

  } catch (error) {
    console.error("Updating error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
