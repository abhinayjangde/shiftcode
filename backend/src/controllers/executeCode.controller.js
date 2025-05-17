import { pollBatchResults, submitBatch } from "../libs/judge0.js";

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  try {
    const userId = req.user.id;

    // validate testcases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid or Missing testcases",
      });
    }

    // prepare each testcases for judg0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send bactch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // poll judge0 for results of all submitted testcases
    const results = await pollBatchResults(tokens);

    // analyze test results
    
    console.log("Result ----------");
    console.log(results);

    return res.status(200).json({
      success: true,
      message: "Code executed!",
    });
  } catch (error) {
    console.error("Error executing code:", error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
};
