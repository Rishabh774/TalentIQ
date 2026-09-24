import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const response = await axiosInstance.post("/execute", { language, code });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || "Failed to execute code",
    };
  }
}
