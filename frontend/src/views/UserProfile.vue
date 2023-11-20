<template>

<div>
    <PageHeader/>

    <main id="main" class="main">

    <div class="members">
       <!-- Searching for users -->
        <aside class="search">
            <button @click="returnHome()" class="close-btn" title="Close search window">X</button>

           <!-- Search field -->
            <div class="search__members">
                <label for="search__members__input">Search for members</label>

                <div class="search__input">
                    <input type="search" v-model="searchInput" name="search" id="search__members__input" class="search__members__input" aria-label="search for members" placeholder="Research..." @input="searchUsers()">
                </div>
            </div>

           <!-- Search results -->
            <div class="search__results">
                <div v-for="user in searchResults" :key="user.id">
                    <p class="search__results__image"><img :src="user.imageUrl" alt="member profile picture"></p>

                    <a href="#" @click="selectUser(user)">{{ user.lastname }} {{ user.firstname }}</a>
                </div>
            </div>
        </aside>

<!-- Display profile and publications of the selected user -->
        <section class="member">
          <!-- User profile display -->
            <div class="member__profile">
                <div class="member__profile__image">
                    <img :src="this.$store.state.selectedUser.imageUrl" alt="user image">
                </div>

                <div class="member__profile__infos">
                    <div class="mpi__name">
                        <p class="mpi__firstname">{{ this.$store.state.selectedUser.firstname }}</p>

                        <p class="mpi__lastname">{{ this.$store.state.selectedUser.lastname }}</p>
                    </div>

                    <p class="mpi__description">{{ this.$store.state.selectedUser.description }}</p>
                </div>

                <button @click="deleteUser()" class="delete-btn delete-user" v-if="this.$store.state.connectedUser != null && (this.$store.state.connectedUser.id == this.$store.state.selectedUser.id || this.$store.state.connectedUser.isAdmin == true)" title="Delete user account"><i class="far fa-trash-alt"></i></button>
            </div>

         <!-- Display of user posts -->
            <PublicationBloc v-for="publication in showSelectedUserPublications" :key="publication.id" :publication="publication"/>

        </section>

    </div>
    </main>

    <!-- <PageFooter/> -->
</div>

</template>

<script>

import axios from 'axios';
import PageHeader from "../components/PageHeader.vue";
// import PageFooter from "../components/PageFooter.vue";
import PublicationBloc from "../components/PublicationBloc.vue";
import router from '../router'
import Swal from 'sweetalert2';
import {mapActions, mapGetters} from 'vuex';

export default {
    data() {
        return {
            searchResults: [],
            searchInput: "",
            isUserSelected: false,
        }
    },

    components: {
        PageHeader,
        // PageFooter,
        PublicationBloc,
    },

    computed: {
        ...mapGetters(
            [
                'showPublications',
                'showUsers',
                'showSelectedUserPublications',
            ])
    },

    methods: {
        ...mapActions(['getUsers' , 'getPublications', 'findUser', 'findUserPublications']),

       // Return to homepage function
        returnHome() {
            this.$router.push("/home")
        },

        // Fonction recherche utilisateurs
        searchUsers() {
            const element = this.searchInput;
            this.searchResults = this.showUsers.filter(user => user.lastname.toLowerCase().includes(element) || user.firstname.toLowerCase().includes(element));

            return
        },

        // User search function
        selectUser(user) {
            this.isUserSelected = true;
            this.$store.state.selectedUser = user;
            localStorage.setItem("selectedUser", user.id)
            this.showUserPublications(user.id)
        },

// Retrieve the publications of the selected user
        showUserPublications(idUser) {
            const userId = idUser;
            this.$store.state.selectedUserPublications = this.showPublications.filter(publication => publication.userId.toString().includes(userId));

            return
        },

    // Function delete a user
        deleteUser() {
            Swal.fire({
                title: "Confirm account deletion :",
                text: this.$store.state.selectedUser.firstname + " " + this.$store.state.selectedUser.lastname,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                confirmButtonColor: "#32c068",
                cancelButtonText: "No",
                cancelButtonColor: "#e24b43",
            })
            .then((response) => {
                if (response.isConfirmed) {
                axios.delete("/users/" + this.$store.state.selectedUser.id)
                .then(() => {
                   // If the account owner requests
                    if(this.$store.state.selectedUser.id == this.$store.state.connectedUser.id) {
                        Swal.fire({
                            title: "Your account has been deleted",
                            icon: "success",
                            confirmButtonText: "Ok",
                            confirmButtonColor: "#32c068",
                        })
                        // We reset the store and we disconnect it
                        let state = this.$store.state;
                        let initialState = {};
                        Object.keys(state).forEach((key) => {
                            initialState[key] = null;
                        });
                        this.$store.replaceState(initialState);
                        localStorage.clear();
                        router.push("/");
                   // If it's an admin account that doesn't own the account
                    } else {
                        Swal.fire({
                            title: "The account of " + this.$store.state.selectedUser.firstname + " " + this.$store.state.selectedUser.lastname + " has been deleted",
                            icon: "success",
                            confirmButtonText: "Back to the homepage",
                            confirmButtonColor: "#32c068",
                        });
                        localStorage.setItem("selectedUser", this.$store.state.connectedUser.id);
                        router.push("/home");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
                }
            });
        },
    },

    created() {
        this.findUser();
        this.findUserPublications();
    },

    mounted() {
        this.getPublications();
        this.searchUsers();
        this.getUsers();
        this.$store.dispatch("auth")
    },

    beforeUpdate() {
        this.searchUsers();
    },
}
</script>

<style lang="scss">

.main {
    min-width: 380px;
}

.members {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px 40px;
}

.search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    height: fit-content;
    margin-right: 40px;
    padding: 20px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    & .close-btn {
        align-self: flex-end;
        margin: 0 0 20px 0;
    }

    &__members {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 10px;

        & div {
            display: flex;
            align-items: center;
        }

        &__input {
            width: 100%;
        }
    }

    &__input {
        display: flex;
        align-items: center;
        padding-top: 5px;
    }

    &__results {
        display: flex;
        flex-direction: column;
        width: 100%;

        & div {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
        }

        &__image {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 40px;
            height: 40px;
            min-width: 40px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 20px;

            & img {
                width: 100%;
            }
        }
    }
}

.member {
    display: flex;
    flex-direction: column;
    width: 65%;

    &__profile {
        position: relative;
        display: flex;
        width: 100%;
        margin-bottom: 40px;
        padding: 20px;
        background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;

        &__image {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: auto;
            max-width: 300px;
            height: max-content;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 10px;

            & img {
                width: 100%;
            }
        }

        &__infos {
            display: flex;
            flex-direction: column;
            width: 100%;

            & .mpi {
                &__name {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    margin-bottom: 20px;
                }

                &__lastname, &__firstname {
                    margin-right: 10px;
                    font-size: 22px;
                    font-weight: bold;
                }

                &__description {
                    font-size: 18px;
                }
            }

        }

        & .delete-user {
            position: absolute;
            right: 20px;
        }
    }

    & .publication {
        width: 100%;

        & .po__publication{
            position: relative;
        }

        & .delete-publication {
            position: absolute;
            top: 5px;
            right: 0;
        }
    }
}

// Responsive tablet
@media screen and(max-width: 992px) {
    .members {
        padding: 0;
    }

    .search {
        width: 30%;
        margin-right: 40px;
    }

    .member {
        width: 65%;
        & .mpi {
            &__firstname, &__lastname {
            font-size: 20px;
            }

            &__description {
                font-size: 16px;
            }
        }

        & .po {
            &__publication {
                &__text {
                    padding-right: 20px;
                }
            }
        }
    }
}

// Responsive mobile
@media screen and(max-width: 768px) {
    .members {
        flex-direction: column;
        align-items: center;

        & i {
            font-size: 18px;
        }

        & .search {
            width: 100%;
            margin: 0 0 40px 0;

            & .close-btn {
                margin: 0;
            }

            &__members {
                &__input {
                    font-size: 14px;
                }
            }

            &__results {
                max-height: 140px;
                overflow: scroll;
            }
        }

        & .member {
            width: 100%;
            &__profile {
                &__image {
                    max-width: 40%;
                }
            }
        }

        & .mpi {
            &__firstname, &__lastname {
            font-size: 18px;
        }

            &__description {
                font-size: 14px;
            }
        }
    }
}
</style>