import { downloading } from "$lib/Downloading.server";
import { json } from "@sveltejs/kit";

export async function GET({}) {
    return json(downloading)
}