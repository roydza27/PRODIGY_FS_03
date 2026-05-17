const features = [
  {
    title: "Customization",
    description:
      "Easily tailor every aspect of the platform to suit your business needs.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full fill-[#FAFAFA] dark:fill-[#FAFAFA]"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path d="M65.156 4.42c-8.327 0-15.13 6.855-15.13 15.202s6.803 15.165 15.13 15.165c7.017 0 12.924-4.863 14.626-11.382h13.843a3.8 3.8 0 0 0 3.791-3.805 3.8 3.8 0 0 0-3.79-3.8h-13.86C78.053 9.294 72.16 4.42 65.156 4.42M6.391 15.8a3.8 3.8 0 0 0-3.79 3.805 3.8 3.8 0 0 0 3.79 3.8h36.397c-.21-1.234-.348-2.493-.348-3.783 0-1.304.134-2.575.348-3.821zm28.47 18.987c-7.018 0-12.92 4.89-14.619 11.418H6.392a4 4 0 0 0-.363 0 3.8 3.8 0 0 0-3.52 4.062 3.8 3.8 0 0 0 3.882 3.535H20.25c1.71 6.511 7.604 11.382 14.61 11.382 8.328 0 15.167-6.848 15.167-15.195s-6.84-15.202-15.166-15.202m22.383 11.418c.21 1.234.347 2.494.347 3.784 0 1.3-.134 2.57-.347 3.813h36.381a3.795 3.795 0 0 0 3.874-3.714 3.796 3.796 0 0 0-3.874-3.883zm7.912 18.979c-8.327 0-15.13 6.855-15.13 15.202S56.83 95.58 65.157 95.58c7.007 0 12.907-4.87 14.618-11.382h13.851a3.796 3.796 0 0 0 3.706-3.883 3.795 3.795 0 0 0-3.706-3.714H79.782c-1.701-6.527-7.608-11.418-14.626-11.418zM6.029 76.602a3.8 3.8 0 0 0-3.52 4.062 3.8 3.8 0 0 0 3.882 3.535h36.412a22.5 22.5 0 0 1-.348-3.813c0-1.29.138-2.55.348-3.784H6.39a4 4 0 0 0-.362 0z" />
      </svg>
    ),
  },
  {
    title: "Security",
    description: "Your data is protected by the latest security measures.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full"
        viewBox="0 0 682.667 682.667"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="a" clipPathUnits="userSpaceOnUse">
            <path d="M0 512h512V0H0Z" />
          </clipPath>
        </defs>
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="40"
          clipPath="url(#a)"
          transform="matrix(1.33333 0 0 -1.33333 0 682.667)"
        >
          <path d="M256 492 60 410.623v-98.925C60 183.674 137.469 68.38 256 20c118.53 48.38 196 163.674 196 291.698v98.925z" />
          <path d="M178 271.894 233.894 216 334 316.105" />
        </g>
      </svg>
    ),
  },
  {
    title: "Support",
    description:
      "Our expert support team is available around the clock to assist you.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full fill-[#FAFAFA] dark:fill-[#FAFAFA]"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <path d="M495.984 252.588c-17.119-14.109-44.177-15.319-61.936 3.74l-44.087 47.327c-5.7-18.319-22.809-31.658-42.977-31.658h-78.675c-5.97 0-7.969-2.28-18.339-10.269-39.538-34.468-98.924-34.358-138.342.33L82.71 287.516c-12.999-6.88-28.178-7.05-41.248-.52L8.294 303.575c-7.41 3.71-10.409 12.719-6.71 20.129l89.995 179.989c3.71 7.41 12.719 10.409 20.129 6.71l33.168-16.589c16.349-8.169 25.448-24.849 24.858-41.827h177.249c32.868 0 64.276-15.699 83.995-41.997l72.006-96.014c13.969-18.61 11.759-45.899-7-61.388zM131.456 466.985l-19.749 9.879-76.585-153.16 19.759-9.879c7.41-3.7 16.409-.71 20.119 6.71l63.166 126.332c3.7 7.409.7 16.408-6.71 20.118zm347.529-171.009L406.98 391.99c-14.089 18.789-36.518 29.998-59.996 29.998H159.265l-56.207-112.423 28.388-24.988c28.248-24.849 70.846-24.849 99.094 0 16.639 14.649 26.988 17.419 37.768 17.419h78.675c8.27 0 14.999 6.73 14.999 14.999s-6.73 14.999-14.999 14.999h-76.605c-8.28 0-14.999 6.72-14.999 14.999s6.72 14.999 14.999 14.999h86.655c12.449 0 24.449-5.22 32.928-14.329l66.036-70.886c6.04-6.48 15.299-5.94 20.979-.97 5.939 5.199 6.58 14.089 2.009 20.169zm-163.6-193.609c10.269-10.769 16.599-25.328 16.599-41.358 0-33.018-26.678-60.996-59.996-60.996-33.068 0-60.996 27.928-60.996 60.996 0 15.539 6.09 30.208 17.149 41.478-27.428 15.379-47.147 44.897-47.147 79.515v14.999c0 8.279 6.72 14.999 14.999 14.999h150.991c8.279 0 14.999-6.72 14.999-14.999v-14.999c-.001-33.938-18.668-63.916-46.598-79.635zm-43.397-72.355c16.259 0 29.998 14.199 29.998 30.998 0 16.539-13.459 29.998-29.998 29.998-16.799 0-30.998-13.739-30.998-29.998 0-16.509 14.489-30.998 30.998-30.998zm-60.996 151.99c0-33.068 27.928-60.996 60.996-60.996 33.078 0 59.996 27.358 59.996 60.996H210.992z" />
      </svg>
    ),
  },
  {
    title: "Performance",
    description: "Experience blazing-fast performance with our product.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full fill-[#FAFAFA] dark:fill-[#FAFAFA]"
        viewBox="0 0 512 512"
        aria-hidden="true"
      >
        <path d="M451 257v215c0 22.5-14.1 40-32.1 40H375c-18 0-32.1-17.6-32.1-40V257c0-22.5 14.1-40 32.1-40h43.9c17.9 0 32.1 17.6 32.1 40zm.7-126.1c-3 2.1-6.9 2.2-10.1.3l-30-18C362.2 195 292.5 272 157.9 272c-28.4 0-59.7-3.4-94.3-11-5-1.1-8.2-6-7.2-11.1 1-4.6 5.2-7.7 9.9-7.3 8.4.7 203.6 13.8 285.6-166.7L321.2 61c-4.6-2.2-6.6-7.8-4.4-12.4 1-2.1 2.7-3.7 4.8-4.6L423.5.7c4.7-2 10.2.2 12.2 4.9.3.7.5 1.4.6 2.1l19.3 113.9c.7 3.6-.9 7.3-3.9 9.3zM310.1 336v136c0 22.5-14.1 40-32.1 40h-44c-18 0-32.1-17.6-32.1-40V336c0-22.5 14.1-40 32.1-40h43.9c18.1-.1 32.2 17.5 32.2 40zm-137.8 65.8V472c0 22.4-14.1 40-32.1 40h-44c-18 0-32.1-17.6-32.1-40v-70.2c0-22.5 14.1-40 32.1-40h43.9c18.1-.1 32.2 17.5 32.2 40z" />
      </svg>
    ),
  },
  {
    title: "Global Reach",
    description: "Whether you're a startup or enterprise. Add users, features.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full fill-[#FAFAFA] dark:fill-[#FAFAFA]"
        viewBox="0 0 25 25"
        aria-hidden="true"
      >
        <path d="M19.794 17.078a9.94 9.94 0 0 0 1.705-5.578c0-5.513-4.487-10-10-10s-10 4.487-10 10 4.486 10 10 10a9.94 9.94 0 0 0 5.573-1.702l3.14 3.14c.75.75 1.97.75 2.72 0 .76-.75.76-1.97 0-2.73zM11.499 19.5c-4.412 0-8-3.589-8-8s3.588-8 8-8 8 3.59 8 8-3.59 8-8 8" />
        <path d="M6.493 9.507h2v5.987h-2zm4.006-2h2v7.987h-2zm4.005 3.993h2v3.994h-2z" />
      </svg>
    ),
  },
  {
    title: "Communication",
    description:
      "Seamless communication for your team. Keep everyone connected and updates instantly",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-full fill-[#FAFAFA] dark:fill-[#FAFAFA]"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 3.5A8.5 8.5 0 0 0 3.5 12v7.75c0 .414.335.75.75.75H12a8.5 8.5 0 0 0 0-17M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.478 10-10 10H4.25A2.25 2.25 0 0 1 2 19.75zm5.25-2.266a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75m0 4.532a.75.75 0 0 1 .75-.75h4.508a.75.75 0 1 1 0 1.5H8a-.75-.75 0 0 1-.75-.75"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
				<div className="mx-auto mb-12 flex max-w-3xl flex-col items-center text-center md:mb-16">
					<h2 className="mb-5 font-heading text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight leading-[0.95] leading-tight text-[#FAFAFA] md:text-4xl">
						Work Easier Today
					</h2>

					<p className="max-w-2xl text-base leading-relaxed text-[#A1A1AA]">
						Unlock a world of possibilities with our exclusive features. Explore how our
						unique offerings can transform your journey and empower you to achieve more.
					</p>
				</div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[#27272A] bg-[#18181B] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#27272A] hover:bg-[#111113]/7"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#18181B] text-[#FAFAFA] dark:bg-neutral-700 dark:text-[#FAFAFA]">
                {feature.icon}
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-lg font-bold tracking-tight text-[#FAFAFA]">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-[#A1A1AA]">
                  {feature.description}
                </p>
              </div>

              <a
                href="#"
                className="mt-6 inline-flex items-center text-sm font-semibold text-[#FAFAFA] transition hover:text-[#A1A1AA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27272A] rounded"
              >
                Learn more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1.5 size-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m23.564 11.235-7.56-7.56a1.08 1.08 0 0 0-1.528 1.528l5.717 5.716H1.2a1.08 1.08 0 0 0 0 2.16h18.993l-5.717 5.716a1.08 1.08 0 1 0 1.528 1.528l7.56-7.56a1.08 1.08 0 0 0 0-1.528z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}