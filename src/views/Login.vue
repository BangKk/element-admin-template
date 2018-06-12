<template>
  <el-dialog
    :title="$t('viewLogin.login')"
    width="450px"
    :visible.sync="visible"
    :modal-append-to-body="false"
    :before-close="closeModalHandle"
    center>
    <el-form label-position="right" label-width="80px" :model="user" :rules="rules" ref="user" @keydown.enter.native="login">
      <el-form-item :label="$t('viewLogin.account')" prop="username">
        <el-input v-model="user.username" name="username" :placeholder="$t('viewLogin.accountPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('viewLogin.password')" prop="password">
        <el-input
          type="password"
          name="password"
          :placeholder="$t('viewLogin.password')"
          v-model="user.password" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="login">{{ $t('viewLogin.submit') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import apis from '@/apis';
export default {
  data() {
    return {
      user: {
        password: '',
        username: ''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        username: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      },
      visible: true,
      closeable: false
    };
  },
  methods: {
    login() {
      this.$refs.user.validate(valid => {
        if (valid) {
          apis.login(this.user).then(res => {
            window.user = res;
            this.$bus.emit('login', res);
          });
        } else {
          return false;
        }
      });
    },
    closeModalHandle(done) {
      return true;
    }
  }
};
</script>
