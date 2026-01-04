export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const date = formData.get("date");

    // 將資料存入 D1
    await env.DB.prepare(
      "INSERT INTO registrations (name, date) VALUES (?, ?)"
    )
      .bind(name, date)
      .run();

    return new Response(
      `報名成功！\n姓名：${name}\n日期：${date}`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      `報名失敗，請稍後再試`,
      { status: 500 }
    );
  }
}
