<template>
  <div>
    <!-- 搜索与添加区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input v-model="queryInfo.query" clearable @clear="getUsersList" placeholder="请输入内容">
          <el-button @click="getUsersList2" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="addDialogVisible = true" type="primary">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户"  @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体曲 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'blur'
          }
        ]
      },
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false
    }
  },
  props: {
    queryInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {},
  methods: {
    getUsersList() {
      this.$emit('getUsersList')
    },
    async getUsersList2() {
      this.queryInfo.pagenum = 1
      this.getUsersList()
    },

    // 监听用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },

    // 监听用户对话框的确定事件
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return  // 验证通过
        // 发起添加用户的请求
        const {data: res} = await this.$http.post('users', this.addForm)
        if(res.meta.status !== 201){
          this.$message.error("添加用户失败！")
          return
        }
        this.$message.success("添加用户成功！")

        // 隐藏添加的对话框
        this.addDialogVisible = false

        // 重新获取用户列表
        this.getUsersList()
      })
    }
  },
  computed: {}
}
</script>

<style lang='less' scoped>
</style>
