<template>
  <div class=''>
    <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button @click="addDialogVisible = true" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
        <!-- 内容主体曲 -->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
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
  data(){
    return {
      // 添加用户的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 隐藏添加的对话框
      addDialogVisible: false
    }
  },
  components: {},
  methods: {
    getRolesList() {
      this.$emit('getRolesList')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        // 发起添加用户的请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
          return
        }
        this.$message.success('添加角色成功！')

        // 隐藏添加的对话框
        this.addDialogVisible = false

        // 重新获取用户列表
        this.getRolesList()
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
