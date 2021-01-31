const token = Cookies.get('login_token');
if(!token){
  window.location.href = "/login";
}else{
  fetch('/api/v1/auth/validate_jwt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token })
  })
  .then(response => {
    if(!response.ok){
      window.location.href = "/login";
    }
  })
}