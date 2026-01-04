export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const date = formData.get("date");
    const token = formData.get("cf-turnstile-response"); // Turnstile token

    console.log("Received form:", { name, date, token });

    if (!name || !date || !token) {
      return new Response("請完成所有欄位與驗證", { status: 400 });
    }

    // Turnstile 驗證
    const verifyResp = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET, // Secret Key 綁在 Pages Function
          response: token
        })
      }
    );

    const verifyData = await verifyResp.json();
    if (!verifyData.success) {
      console.error("Turnstile failed:", verifyData);
      return new Response("驗證失敗，請重試", { status: 400 });
    }

    // D1 儲存
    const result = await env.DB.prepare(
      "INSERT INTO registrations (name, date) VALUES (?, ?)"
    ).bind(name, date).run();

    console.log("Insert result:", result);

    return new Response(
      `報名成功！\n姓名：${name}\n日期：${date}`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );

  } catch (err) {
    console.error("Submit Error:", err);
    return new Response("報名失敗，請稍後再試", { status: 500 });
  }
}
