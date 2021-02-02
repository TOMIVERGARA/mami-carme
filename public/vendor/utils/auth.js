const token = Cookies.get('login_token');
if(!token){
  const currentLocation = window.location.href;
  window.location.href = `/login?redirect=${currentLocation}`;
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
      const currentLocation = window.location.href;
      window.location.href = `/login?redirect=${currentLocation}`;
    }
  })
}