import Image from "next/image";

export default function Home() {
  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Background with Transparent Gradient and Image Blend */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("bg2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      ></div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Header Text with Contrast */}
        <h1 className="text-3xl font-bold text-center sm:text-left mb-6 text-white">
          Welcome to Our E-learning World!
        </h1>

        {/* Subtext with contrast */}
        <p className="text-lg text-center sm:text-left font-[family-name:var(--font-geist-mono)] text-white">
          Start your learning journey today by exploring our interactive courses and resources.
        </p>

        {/* List Items with contrast */}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] mt-6 text-white">
          <li className="mb-2">
            Sign up to start your learning adventure 👩‍💻.
          </li>
          <li>Browse and enroll in courses that fit your goals 🧐.</li>
          <li>Track your progress and improve your skills 💻!</li>
          <li>And Good Luck ❤😉!</li>
        </ol>

        {/* Call to Action Buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <a
           className="rounded-full border dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#000] text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"

            href="/signup" // Link to your signup page
          >
            Sign Up Now
          </a>
          
          <a
            className="rounded-full border dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#000] text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/login" // Link to your login page
          >
            Login
          </a>

          <a
            className="rounded-full border dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#000] text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/courses" // Link to your courses page
          >
            Explore Courses
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center z-10 text-white">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about-us"
        >
          Learn About Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact-us"
        >
          Contact Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/blog"
        >
          Read Our Blog
        </a>
      </footer>
    </div>
  );
}
