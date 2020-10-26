<template>
  <div
    class="login-wrap"
    v-loading="btnloading"
    element-loading-text="登录中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div>
      <div class="login-title">
        <span>后台管理系统</span>
      </div>
      <div class="login-content">
        <img class="left-top-jiao" src="../../images/login/jiao.png" alt="角" />
        <img
          class="right-top-jiao"
          src="../../images/login/jiao.png"
          alt="角"
        />
        <img
          class="left-bottom-jiao"
          src="../../images/login/jiao.png"
          alt="角"
        />
        <img
          class="right-bottom-jiao"
          src="../../images/login/jiao.png"
          alt="角"
        />
        <div class="content-input">
          <el-form :model="param" :rules="rules" ref="login">
            <el-form-item prop="userName">
              <div class="input-item-box">
                <img src="../../images/login/user.png" alt="user" />
                <input
                  v-model="param.userName"
                  placeholder="请输入您的账号"
                  type="text"
                />
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="input-item-box mar-top">
                <img src="../../images/login/password.png" alt="password" />
                <input
                  v-model="param.password"
                  placeholder="请输入您密码"
                  type="password"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                style="background-color: #009dff; border-color: #009dff"
                type="primary"
                :loading="btnloading"
                @click="submitForm"
                class="btn-login mar-top"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/api/index";
import { saveToken } from "../../utils/cookie";
export default {
  data: function () {
    return {
      param: {
        password: "111111",
        userName: "root",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      btnloading: false,
    };
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(async (valid) => {
        if (valid) {
          this.param.loginType = true;
          this.btnloading = true;
          userLogin(this.param)
            .then(async (res) => {
              if (res.code === 200) {
                await saveToken("Access-Token", res.data.token);
                await saveToken("userName", res.data.name);
                this.$message.success("登录成功");
                this.btnloading = false;
                this.$router.push("/info");
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(() => {
              this.btnloading = false;
            });
        } else {
          this.$message.error("请输入账号和密码");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("../../images/login/login-bg.png");
  background-size: cover;
  @include flex(column, center, center);
}
.login-content {
  position: relative;
  width: 450px;
  height: 326px;
  background-color: rgba(56, 173, 228, 0.4);
}
.content-input {
  padding: 50px;
}
.left-top-jiao {
  position: absolute;
  left: 0;
  top: 0;
}
.left-bottom-jiao {
  transform: rotate(270deg);
  position: absolute;
  left: 0;
  bottom: 0;
}
.right-top-jiao {
  transform: rotate(90deg);
  position: absolute;
  right: 0;
  top: 0;
}
.right-bottom-jiao {
  transform: rotate(180deg);
  position: absolute;
  right: 0;
  bottom: 0;
}
.input-item-box {
  @include flex(row, center, space-between);
  background-color: rgba(106, 182, 218, 0.4);
  border-radius: 4px;
  img {
    margin-left: 10px;
    width: 30px;
    height: 30px;
  }
  input {
    width: 300px;
    height: 50px;
    border: none;
    outline-style: none;
    font-size: 20px;
    background-color: transparent;
    color: #fff;
  }
}
input::-webkit-input-placeholder {
  font-size: 16px;
  color: #fff;
}
.btn-login {
  width: 100%;
  height: 50px;
  font-size: 20px;
  letter-spacing: 10px;
}
.mar-top {
  margin-top: 20px;
}
.login-title {
  text-align: center;
  padding-bottom: 14px;
  span {
    font-size: 34px;
    font-weight: bold;
    color: #adedff;
    letter-spacing: 10px;
  }
}
</style>