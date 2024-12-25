import { Request, Response } from "express"
import Users from '../Model/userModel'
import { error, log } from "console";
import jwt from 'jsonwebtoken'

export const adminLogin = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { email, password } = req.body
        // console.log(email, password);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Enter a valid email" })
        }


        if (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {
            const adminToken = jwt.sign(
                { email: process.env.ADMIN_EMAIL, role: 'admin' },
                process.env.ADMIN_JWT_SECRET as string,
                { expiresIn: process.env.JWT_EXPIRATION }
              );
              
            return res.status(200).json({ success: "User verified successfully" , adminToken })

        }
        else {
            return res.status(400).json({ error: "Incorrect email or password " })
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

export const userList = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const users = await Users.find()
        return res.status(200).json(users)

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

export const deleteUser = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const id = req.params.id
        // console.log('id ', id);

        await Users.findByIdAndDelete(id).then(() => {

            return res.status(200).json({ success: 'User deleted successfully' })
        }).catch((error) => {
            return res.status(400).json({ error: 'Unexpected error occurred ' })
        })

    } catch (error) {
        console.error("delete error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

export const getUser = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const id = req.params.id
        // const {name,email}  = req.body 

        const user = await Users.findById(id)
        if (user) {
            // console.log('user ', user);
            const vUser = {
                name: user.name,
                email: user.email,
                _id: user._id

            }

            return res.status(200).json(vUser)
        } else {
            return res.status(400).json({ error: 'Unexpected error occurred ' })

        }

    } catch (error) {
        console.error("delete error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}


export const editUser = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const id : string  = req.params.id
        const { name , email } = req.body
     
        const ex = await Users.find({ email: email, _id: { $ne: id } });

        if (ex.length > 0 ) {
            return res.status(400).json({ error: 'Email already exists please choose another email  ' })
        }

        const user = await Users.findByIdAndUpdate(id, {
            name: name,
            email: email
        })
        if (user) {
            return res.status(200).json({ success: 'User updated successfully' })
        }
        else {
            return res.status(400).json({ error: 'User not found ' })
        }

    } catch (error) {
        console.error("delete error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}