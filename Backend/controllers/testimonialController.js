import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const createTestimonial = async (req, res) => {
  try {
    const { uploadedUrls, uploadedFiles, fileUrl, ...rest } = req.body;
    const { name, role, content, rating, initials } = rest;
    const data = {
      name, role: role || "Student", content,
      rating: Number(rating) || 5,
      initials: initials || name?.charAt(0).toUpperCase(),
      image: rest.image || "",
      isActive: true,
    };
    const testimonial = await addDoc(collections.testimonials, data);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await getDocs(collections.testimonials, {
      where: [{ field: "isActive", op: "==", value: true }],
      orderBy: "createdAt", orderDir: "desc",
    });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await getDoc(collections.testimonials, req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "አስተያየቱ አልተገኘም" });
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const existing = await getDoc(collections.testimonials, req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "አስተያየቱ አልተገኘም" });

    const { uploadedUrls, uploadedFiles, fileUrl, ...rest } = req.body;
    const updatedData = {
      name: rest.name || existing.name,
      role: rest.role || existing.role,
      content: rest.content || existing.content,
      rating: Number(rest.rating) || existing.rating,
      initials: rest.initials || existing.initials,
      image: rest.image || existing.image,
      isActive: rest.isActive !== undefined ? rest.isActive : existing.isActive,
    };
    await setDoc(collections.testimonials, req.params.id, updatedData);
    const updated = await getDoc(collections.testimonials, req.params.id);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    await deleteDoc(collections.testimonials, req.params.id);
    res.status(200).json({ success: true, message: "አስተያየቱ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
