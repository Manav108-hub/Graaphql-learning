import  bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const saltRound = 12;
    return await bcrypt.hash(password , saltRound);
}

export const comparePass = async (password , hashedPassword) => {
    return await bcrypt.compare(password , hashedPassword);
}