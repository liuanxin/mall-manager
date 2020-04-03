<template>
  <div class="role-container">
    <el-tree
      :data="treeData"
      node-key="id"
      show-checkbox
      :default-expanded-keys="checkedList"
      :default-checked-keys="checkedList"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
import { getMockMenus } from '@/router'
import { isNotTrue } from '@/utils/util'
export default {
  data() {
    return {
      treeData: isNotTrue(process.env.VUE_APP_ONLINE) ? getMockMenus() : [],
      checkedList: [ 12, 21 ],
      defaultProps: { children: 'children', label: 'name' }
    }
  }
}
</script>

<style scoped>
.role-container {
  margin: 0 10px;
}
</style>
