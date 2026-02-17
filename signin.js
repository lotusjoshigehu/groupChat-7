document.getElementById("signinform").addEventListener("submit",async(e)=>
{

    e.preventDefault()
    const name=document.getElementById("name").value;
    const phone=document.getElementById("phone").value
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    const res=await fetch("http://localhost:4000/signup",
        {
            method:"POST",
            headers:
            {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({name,phone,email,password})
        }
    )
    const data=await res.json()
    alert(data.message)

    if(res.status===201 || res.status==409)
    {
       window.location="login.html"
    }
})