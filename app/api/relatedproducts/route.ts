import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";


export async function GET(
    request: Request, 
    ) {
      try {
        const product = await prisma.product.findMany()
  
        return NextResponse.json(product);
        
      } catch (error) {
        console.log(error)
        
      }
    }