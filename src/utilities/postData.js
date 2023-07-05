

async function postData(url = "", data = {}, timeout = 8000) {
  var retries = 3
  var response;
  while(retries > 0 && !(response && response.ok)) {
    try{
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);  
      response = await fetch(url, {
          method: "POST",
          mode: "cors", 
          cache: "no-cache", 
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          redirect: "follow", 
          referrerPolicy: "no-referrer", 
          body: JSON.stringify(data),
          signal: controller.signal
         
        });
        clearTimeout(id);
     } catch (e) {
        console.log(e)
     } 
     retries --;
    }
    return response.json(); 
  }
  export default postData;
