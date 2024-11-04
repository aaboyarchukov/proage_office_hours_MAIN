export default async function handler(req, res) {
  let { id, userID } = req.body;
  console.log(id, userID);
  let result = await fetch(`https://pro-age.ru:3000/officehours/cancel/${userID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.NEXT_PUBLIC_KEY,
    },
    body: JSON.stringify({
      "id": id
    })
  })
  result = result.status;
  res.status(result).json({ result });
}
