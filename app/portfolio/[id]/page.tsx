import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";

// This tells Next.js to expect a dynamic [id] in the URL
export default async function StudentPortfolio({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // 1. Fetch the specific student's profile from Supabase
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      users:user_id (
        full_name,
        email
      )
    `,
    )
    .eq("id", id)
    .single();

  // 2. DEBUG MODE: Show us exactly why it is failing!
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-red-50 p-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-red-200 shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            🚨 Supabase Fetch Failed
          </h1>
          <p className="font-mono text-sm mb-2">
            <strong>ID we searched for:</strong> {id}
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            If the black box says <strong>"Row not found"</strong> or empty, it
            means the ID is wrong, OR your database security (RLS) is blocking
            the public from reading it.
          </p>
        </div>
      </div>
    );
  }

  // 3. Parse the projects (stored as JSONB in Supabase) safely
  const projects = profile.projects
    ? JSON.parse(JSON.stringify(profile.projects))
    : [];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-3xl mx-auto px-6 py-20 sm:py-32 space-y-24">
        {/* HERO SECTION */}
        <header className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              {profile.users?.full_name || "Graduate Portfolio"}
            </h1>
            <h2 className="text-lg sm:text-xl text-gray-500 mt-2 font-medium">
              {profile.degree || "Recent Graduate"} • {profile.university}
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
            {profile.bio ||
              "Welcome to my professional portfolio. I am actively seeking new opportunities to apply my academic background and project experience."}
          </p>

          <div className="flex items-center gap-4 text-sm font-medium">
            {profile.users?.email && (
              <a
                href={`mailto:${profile.users.email}`}
                className="text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-900 pb-0.5"
              >
                Contact Me
              </a>
            )}
          </div>
        </header>

        {/* PROJECTS SECTION (Dynamically Mapped from Database) */}
        {projects && projects.length > 0 && (
          <section className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project: any, index: number) => (
                <div
                  key={index}
                  className="group flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-sm transition-all"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.title || "Untitled Project"}
                    </h4>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      {project.description ||
                        "No description provided for this project."}
                    </p>
                  </div>
                  {project.link && (
                    <div className="pt-4 border-t border-gray-50">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Project ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION SECTION */}
        <section className="space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Academic Background
          </h3>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-semibold text-gray-900">
                  {profile.degree || "Degree not specified"}
                </h4>
                <p className="text-sm text-gray-600">
                  {profile.university || "University not specified"}
                </p>
              </div>
              <span className="text-sm text-gray-500 font-mono">
                {profile.graduation_year || "N/A"}
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {profile.users?.full_name}. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
