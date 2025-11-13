import type { Metadata } from "next";
import Link from "next/link";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { blogPosts, getFeaturedBlogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog - Insights & Strategies | Aliff Services",
  description:
    "Expert insights on GOVCON proposals, SLED strategies, IT development, and AI-powered content. Learn what separates winners from everyone else.",
};

export default function BlogPage() {
  const featured = getFeaturedBlogPosts();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero with Featured Post */}
      {featured.length > 0 && (
        <section className="bg-gradient-navy py-16 md:py-20">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-white mb-4 text-center">
                Insights & Strategies
              </h1>
              <p className="text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
                Expert perspectives on winning federal contracts, scaling agencies, and building
                better software with strategic thinking + AI execution.
              </p>

              {/* Featured Post Card */}
              <Link
                href={`/blog/${featured[0].slug}`}
                className="block bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge-gold">Featured</span>
                    <span className="text-sm text-gray-500">{featured[0].readTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 group-hover:text-teal-600 transition-colors">
                    {featured[0].title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">{featured[0].description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {featured[0].author} • {new Date(featured[0].publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Article
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid with Filters */}
      <section className="py-16">
        <div className="container-custom">
          <BlogGrid posts={blogPosts} />
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Weekly Insights</h2>
            <p className="text-xl text-gray-600 mb-8">
              Subscribe to our newsletter for weekly strategies on winning contracts and scaling your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="input flex-grow"
              />
              <button className="btn-primary btn-md whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No spam. Unsubscribe anytime. 2-4 emails per month.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
