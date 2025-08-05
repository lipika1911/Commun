"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string){
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.create({
            data:{
                content,
                image,
                authorId: userId
            }
        })

        // Revalidates the cache for the "/" path, forcing Next.js to refetch and update the data
        // for server components or pages that depend on that path.
        // Useful after changes like creating a post, so the latest data is shown on the homepage.
        // Basically, it tells next.js
        // “Hey, something on the home page might have changed — please refresh its data.”
        revalidatePath("/")
        return {success: true, post}

    } catch (error) {
        console.error("Failed to create post", error);
        return {success: true, error: "Failed to create post"};
    }
}  