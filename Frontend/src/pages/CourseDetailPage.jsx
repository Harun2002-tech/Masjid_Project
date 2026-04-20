import { useParams } from "react-router-dom";
import CourseDetailContent from "../components/courses/CourseOverviewPage";
import { sampleCourses } from "../lib/sample-data";

export default function CourseDetail() {
  const { id } = useParams();
  const course = sampleCourses.find((c) => c.id === id);

  if (!course) {
    return <div className="container py-20 text-center">Course not found</div>;
  }

  return <CourseDetailContent course={course} />;
}
