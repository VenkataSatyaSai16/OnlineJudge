import User from "../models/User.js";

export const getProfile = async (req,res) => {
    try{
        const { userId } = req.user;
        if(!userId){
            return res.status(400).json({
                message : "No Id",
            });
        }
        const existingUser = await User.findById(userId).select("-password");
        if(!existingUser){
            return res.status(400).json({
                message : "Id not found",
            });
        }

        res.status(200).json({
            user : existingUser
        })
    } catch( error){
        console.error(error.message);
        res.status(500).json({
            message: "Profile Not Found"
        })
    }
}

export const getDetails = async (req,res) => {
    try{
        const { userId } = req.user;

    const user =
      await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user
    });
    } catch(error){
        console.error(error.message);
    }
}