import { createUploadthing } from "uploadthing/express"; // 👈 የተስተካከለ (ያለ @ ምልክት)

const f = createUploadthing();

// እዚህ ጋር ነው ተጠቃሚው ምን አይነት ፋይል መጫን እንደሚችል የምትወስነው
export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("ፎቶው በተሳካ ሁኔታ ተጭኗል! ሊንኩ፦", file.url);
      // ይህንን file.url ነው ወደ ፍሮንትአንድ መልሰህ MongoDB ውስጥ የምታስቀምጠው
      return { url: file.url };
    }
  ),
};
