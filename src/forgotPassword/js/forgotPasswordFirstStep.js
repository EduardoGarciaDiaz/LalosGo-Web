const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let authenticationCode; 
let userId;

    async function forgotPassword() {
        clearErrors();
        let email = document.getElementById('email_label').value;
        if(isClientEmailValid(email)){
            authenticationCode = generateAuthenticationCode();
            const response = await sendEmail(email, authenticationCode);
            if(response.status == 200){
                userId = response.data.userId;
                const modalElement = document.getElementById("authenticationCodeModal");
                const bootstrapModal = new bootstrap.Modal(modalElement);
                bootstrapModal.show();
            }
        }
    }

    async function sendEmail(email, authenticationCode){
        try {
            const emailRequest = {confirmationCode: authenticationCode, email: email}
            const response = await axios.post(`${API_URL}/users/password`, emailRequest);
            return response;
        }catch (error){
            if(error.response.status == 404){
                showToast("El email ingresado no se encuentra registrado", toastTypes.DANGER)
            } else {
                showToast("Ha ocurrido un error, por favor intente nuevamente", toastTypes.DANGER)
            }
        }
    }

    function confirmCode(){
        const code = document.getElementById('authenticationCodeInput').value;
        if(code == authenticationCode){
            sessionStorage.setItem('userId', userId);
            window.location.href = "http://127.0.0.1:5500/src/forgotPassword/changePassword.html";
        } else {
            showToast("Código incorrecto", toastTypes.DANGER)
        }
    }

    function clearErrors(){
        document.getElementById('email_label').classList.remove("is-invalid");
        document.getElementById('emailError').style.display = "none";
    }

    function isClientEmailValid(email){
        let isValid = true;
        if(!VALID_EMAIL.test(email)){
            document.getElementById('email_label').classList.add("is-invalid");
            document.getElementById('emailError').style.display = "block";
            isValid = false;
        }
        return isValid;
    }

    function generateAuthenticationCode(){
        return Math.floor(100000 + Math.random() * 900000);
    }
