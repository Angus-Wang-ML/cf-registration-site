export async function onRequestPost({ request }) {
  const formData = await request.formData();

  const date = formData.get("date");
  const name = formData.get("name");

  console.log("New registration:", date, name);

  return new Response(
    `報名成功！\n日期：${date}\n姓名：${name}`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
