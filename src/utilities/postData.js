async function postData(url = "", data = {}, mimetype = "application/json") {
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
    });
    return response.json(); 
  }
  export default postData;
