const createAccountButton = document.getElementById('create-account')
if (createAccountButton !== null) {
  createAccountButton.addEventListener('click', (ev) => {
    window.location.href = '/user/new'
  })
}
