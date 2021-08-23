<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts" />
  </div>
</template>

<script>
import PostList from '@/components/Posts/PostList'

export default {
  middleware: 'log-mid',
  components: { PostList },
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts
    },
  },
}
</script>

<style scoped>
.posts-page {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
