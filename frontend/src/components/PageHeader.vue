<template>

<header id="header" class="header">
<!-- Logo and company name -->
    <h1 class="header__title"><img src="../assets/icon-left-font-monochrome-white.png" alt="Logo Groupomania white" class="header__logo"></h1>

  <!-- Navigation menu -->
    <nav class="header__nav">
        <div class="header__nav__image"><img :src="this.user.imageUrl" alt=" profil photo"></div>

        <button @click="ownerProfile()" class="header__nav__profile header__btn">
             profile
        </button>

        <button @click="userProfile()" class="header__nav_members header__btn">
            Members
        </button>

        <button @click="logout()" class="header__nav_logout header__btn">
            sign-out
        </button>
    </nav>
</header>

</template>

<script>

import axios from "axios"
import {mapActions} from 'vuex'

export default {
    name: 'PageHeader',

    data() {
        return {
            user: [],
        }
    },

    methods: {
        ...mapActions(["getUsers", "getPublications", "logout"]),

        ownerProfile() {
            this.$router.push("/profile");
        },

        userProfile() {
            this.$router.push("/users");

        }
    },

    mounted() {
        axios.get('/users/' + this.$store.state.userId)
            .then(res => {
                this.user = res.data;
            })
            .catch((err) => {
                console.log(err)
            }),

        this.getUsers()
    },
}
</script>

<style lang="scss">

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: auto;
    min-height: 100px;
    padding: 0 30px;
    background: linear-gradient(to top right, #e95de4, #122442);

    &__title {
        display: flex;
        align-items: center;
        height: 100px;
    }

    &__logo {
        height: 300%;
    }

    &__nav {
        display: flex;
        align-items: center;

        &__image {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            width: 50px;
            height: 50px;
            margin: 10px 20px;
            border: 1px solid #122442;
            border-radius: 26px;
        }

        & img {
            width: 100%;
        }

    }

    &__btn {
        width: 110px;
        height: 40px;
        margin: 10px 20px;
        padding: 5px;
        background: white;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;
        font-size: 20px;

        &:hover {
            transform: scale(1.1);
        };
    }
}

// Responsive tablet
@media screen and(max-width: 992px) {
    .header {
        flex-direction: column;
    }
}

// Responsive mobile
@media screen and(max-width: 768px) {
    a, p, label {
        font-size: 14px;
    }

    .header {
        position: relative;
        min-width: 380px;
        padding-bottom: 10px;

        &__title {
            align-self: flex-start;
        }

        &__logo {
            height: 250%;
        }

        &__nav {
            flex-wrap: wrap;
            justify-content: center;
            min-width: 380px;
            padding: 0 20px;
            &__image {
                position: absolute;
                top: 15px;
                right: 5px;
            }
        }

        &__btn {
            font-size: 14px;
        }
    }
}
</style>