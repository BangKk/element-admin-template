<template>
  <div class="home">
    <h1>{{ $t('views.home') }}</h1>
    <el-date-picker
      type="datetime" />
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {};
  }
};
</script>
