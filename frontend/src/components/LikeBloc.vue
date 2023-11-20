<template>
    <div class="po__infos__likes">
        <!-- Bouton "like" -->
        <button @click="likePublication(publication.id, 1)" title="like" class="like-btn"><i class="far fa-thumbs-up like"></i></button>
        <p>{{ publication.likes }}</p>

        <!-- Bouton "dislike" -->
        <button @click="likePublication(publication.id, -1)" title="Dislike" class="like-btn"><i class="far fa-thumbs-down dislike"></i></button>
        <p>{{ publication.dislikes }}</p>

    </div>
</template>

<script>

import {mapActions} from 'vuex'
import axios from 'axios';

export default {
    name: 'LikeBloc',

    props: {
        publication: Object
    },

    methods: {
        ...mapActions(["getPublications"]),

        // Fonction like/dislike
        likePublication(publicationId, likeValue) {
            axios.post("/publications/like", {
                publicationId: publicationId,
                userId: parseInt(this.$store.state.userId),
                likeValue: likeValue
            })
                .then(() => {
                    this.getPublications();
                    location.reload()
                })
                .catch((error) => {
                    console.log(error);
                })
        },
    },

    mounted() {
        this.$store.dispatch("getOneUser");
    },

}

</script>

<style lang="scss">
    .po__infos__likes {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80px;
        font-size: 20px;

        & .like-btn {
            background: none;
            border: none;
        }

        & i {
            font-size: 22px;
            margin: 0 5px;
            cursor: pointer;

            &:hover {
                transform: scale(1.2);
                color: #1148a8;
            }
        }
    }
</style>