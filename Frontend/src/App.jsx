import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute"; // 👈 አዲሱ ፋይል
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { MainLayout } from "./components/layout/main-layout";
import ScrollToTop from "./components/layout/ScrollToTop";

/* ---------------- PUBLIC PAGES ---------------- */
import HomePage from "./pages/HomePage";
import About from "./pages/AboutPage";
import Contact from "./pages/ContactPage";
import Donations from "./pages/Donations.Page";
import Events from "./pages/EventPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LibraryPage from "./pages/LibraryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import NotFound from "./pages/404";
import UstazProfilesPage from "./pages/Ustaz Profiles page";
import UstazDetailPage from "./components/ustaz-profiles/UstazDetailPage";
import DailyMessagePage from "./pages/daily-message";
import BlogDetail from "./components/blog/BlogDetail";
import YouTubeGallery from "./components/home/YouTubeGallery";

/* ---------------- USER PAGES ---------------- */
import UserDashboard from "./components/users/DashboardPage";
import MyCourses from "./components/users/MyCourses";

/* ---------------- ADMIN PAGES ---------------- */
import AdminDashboard from "./components/admin/admin/AdminStats";
import AddCoursePage from "./pages/admin/AddCourse";
import AddStudent from "./pages/admin/AddStudent";
import AddTeacher from "./pages/admin/AddTeacher";
import AddMessage from "./pages/admin/AddMessage";
import ManageEnrollments from "./components/admin/EnrollForm/ManageEnrollments";
import BookAdminPage from "./pages/admin/BookAdminPage";
import TeacherProfile from "./components/admin/Teacher/TeacherProfile";
import StudentProfile from "./components/admin/Student/StudentProfile";
import StudentListPage from "./components/admin/Student/StudentListPage";
import TeacherListPage from "./components/admin/Teacher/TeacherListPage";
import CourseListPage from "./components/admin/Course/CourseListPage";
import UpdatePrayertimes from "./components/admin/Prayertimes/UpdatePrayertimes";
import AdminSchedulePage from "./components/admin/Schedule/AdminSchedulePage";
import AdminNewsForm from "./components/admin/New/AdminNewsForm";
import EnrollForm from "./components/admin/EnrollForm/EnrollForm";
import EnrollmentToggle from "./components/admin/EnrollForm/EnrollmentToggle";
import SubmitTestimonial from "./components/admin/Testimonial/TestimonialSection";
import TestimonialsListPage from "./components/admin/Testimonial/TestimonialsList";
import TestimonialProfile from "./components/admin/Testimonial/TestimonialProfile";
import AdminNewProfile from "./components/admin/admin/NewAdmin";
import AdminNewsList from "./components/admin/New/AdminNewsList";

/* ---------------- COURSE LEARNING ---------------- */
import CourseOverviewPage from "./components/courses/CourseOverviewPage";
import CourseLearningPage from "./components/admin/Course/CourseDetailPage";

function App() {
  // ለአድሚን ገጾች የተፈቀዱ ሮሎች ዝርዝር

 const adminRoles = ["superadmin", "masjid_admin", "admin"];
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/ustaz" element={<UstazProfilesPage />} />
            <Route path="/ustaz-profile/:id" element={<UstazDetailPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/youtube" element={<YouTubeGallery />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:id/enroll" element={<EnrollForm />} />
            <Route path="/course-info/:id" element={<CourseOverviewPage />} />
            <Route path="/course-learn/:id" element={<CourseLearningPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/prayer-times" element={<PrayerTimesPage />} />
            <Route path="/daily-message" element={<DailyMessagePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* USER ROUTES (Authentication Required) */}
            <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />

            {/* ADMIN ROUTES (Auth + Role Required) */}
            <Route path="/admin">
              <Route index element={<PrivateRoute roles={adminRoles}><AdminDashboard /></PrivateRoute>} />
              
              {/* Testimonials */}
              <Route path="testimonials" element={<PrivateRoute roles={adminRoles}><TestimonialsListPage /></PrivateRoute>} />
              <Route path="submit-testimonial" element={<PrivateRoute roles={adminRoles}><SubmitTestimonial /></PrivateRoute>} />
              <Route path="testimonials/edit/:id" element={<PrivateRoute roles={adminRoles}><SubmitTestimonial editMode={true} /></PrivateRoute>} />
              <Route path="testimonial/:id" element={<PrivateRoute roles={adminRoles}><TestimonialProfile /></PrivateRoute>} />

              {/* Students */}
              <Route path="students" element={<PrivateRoute roles={adminRoles}><StudentListPage /></PrivateRoute>} />
              <Route path="add-student" element={<PrivateRoute roles={adminRoles}><AddStudent /></PrivateRoute>} />
              <Route path="student/:id/view" element={<PrivateRoute roles={adminRoles}><AddStudent editMode={true} /></PrivateRoute>} />
              <Route path="student/:id/edit" element={<PrivateRoute roles={adminRoles}><AddStudent editMode={true} /></PrivateRoute>} />
              <Route path="student/:id/profile" element={<PrivateRoute roles={adminRoles}><StudentProfile /></PrivateRoute>} />

              {/* Teachers */}
              <Route path="teachers" element={<PrivateRoute roles={adminRoles}><TeacherListPage /></PrivateRoute>} />
              <Route path="add-teacher" element={<PrivateRoute roles={adminRoles}><AddTeacher /></PrivateRoute>} />
              <Route path="teacher/:id/view" element={<PrivateRoute roles={adminRoles}><AddTeacher editMode={true} /></PrivateRoute>} />
              <Route path="teacher/:id/edit" element={<PrivateRoute roles={adminRoles}><AddTeacher editMode={true} /></PrivateRoute>} />
              <Route path="teacher/:id" element={<PrivateRoute roles={adminRoles}><TeacherProfile /></PrivateRoute>} />

              {/* Courses */}
              <Route path="courses" element={<PrivateRoute roles={adminRoles}><CourseListPage /></PrivateRoute>} />
              <Route path="add-course" element={<PrivateRoute roles={adminRoles}><AddCoursePage /></PrivateRoute>} />
              <Route path="courses/edit/:id" element={<PrivateRoute roles={adminRoles}><AddCoursePage /></PrivateRoute>} />
              <Route path="courses/view/:id" element={<PrivateRoute roles={adminRoles}><AddCoursePage /></PrivateRoute>} />
              <Route path="course/edit/:id" element={<PrivateRoute roles={adminRoles}><CourseDetailPage /></PrivateRoute>} />

              {/* Management */}
              <Route path="enrollments" element={<PrivateRoute roles={adminRoles}><ManageEnrollments /></PrivateRoute>} />
              <Route path="enrollment-control" element={<PrivateRoute roles={adminRoles}><EnrollmentToggle /></PrivateRoute>} />
              <Route path="schedule" element={<PrivateRoute roles={adminRoles}><AdminSchedulePage /></PrivateRoute>} />
              <Route path="prayer-times" element={<PrivateRoute roles={adminRoles}><UpdatePrayertimes /></PrivateRoute>} />
              <Route path="add-news" element={<PrivateRoute roles={adminRoles}><AdminNewsForm /></PrivateRoute>} />
              <Route path="news" element={<PrivateRoute roles={adminRoles}><AdminNewsList /></PrivateRoute>} />
              <Route path="news/edit/:id" element={<PrivateRoute roles={adminRoles}><AdminNewsForm /></PrivateRoute>} />
              <Route path="news/view/:id" element={<PrivateRoute roles={adminRoles}><AdminNewsForm /></PrivateRoute>} />
              <Route path="add-admin" element={<PrivateRoute roles={adminRoles}><AdminNewProfile /></PrivateRoute>} />
              <Route path="add-message" element={<PrivateRoute roles={adminRoles}><AddMessage /></PrivateRoute>} />
              <Route path="manage-books" element={<PrivateRoute roles={adminRoles}><BookAdminPage /></PrivateRoute>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;