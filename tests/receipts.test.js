const request = require("supertest");
const app = require("../app");

describe("Receipts API", () => {
  let receiptId;

  test("POST /receipts/process - Valid receipt", async () => {
    const response = await request(app)
      .post("/receipts/process")
      .send({
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
          {
            shortDescription: "Mountain Dew 12PK",
            price: "6.49",
          },
          {
            shortDescription: "Emils Cheese Pizza",
            price: "12.25",
          },
          {
            shortDescription: "Knorr Creamy Chicken",
            price: "1.26",
          },
          {
            shortDescription: "Doritos Nacho Cheese",
            price: "3.35",
          },
          {
            shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
            price: "12.00",
          },
        ],
        total: "35.35",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    receiptId = response.body.id;
  });

  test("GET /receipts/:id/points - Valid ID", async () => {
    const response = await request(app).get(`/receipts/${receiptId}/points`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("points", 28); // Based on the example
  });

  test("GET /receipts/:id/points - Invalid ID", async () => {
    const response = await request(app).get("/receipts/invalid-id/points");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Receipt not found");
  });

  test("POST /receipts/process - Invalid receipt (missing fields)", async () => {
    const response = await request(app).post("/receipts/process").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid receipt format");
  });

  test("POST /receipts/process - Test points calculation rules", async () => {
    const response = await request(app)
      .post("/receipts/process")
      .send({
        retailer: "M&M Corner Market",
        purchaseDate: "2022-03-20",
        purchaseTime: "14:33",
        items: [
          {
            shortDescription: "Gatorade",
            price: "2.25",
          },
          {
            shortDescription: "Gatorade",
            price: "2.25",
          },
          {
            shortDescription: "Gatorade",
            price: "2.25",
          },
          {
            shortDescription: "Gatorade",
            price: "2.25",
          },
        ],
        total: "9.00",
      });

    expect(response.status).toBe(200);
    const receiptId = response.body.id;

    const pointsResponse = await request(app).get(
      `/receipts/${receiptId}/points`
    );
    expect(pointsResponse.status).toBe(200);
    expect(pointsResponse.body.points).toBe(109);
  });
});
