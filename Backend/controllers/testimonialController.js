const Testimonial = require("../models/Testimonial");

/**
 * @desc    Create a testimonial
 * @route   POST /api/testimonials
 */
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating, initials } = req.body;

    let imagePath = "";
    if (req.file) {
      // Normalize path (Windows fix + add leading /)
      imagePath = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      content,
      rating: Number(rating) || 5,
      initials: initials || name?.charAt(0).toUpperCase(),
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all testimonials
 * @route   GET /api/testimonials
 */
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get single testimonial
 * @route   GET /api/testimonials/:id
 */
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "አስተያየቱ አልተገኘም",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update testimonial
 * @route   PUT /api/testimonials/:id
 */
exports.updateTestimonial = async (req, res) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "አስተያየቱ አልተገኘም",
      });
    }

    // If new image uploaded
    if (req.file) {
      req.body.image = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    // Prevent unwanted fields overwrite
    const updatedData = {
      name: req.body.name,
      role: req.body.role,
      content: req.body.content,
      rating: Number(req.body.rating),
      initials: req.body.initials,
      image: req.body.image || testimonial.image,
      isActive: req.body.isActive ?? testimonial.isActive,
    };

    testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete testimonial
 * @route   DELETE /api/testimonials/:id
 */
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "አስተያየቱ አልተገኘም",
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "አስተያየቱ ተሰርዟል",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};