document.getElementById("loginform").addEventListener("submit",async (e)=>
{
    e.preventDefault()
    const emorph=document.getElementById("emorph").value 
    const password=document.getElementById("password").value

    const res=await fetch("http://localhost:4000/login",
        {
            method:"POST",
            headers:
            {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({emorph,password})
        }
    )
    const data= await res.json()
    alert(data.message)
    if(res.status===200)
    {
        localStorage.setItem("username",data.name)
        localStorage.setItem("userphone",data.phone)
        window.location.href =
        `chat.html?name=${encodeURIComponent(data.name)}&phone=${encodeURIComponent(data.phone)}`;

    }
})