import { Logo } from "@/components/logo";
import Link from "next/link";
import Layout from "@/components/layout";

export default function Blog() {
  return (
    <Layout hasTabBar title="Auto Create Post For Blog">
      <div className="flex flex-col items-center justify-center space-y-10 px-4 text-center">
        <Logo />
        <p className="text-2xl">
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link className="btn mx-auto mt-6 mb-4 max-w-xs" href="/blog/post/new">
          Begin
        </Link>
      </div>
    </Layout>
  );
}
