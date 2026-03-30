export default async function handler(req: any, res: any) {
  try {
    const response = await fetch(
      "https://goldtraders.or.th/api/GoldPrices/details?readjson=false"
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*"); // 🔥 allow frontend
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gold price" });
  }
}