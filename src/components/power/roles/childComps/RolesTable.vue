<template>
  <div class>
    <!-- 角色列表区 -->
    <el-table :data="rolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom', 'vcenter', i === 0 ? 'bdtop' : '']"
            v-for="(item, i) in scope.row.children"
            :key="item.id"
          >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag @close="removeRight(scope.row, item.id)" closable>{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <!-- 通过for循环嵌套渲染二级权限 -->
              <el-row
                :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                v-for="(item2, i2) in item.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <el-tag
                    @close="removeRight(scope.row, item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    @close="removeRight(scope.row, item3.id)"
                    closable
                    type="warning"
                    v-for="(item3, i3) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row.id)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            @click="removeUser(scope.row.id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
          >删除</el-button>
          <el-button
            @click="showSetRightDialog(scope.row)"
            size="mini"
            type="warning"
            icon="el-icon-setting"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改用户的对话框 -->
    <el-dialog
      @close="editDialogClosed"
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog @close="setRightDialogClosed" title="分配角色权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        show-checkbox
        :data="rightslist"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // 控制修改对话框是否显示
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 控制分配权限对话框的是否显示
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  props: {
    rolesList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},
  methods: {
    getRolesList() {
      this.$emit('getRolesList')
    },
    async showEditDialog(id) {
      // console.log(id)
      this.editDialogVisible = true
      // console.log(this.editDialogVisible)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起数据修改请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据ID删除数据
    async removeUser(id) {
      // console.log(id)
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除用户成功!'
          })
          return res
        })
        .catch(err => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          return err
        })

      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消删除，则返回值为字符串cancel
      // console.log(confirmResult)

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRight(role, rightId) {
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await this.$http.delete(
        'roles/' + role.id + '/rights/' + rightId
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // 不建议直接完全刷新页面
      // this.getRolesList()
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败！')
      }
      // 获取到的权限数据保存到data中
      this.rightslist = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式获得角色下所有三级权限id，并保存到defKeys中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      
      const idStr = keys.join(',')

      const {data: res} = await this.$http.post('roles/' + this.roleId + '/rights', {rids: idStr})
      // console.log(res)
      if(res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()

      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
