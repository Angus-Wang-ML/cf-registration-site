export async function onRequestPost({ request, env }) {
  try {
    // 取得表單資料
    const formData = await request.formData();
    const name = formData.get("name");
    const date = formData.get("date");

    console.log("Received form:", { name, date });

    // 檢查 D1 binding 是否存在
    if (!env.DB) {
      console.error("D1 binding 'DB' not found!");
      return new Response("報名失敗：資料庫尚未綁定", { status: 500 });
    }

    // 檢查必填欄位
    if (!name || !date) {
      console.error("Missing form data:", { name, date });
      return new Response("報名失敗：資料不完整", { status: 400 });
    }

    // 儲存到 D1
    const result = await env.DB.prepare(
      "INSERT INTO registrations (name, date) VALUES (?, ?)"
    )
      .bind(name, date)
      .run();

    console.log("Insert result:", result);

    return new Response(
      `報名成功！\n姓名：${name}\n日期：${date}`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (err) {
    console.error("Submit Error:", err);
    return new Response(
      `報名失敗，請稍後再試`,
      { status: 500 }
    );
  }
}
