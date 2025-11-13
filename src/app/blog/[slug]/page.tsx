import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug, categoryLabels } from "@/data/blog";
import { getServiceBySlug } from "@/data/services";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${post.title} | Blog | Aliff Services`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedServices = post.relatedServices
    .map((slug) => getServiceBySlug(slug))
    .filter((s) => s !== undefined);

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <article>
        <header className="bg-gray-50 py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-6 text-sm text-gray-600">
                <Link href="/blog" className="hover:text-teal-600 transition-colors">
                  Blog
                </Link>
                <span className="mx-2">→</span>
                <Link
                  href={`/blog?category=${post.category}`}
                  className="hover:text-teal-600 transition-colors"
                >
                  {categoryLabels[post.category]}
                </Link>
                <span className="mx-2">→</span>
                <span className="text-gray-900">{post.title}</span>
              </nav>

              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="badge-gold">{categoryLabels[post.category]}</span>
                <span className="text-sm text-gray-600">{post.readTime}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-navy-900 mb-6">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center justify-between flex-wrap gap-4 text-gray-600">
                <div>
                  <span className="font-semibold">{post.author}</span>
                  <span className="mx-3">•</span>
                  <time dateTime={post.publishDate}>
                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{
                    __html: formatArticleContent(post.content),
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-navy-900">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.category}/${service.slug}`}
                    className="card-hover p-6 group"
                  >
                    <h3 className="text-xl font-bold mb-2 text-navy-900 group-hover:text-teal-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Learn More
                      <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-navy">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need Expert Help?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's discuss how our Strategic Thinking + AI Execution approach can solve your specific challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary btn-lg">
                Schedule Consultation
              </Link>
              <Link
                href="/services"
                className="btn-outline btn-lg text-white border-white hover:bg-white hover:text-navy-900"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatArticleContent(markdown: string): string {
  // Simple markdown-to-HTML conversion for basic formatting
  let html = markdown;

  // Headers
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mb-6 mt-8">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mb-4 mt-8">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mb-3 mt-6">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-bold mb-2 mt-4">$1</h4>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-teal-600 hover:text-teal-700 underline">$1</a>'
  );

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"><code>$2</code></pre>'
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm">$1</code>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4">');
  html = '<p class="mb-4">' + html + '</p>';

  // Lists
  html = html.replace(
    /^- (.*$)/gim,
    '<li class="ml-6 mb-2">• $1</li>'
  );

  return html;
}
