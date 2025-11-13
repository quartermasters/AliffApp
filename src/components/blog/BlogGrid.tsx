"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import { categoryLabels } from "@/data/blog";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.featured) return false; // Exclude featured (shown in hero)

      if (selectedCategory !== "all" && post.category !== selectedCategory) {
        return false;
      }

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.description.toLowerCase().includes(lowerQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      }

      return true;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              Search Articles
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, topic, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(selectedCategory !== "all" || searchQuery) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No articles match your search.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 text-teal-600 hover:text-teal-700 font-semibold"
          >
            Clear filters to see all articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const categoryColors: Record<string, string> = {
    "govcon-insights": "bg-govcon-600",
    "sled-strategies": "bg-teal-600",
    "it-development": "bg-it-600",
    "content-writing": "bg-writing-600",
    "ai-innovation": "bg-gold-600",
    "agency-partnerships": "bg-success-600",
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-hover p-6 flex flex-col h-full group"
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
            categoryColors[post.category]
          }`}
        >
          {categoryLabels[post.category]}
        </span>
        <span className="text-xs text-gray-500">{post.readTime}</span>
      </div>

      <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors flex-grow">
        {post.title}
      </h3>

      <p className="text-gray-600 mb-4">{post.excerpt}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{post.author}</span>
        <span>{new Date(post.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
        Read More
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
