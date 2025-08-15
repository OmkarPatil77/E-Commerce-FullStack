import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const testSuccess = (req, res) => {
    const data = {
        user: "Captain",
        message: "Testing executed successfully!"
    };
    res
    .status(200)
    .json(new ApiResponse(200, data, "Test Passes Successfully"));
};

const testFailure = (req, res) => {
    throw new ApiError(400, "Testing Failed!")
}

export { testSuccess, testFailure };