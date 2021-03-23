<template>
  <!-- 用户列表区 -->
  <el-table :data="userslist" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态" prop="mg_state">
      <template slot-scope="scope">
        <!-- {{scope.row}}  //这一行的具体数据 -->
        <el-switch
          @change="userStateChanged(scope.row)"
          v-model="scope.row.mg_state"
          active-color="#409eff"
        ></el-switch>
      </template>
    </el-table-column>
    <!-- 按钮区 -->
    <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- 修改按钮 -->
        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
          <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit"></el-button>
        </el-tooltip>
        <!-- 删除按钮 -->
        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
          <el-button type="danger" icon="el-icon-delete"></el-button>
        </el-tooltip>
        <!-- 分配角色 -->
        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting"></el-button>
        </el-tooltip>
        <!-- 弹出对话框区 -->
        <!-- 修改用户的对话框 -->
          <el-dialog
            @close="editDialogClosed"
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="50%"
          >
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
          </el-dialog>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: '',
  data() {
    // 电话的验证规则
    const checkMobile = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    // 邮箱的验证规则
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      // 控制修改对话框是否显示
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
      },
      // 验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    userslist: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},
  methods: {
    getUsersList() {
      this.$emit('getUsersList')
    },
    // 监听switch开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        'users/' + userinfo.id + '/state/' + userinfo.mg_state
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      return this.$message.success('更新用户状态成功！')
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      console.log(id)
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
    },

    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if(!valid) return
        // 发起数据修改请求
        const {data: res} = await this.$http.put("users/" + this.editForm.id,{
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if(res.meta.status !== 200) {
          return this.$message.error('更新用户失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUsersList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      }) 
    }
  }
}
</script>

<style lang='less' scoped>
</style>
