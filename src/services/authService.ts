import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword, type UserCredential } from "firebase/auth";


export async function login(email: string, password: string): Promise<UserCredential> {
  if (!email || !password) {
    throw new Error("Email e senha sao obrigatorios.");
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return userCredential;
    
  } catch (error) {
    throw error; 
  }
}