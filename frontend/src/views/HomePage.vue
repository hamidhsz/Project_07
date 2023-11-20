<template>

<div>
    <PageHeader/>

    <main id="main" class="main main-home">

       <!-- Publication creation block -->
        <section class="publish">
            <form class="publish__form" @submit.prevent="createPublication()">
                <div class="publish__preview" v-if="imagePreview">
                    <img :src="imagePreview" alt="Image Preview" class="publish__newImage">
                </div>

                <div class="publish__form">
                    <textarea type="text" placeholder="New release..." aria-label="texte de la publication" v-model="content" class="publish__input" required></textarea>

                    <input type="file" name="image" accept=".png, .jpg, .jpeg, .gif" id="image-input" @change="uploadImage()" aria-label="Choose a picture">
                </div>

                <button type="submit" class="form__btn">Publish</button>
            </form>
        </section>

        <div>
            <PublicationBloc v-for="publication in showPublications" :key="publication.id" :publication="publication"/>
        </div>
    </main>

    <!-- <PageFooter/> -->
</div>

</template>

<script>

import axios from "axios";
import PageHeader from "../components/PageHeader.vue";
// import PageFooter from "../components/PageFooter.vue";
import PublicationBloc from "../components/PublicationBloc.vue";
import {mapActions, mapGetters} from 'vuex';

export default {
    data() {
        return {
            imagePreview: null,
            imageFile: null,
            content: null,
        }
    },

    components: {
        PageHeader,
        // PageFooter,
        PublicationBloc
    },

    computed: {
        ...mapGetters(["showPublications"])
    },

    methods: {
        ...mapActions(["getPublications", "getUsers", "findUser", "findUserPublications"]),

        // Function to import an image
        uploadImage() {
            let inputFile = document.querySelector("#image-input");

            this.imageFile = inputFile.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(this.imageFile);
        },

      // Publication creation function
        createPublication() {
            const formData = new FormData();
            if(!this.imageFile && !this.content) {
                return
            } else {
                formData.append("userId", this.$store.state.userId);
                formData.append("content", this.content);
                // If the post contains an image
                if(this.imageFile) {
                    formData.append("image", this.imageFile);
                }

                console.log(formData)
               // We send the request
                axios.post("/publications/", formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                })
                    .then(() => {
                        this.getPublications();
                        this.imageFile = null;
                        this.content = null;
                        this.imagePreview = null;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    },

    created() {
        this.findUser()
        this.findUserPublications()
    },

    mounted() {
        this.getPublications();
        this.$store.dispatch("auth")
    }
}
</script>

<style lang="scss">

.main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.publish {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    padding: 20px 20px;
    margin-bottom: 40px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    & form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    &__preview {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 40%;
        height: max-content;
        margin-bottom: 20px;
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;

        & img {
            width: 100%;
        }
    }

    &__form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 20px;
    }

    &__input {
        width: 100%;
        height: 76px;
        margin-bottom: 10px;
    }
}

// Responsive tablet
@media screen and(max-width: 992px) {
    .main-home {
        padding-bottom: 0;
    }
    .publish {
        width: 100%;

        &__form{
            margin: 0;

            & input, textarea, button {
                font-size: 14px;
            }

            & button {
                margin-bottom: 0;
            }
        }
    }
}

//Responsive mobile
@media screen and(max-width: 768px) {
    .main-home {
        padding: 30px 30px 0 30px;
    }
}

</style>

