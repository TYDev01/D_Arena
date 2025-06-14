import {
    Form,
    redirect,
    useActionData,
    useNavigate
} from "react-router-dom";

export async function loginAction({ request }) {

  const formData = await request.formData();
  const username = formData.get("username").trim();  

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (response.ok) {
    localStorage.setItem('username', username);
    console.log('Local ooo');
    return redirect('/browser');
  } else {
    return await response.text();
  }
}