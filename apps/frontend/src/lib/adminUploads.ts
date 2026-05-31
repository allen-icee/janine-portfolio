// apps\frontend\src\lib\adminUploads.ts
import { supabase } from "./supabase";
import imageCompression from "browser-image-compression";

const STORAGE_BUCKET = "portfolio-assets";

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && extension.length <= 5 ? extension : "png";
}

function getUploadPath(folder: string, file: File) {
  const id =
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${folder}/${id}.${getFileExtension(file)}`;
}

export async function uploadAdminImage(
  file: File,
  folder: "portfolio" | "proofs",
) {
  if (!supabase) {
    throw new Error("Supabase is not configured yet.");
  }

  let fileToUpload = file;

  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    fileToUpload = await imageCompression(file, options);
    console.log(
      `Original size: ${file.size / 1024 / 1024} MB, Compressed size: ${fileToUpload.size / 1024 / 1024} MB`,
    );
  } catch (error) {
    console.warn(
      "Image compression failed, falling back to original file:",
      error,
    );
  }

  const path = getUploadPath(folder, fileToUpload);
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, fileToUpload, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteAdminImage(publicUrl?: string) {
  if (!supabase || !publicUrl) return;

  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return;

    const path = decodeURIComponent(
      url.pathname.slice(markerIndex + marker.length),
    );
    if (!path) return;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);
    if (error) throw error;
  } catch (error) {
    console.warn("Could not delete uploaded image:", error);
  }
}
