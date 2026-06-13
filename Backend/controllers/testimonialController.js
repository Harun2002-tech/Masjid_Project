import { getDoc, getDocs, addDoc, setDoc, deleteDoc, collections } from "../utils/firestore.js";

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating, initials } = req.body;
    const data = {
      name, role: role || "Student", content,
      rating: Number(rating) || 5,
      initials: initials || name?.charAt(0).toUpperCase(),
      image: req.body.image || "",
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
    const updatedData = {
      name: req.body.name || existing.name,
      role: req.body.role || existing.role,
      content: req.body.content || existing.content,
      rating: Number(req.body.rating) || existing.rating,
      initials: req.body.initials || existing.initials,
      image: req.body.image || existing.image,
      isActive: req.body.isActive !== undefined ? req.body.isActive : existing.isActive,
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
