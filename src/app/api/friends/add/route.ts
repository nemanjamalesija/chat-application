export async function POST(req: Request) {
  const body = await req.json();

  console.log(body);

  console.log(process.env.UPSTASH_REST_URL);
}
