import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

const alg = "HS256";

export async function createToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secretKey);
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [alg]
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUser() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}