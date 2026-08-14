"use client";

import React from "react";
// Import the data contract and our mock client data
import { sampleStudent as data } from "../../templates/sampleData";

export default function MinimalistTemplate() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-3xl mx-auto px-6 py-20 sm:py-32 space-y-24">
        {/* 1. HERO SECTION */}
        <header className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              {data.personal.fullName}
            </h1>
            <h2 className="text-lg sm:text-xl text-gray-500 mt-2 font-medium">
              {data.personal.tagline}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            {data.personal.bio}
          </p>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href={`mailto:${data.personal.email}`}
              className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-900 pb-0.5"
            >
              Email
            </a>
            {data.socials.github && (
              <a
                href={data.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-900 pb-0.5"
              >
                GitHub
              </a>
            )}
            {data.socials.linkedin && (
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-900 pb-0.5"
              >
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* 2. EXPERIENCE SECTION */}
        {data.experience.length > 0 && (
          <section className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Experience
            </h3>
            <div className="space-y-10">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {exp.role}
                    </h4>
                    <span className="text-sm text-gray-500 font-mono">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-base font-medium text-gray-700 mb-4">
                    {exp.company}
                  </p>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="text-gray-600 text-sm flex gap-3 leading-relaxed"
                      >
                        <span className="text-gray-300 mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. PROJECTS SECTION */}
        {data.projects.length > 0 && (
          <section className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Selected Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.projects.map((project) => (
                <div
                  key={project.id}
                  className="group flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-sm transition-all"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-md text-xs font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          Source Code ↗
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. SKILLS SECTION */}
        {data.skills.length > 0 && (
          <section className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Technical Arsenal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {data.skills.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    {skillGroup.category}
                  </h4>
                  <ul className="space-y-2">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="text-sm text-gray-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. EDUCATION SECTION */}
        {data.education.length > 0 && (
          <section className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Education
            </h3>
            <div className="space-y-6">
              {data.education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {edu.university} {edu.grade ? `• ${edu.grade}` : ""}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 font-mono">
                    {edu.graduationYear}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="pt-12 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {data.personal.fullName}. All rights
            reserved.
          </p>
          <a
            href="#"
            className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors border border-transparent hover:border-gray-200 px-3 py-1.5 rounded-lg"
          >
            Back to top ↑
          </a>
        </footer>
      </div>
    </main>
  );
}
