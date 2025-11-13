"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    clientType: "",
    serviceInterest: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      // Reset form
      setFormState({
        name: "",
        email: "",
        company: "",
        phone: "",
        clientType: "",
        serviceInterest: "",
        budget: "",
        timeline: "",
        message: "",
      });
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-display-md md:text-display-lg font-bold mb-6">
              Let&apos;s Start a Conversation
            </h1>
            <p className="text-xl text-gray-300">
              Tell us about your project. We&apos;ll respond within 24 hours with our strategic
              assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info Sidebar */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Email</h3>
                    <a
                      href="mailto:hello@aliffservices.com"
                      className="text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      hello@aliffservices.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">Response Time</h3>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 mb-2">For Agencies</h3>
                    <p className="text-gray-600 mb-2">
                      Looking to white-label our services?
                    </p>
                    <a
                      href="/for-agencies"
                      className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                    >
                      Learn about agency partnerships →
                    </a>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-navy-900 mb-3">What to Expect</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">✓</span>
                        <span>Strategic assessment of your needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">✓</span>
                        <span>Honest evaluation if we&apos;re the right fit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">✓</span>
                        <span>Clear next steps and timeline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">✓</span>
                        <span>No pressure, no sales pitches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <p className="text-teal-800 font-medium">
                      Thank you! We&apos;ll be in touch within 24 hours.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formState.company}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Lead Qualification */}
                  <div>
                    <Label htmlFor="clientType">I am a... *</Label>
                    <select
                      id="clientType"
                      name="clientType"
                      required
                      value={formState.clientType}
                      onChange={handleChange}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select one</option>
                      <option value="agency">Agency looking to white-label services</option>
                      <option value="govcon">Government contractor seeking proposal help</option>
                      <option value="business">Business needing IT/development services</option>
                      <option value="organization">Organization needing content/writing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="serviceInterest">Service Interest *</Label>
                    <select
                      id="serviceInterest"
                      name="serviceInterest"
                      required
                      value={formState.serviceInterest}
                      onChange={handleChange}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select primary interest</option>
                      <option value="govcon">GOVCON Services (Federal Contracting)</option>
                      <option value="sled">SLED Services (State/Local/Education)</option>
                      <option value="it">IT Services (Development/Architecture)</option>
                      <option value="writing">Writing Services (Content/Strategy)</option>
                      <option value="multiple">Multiple services</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <select
                        id="budget"
                        name="budget"
                        value={formState.budget}
                        onChange={handleChange}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select range</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-15k">$5,000 - $15,000</option>
                        <option value="15k-50k">$15,000 - $50,000</option>
                        <option value="50k-plus">$50,000+</option>
                        <option value="ongoing">Ongoing partnership</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formState.timeline}
                        onChange={handleChange}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select timeline</option>
                        <option value="urgent">Urgent (within 1 week)</option>
                        <option value="soon">Soon (1-4 weeks)</option>
                        <option value="planning">Planning (1-3 months)</option>
                        <option value="exploring">Just exploring</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Tell us about your project *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="What are you trying to achieve? What challenges are you facing?"
                      className="mt-2"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="mt-3 text-sm text-gray-500">
                      By submitting this form, you agree to our privacy policy. We&apos;ll never
                      share your information.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">Why Clients Choose Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Strategic First</h3>
                <p className="text-gray-600 text-sm">
                  Human analysis before AI execution ensures relevance and innovation
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">
                  80% AI execution after strategic phase means faster turnaround
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Better Value</h3>
                <p className="text-gray-600 text-sm">
                  Superior quality at rates that beat traditional agencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
