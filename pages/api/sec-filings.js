export default function handler(req, res) {
  res.status(200).json([
    {
      company: "Tesla Inc",
      insider: "Elon Musk",
      transaction_type: "buy",
      amount: 1500000,
      role: "CEO",
      date: new Date().toISOString()
    }
  ]);
}
