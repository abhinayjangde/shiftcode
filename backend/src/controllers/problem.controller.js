import { db } from "../libs/db.js";
import {
  pollBatchResults,
  submitBatch,
  getJudge0LanguageId,
} from "../libs/judge0.js";


export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //check user role
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to create a problem",
    });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submissions);

      // judge0 returns array of tokens
      const tokens = submissionResult.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({
              error: `Testcase ${i + 1} failed for langauge ${language}`,
            });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "New Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        success: false,
        error: "No problem found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All problem fetched successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Error while fetching all problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    if (!problem) {
      return res.status(401).json({
        error: "Problem not found",
      });
    }
    return res.status(200).json({
      success: true,
      messsage: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem by id",
    });
  }
};

// update problem
export const updateProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //check user role
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to create a problem",
    });
  }

  const {id} = req.params;
  const isProblemExists = await db.problem.findUnique({where:{id}})

  if(!isProblemExists){
    return res.status(404).json({
      success: false,
      error: "Problem not found, invalid problem id"
    })
  }


  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submissions);

      // judge0 returns array of tokens
      const tokens = submissionResult.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({
              error: `Testcase ${i + 1} failed for langauge ${language}`,
            });
        }
      }
    }

    const updatedProblem = await db.problem.update({
      where:{
        id
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error while updating problem."
    })
  }
};

// delete problems
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    await db.problem.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};

// get solved problem by user
export const getSolvedProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems :", error);
    return res.status(500).json({ error: "Failed to fetch problems" });
  }
};
