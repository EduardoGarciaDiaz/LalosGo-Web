const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function forgotPassword() {
        clearErrors();
        let email = document.getElementById('email_label').value;
        if(isClientEmailValid(email)){
            const modalElement = document.getElementById("authenticationCodeModal");
            const bootstrapModal = new bootstrap.Modal(modalElement);
            bootstrapModal.show();
        }
    }

    function clearErrors(){
        document.getElementById('email_label').classList.remove("is-invalid");
    }

    function isClientEmailValid(email){
        let isValid = true;

        if(!VALID_EMAIL.test(email)){
            document.getElementById('email_label').classList.add("is-invalid");
            isValid = false;
        }
        return isValid;
    }

    function generateAuthenticationCode(){
        return Math.floor(100000 + Math.random() * 900000);
    }

