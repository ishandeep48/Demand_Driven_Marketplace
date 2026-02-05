import bcrypt from 'bcrypt';


export default async function  hashPassword(password:string):Promise<string>{
    const saltRounds = Number(process.env.bcrypt_salt_rounds) ||10; // Change this to env variable
    const hashedPassword:string=await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}