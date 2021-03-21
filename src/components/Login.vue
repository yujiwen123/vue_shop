<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区 -->
      <div class="avatar-box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button class="loginbtn" @click="login" type="primary">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-container",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginFormRules: {
        // 用户名输入规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 密码输入规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  components: {},
  methods: {
    // 点击重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 方法一
      /* this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = await this.$http.post("login", this.loginForm);
        console.log(res);
      }); */

      // 方法二
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return;
        const { data: res } = this.$http
          .post("login", this.loginForm)
          .then(({ data: res }) => {
            if (res.meta.status !== 200)
              return this.$message({
                showClose: true,
                message: "登录失败",
                type: "error"
              });
            this.$message({
              showClose: true,
              message: "登录成功",
              type: "success"
            });
            // 1.将登录成功之后的token, 保存到客户端的sessilnStorage 中
            //   1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
            //   1.2 token只应在当前网站J开期间生效，所以将token 保存在sessionStorage 中
            console.log(res)
            window.sessionStorage.setItem('token', res.data.token)
            // 2.通过编程式导航跳转到后台主页，路由地址是/home
            this.$router.push('/home')
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    margin: 0 auto;
    transform: translate(0, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form {
    width: 70%;
    margin: -55px auto 0px;
  }
  .btns {
    display: flex;
    justify-content: space-around;
    .loginbtn {
      margin-right: 60px;
    }
  }
}
</style>
