const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    );

    console.log("confidenceScore:", confidenceScore);
    console.log("label:", label);
    console.log("suggestion:", suggestion);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      // confidenceScore: confidenceScore,
      createdAt: createdAt,
    };

    await storeData(id, data); //storeData

    const response = h.response({
      status: "success",
      message:
        confidenceScore > 99
          ? "Model is predicted successfully"
          : "Model is predicted successfully",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
    response.code(400);
    return response;
  }
}

module.exports = postPredictHandler;
