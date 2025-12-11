import jwt from 'jsonwebtoken'

const GenerateToken = (user)=>{

    return jwt.sign({id: user._id,email:user.email}, //Payload
        process.env.JWT_key,  
        
    {
      expiresIn: "7d", // ⬅️ token expires in 7 days
    }      //secret key 
               
    )

}

export default GenerateToken;
