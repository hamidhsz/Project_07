<template>
<div id="body">
    <!-- Login page header -->
    <header id="log-header" class="log-header">
        <h1 class="log-header__title"><img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania" class="log-header__logo"></h1>
        <nav class="log-header__nav">
            <button @click="loginWindow = true; signupWindow = false" class="log-header__nav__login header__btn">
                login
            </button>
            <button @click="loginWindow = false; signupWindow = true" class="log-header__nav_signup header__btn">
                Register
            </button>
        </nav>
    </header>

    <main id="main" class="main">
        
        <div v-if="loginWindow" class="main__form">
            <form method="post" @submit.prevent="login()">
                <div class="form">
                    <div>
                        <label for="email">Email</label>
                        <input id="email" class="form-input" type="email" name="email" placeholder="Email" v-model="email" aria-label="email" required>
                    </div>

                    <div>
                        <label for="password">password</label>
                        <input id="password" class="form-input" type="password" name="password" placeholder="password" v-model="password" aria-label="password" required>
                    </div>

                    <p class="signup-error" v-if="this.$store.state.errorMsg != null">{{ this.$store.state.errorMsg }}</p>
                </div>

                <button type="submit" class="form__btn">login</button>
            </form>

            <p>Not registered?<span><a href="#" @click="loginWindow = false; signupWindow = true">Register</a></span></p>
        </div>

        <!-- Bloc inscription -->
        <div v-if="signupWindow" class="main__form">
            <form method="post" @submit.prevent="signup()">
                <div class="form">
                    <div>
                        <label for="lastname">Last name</label>
                        <input id="lastname" class="form-input" type="text" name="lastname" placeholder="lastname" v-model="lastname" aria-label="lastname" required>
                    </div>

                    <div>
                        <label for="firstname">First name</label>
                        <input id="firstname" class="form-input" type="text" name="firstname" placeholder="firstname" v-model="firstname" aria-label="firstname" required>
                    </div>

                    <div>
                        <label for="email">Email</label>
                        <input id="email" class="form-input" type="email" name="email" placeholder="Email" v-model="email" aria-label="email" required>
                    </div>

                    <div>
                        <label for="password" id="pwLabel">Password</label>
                        <input id="password" class="form-input" type="password" name="password" placeholder="Password" v-model="password" aria-label="password" required>
                    </div>

                    <div>
                        <label for="passwordConfirm" id="pwConfirmLabel">Conform the Password</label>
                        <input id="passwordConfirm" class="form-input" type="password" name="passwordConfirm" placeholder="password" v-model="passwordConfirm" aria-label="Password confirmation " required>
                    </div>

                    <p class="signup-error" v-if="this.$store.state.errorMsg != null">{{ this.$store.state.errorMsg }}</p>
                </div>

                <button type="submit" class="form__btn">Register</button>
            </form>

            <p>Already registered?<span><a href="#" @click="loginWindow = true; signupWindow = false">Login</a></span></p>
        </div>
    </main>

    <!-- <PageFooter/> -->

</div>
</template>

<script>

import axios from "axios"
// import PageFooter from "../components/PageFooter.vue"

export default {
    data() {
        return {
            loginWindow: true,
            signupWindow: false,
            validPassword : false,
            lastname: null,
            firstname: null,
            email: null,
            password: null,
            passwordConfirm: null
        }
    },

    components: {
        // PageFooter
    },

    methods: {
     // Connection function
        login() {
            axios.post('/users/login', {
                email: this.email,
                password: this.password
            })
            .then((res) => {
                localStorage.setItem("user", res.data.userId);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("selectedUser", res.data.userId)
                this.$store.dispatch("getUserId", res.data.userId);
                this.$store.state.connectedUser = res.data.userId
                this.email = this.password = null;
                this.$router.push("/home")
            })
            .catch(() => {
                this.password = null;
                this.$store.state.errorMsg = "Incorrect email or password !"
            })
        },

       // Registration function
        signup() {
            let pwConfirmationLabel = document.getElementById("pwConfirmLabel");
            let pwConfirmationInput = document.getElementById('passwordConfirm');
            let pwInput = document.getElementById('password');

// We check the correspondence between the password and its confirmation
             // If they are not identical, an error message is returned
            if(pwConfirmationInput.value && pwInput.value && pwInput.value != pwConfirmationInput.value) {
                pwConfirmationLabel.style.color = 'red';
                pwConfirmationInput.focus();
                this.$store.state.errorMsg = "Invalid form";
                return

           // If they are identical, the new user is saved
            // His profile page is displayed
            } else {
                pwConfirmationLabel.style.color = 'initial';

                axios.post('/users/signup', {
                    lastname: this.lastname,
                    firstname: this.firstname,
                    email: this.email,
                    password: this.password
                })
                .then(() => {
                    this.login();
                })
                .catch(() => {
                    this.$store.state.errorMsg
                });
            }
        }
    },

    beforeCreate() {
        localStorage.clear()
    }
}
</script>

<style lang="scss">

.log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: auto;
    min-height: 100px;
    padding: 0 120px;
    background: linear-gradient(to top right, #e95de4, #122442);

    &__title {
        display: flex;
        align-items: center;
        height: 100px;
    }

    &__logo {
        height: 300%;
    };
}

.header {
    &__btn {
        width: 140px;
        margin: 10px 20px;
        padding: 5px;
        background: linear-gradient(to top left, #fff, #b3daee);
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 16px;

        &:hover {
            transform: scale(1.1);
        };
    }
}

.main {
    min-height: 700px;
    padding: 40px 0;
    /*background: url("../assets/icon.png") no-repeat center fixed ; */

    &__form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        // width: 400px;
        margin: 0 auto 50px auto;
        padding: 20px 20px;
        // background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 18px;

        & form {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }

}

.form {
    margin-bottom: 30px;

    &__btn {
        width: 140px;
        margin: 10px 20px;
        padding: 5px;
        background: green;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 16px;
        color: #fff;

        &:hover {
            transform: scale(1.1);
        };
    };

    & div {
        display: flex;
        flex-direction: column;

        & input {
            width: 250px;
            margin-top: 5px;
            margin-bottom: 20px;
            padding: 2px;
            font-size: 16px;
        }
    }

    & p {
        margin-top: 20px;
        font-style: italic;
    }

    & .signup-error {
        text-align: center;
    }
}

// Responsive mobile
@media screen and (max-width: 768px) {
    a, p, label {
        font-size: 14px;
    }

    #body {
        min-width: 380px;
    }

    #log-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 180px;
        padding: 0 0 20px 0;

        & button {
            font-size: 14px;
        }
    }

    .main {
        min-height: 600px;
        background-size: contain;
        &__form {
            width: 100%;

            & .form-input, .form__btn {
                font-size: 14px;
            }
        }
    }

}

</style>