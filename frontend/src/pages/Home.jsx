import { Link } from "react-router-dom";


export default function Home() {
   const Features = [
    {
      heading: "Competitive Coding Contests",
      description:
        "Participate in challenging coding contests regularly, testing your skills against the best. Improve your problem-solving abilities and climb the leaderboards with each competition.",
    },
    {
      heading: "Real-Time Leaderboards",
      description:
        "Track your progress with dynamic leaderboards that update in real-time. See where you stand in the global coding community and strive to improve your rank.",
    },
    {
      heading: "Vast Problem Library",
      description:
        "Access a diverse collection of coding problems across various topics and difficulty levels. Challenge yourself with beginner to expert-level tasks and enhance your coding skills.",
    },
    {
      heading: "Detailed Problem Descriptions",
      description:
        "Each problem comes with clear and comprehensive descriptions, including input/output examples. Understand the task at hand and approach each problem with confidence.",
    },
    {
      heading: "Seamless Coding",
      description:
        "Code directly on the platform with our interactive coding environment. Write, test, and submit your solutions seamlessly without needing any external tools.",
    },
    {
      heading: "Multilingual Support",
      description:
        "Solve problems using your preferred programming language. Our platform supports multiple languages, allowing you to code comfortably in the language you excel at.",
    },
  ];

  return (
    <>
      <section className="min-h-screen flex flex-col items-center bg-dark dark:bg-dark md:m-0 py-10 md:py-20">
        <div className="mx-auto px-4 md:px-6 flex flex-col justify-center items-center gap-0">
          <div className="flex flex-col justify-center text-center gap-3 ">
            <div className="text-5xl uppercase md:text-6xl font-bold">
              Conquer the Code at
            </div>
            <div className="text-5xl md:text-6xl text-[#4E7AFF] font-bold uppercase leading-tight">
              Codeside
            </div>
            <div className="text-md text-gray-900 dark:text-gray-300">
              Join elite coders, solve problems, and climb leaderboards at
              Codeside Arena{" "}
            </div>
            <div className="flex justify-center flex-col md:flex-row gap-4 mt-4">
              <Link
                to={"/arena"}
                className="border-[1px] text-white border-gray-600 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-sm"
              >
                Start Solving{" "}
              </Link>
              <Link
                to={"/#features"}
                className="border-[1px] border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800  px-4 py-2 rounded-sm"
              >
                Explore Features
              </Link>
            </div>
          </div>
          <div className="">
            {/* Light Mode Image */}
            <img
              className="block dark:hidden "
              src="/HeroSectionLightImage.svg"
              alt="Light mode hero image"
              width={980}
              height={980}
            />
            {/* Dark Mode Image */}
            <img
              className="hidden dark:block "
              src="/HeroSectionDarkImage.svg"
              alt="Dark mode hero image"
              width={980}
              height={980}
            />
          </div>
        </div>

        {/* {problems.length > 0 ? (
        <ProblemsTable problems={problems} />
      ) : (
        <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
        No problems found
        </p>
        )} */}
      </section>
      <section
      className="bg-white dark:bg-[#020817] py-6 md:py-10 "
      id="features"
    >
      <div className="flex flex-col items-center m-auto text-center gap-4 max-w-[1024px]">
        <div className="text-5xl font-bold">
          Platform <span className="text-[#4E7AFF]">Features</span>
        </div>
        <div className="text-sm text-gray-900 dark:text-gray-300 w-full md:w-2/3">
          Unlock the Full Potential of Competitive Programming with These Key
          Features
        </div>
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 p-2 ">
          {Features.map((feature, index) => (
            <div
              className={`border-[1px] rounded-md p-2 text-start gap-2 flex flex-col  ${
                index % 2 === 0 ? "mr-0" : "ml-0"
              }`}
              key={index}
            >
              <div className="flex gap-2 items-center">
                <div>
                  <img
                    width={20}
                    height={20}
                    src="/LinkArrowFeature.svg"
                    alt="back"
                  />
                </div>
                <div className="font-bold">{feature.heading}</div>
              </div>
              <div className="text-gray-500">{feature.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
