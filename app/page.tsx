import { LandingPage } from "@/components/landing-page";
import { mockBlogs } from "@/lib/mock-data";

export default function HomePage() {
  return <LandingPage featuredBlogs={mockBlogs} />;
}