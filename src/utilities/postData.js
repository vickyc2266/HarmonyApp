

async function postData(url = "", data = {}, mimetype = "application/json", timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);  
  const response = await fetch(url, {
      method: "POST",
      mode: "cors", 
      cache: "no-cache", 
      credentials: "same-origin",
      headers: {
        "Content-Type": mimetype
      },
      redirect: "follow", 
      referrerPolicy: "no-referrer", 
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(id);
    return response.json(); 
  }
  export default postData;
