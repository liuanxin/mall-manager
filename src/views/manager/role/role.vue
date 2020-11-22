<template>
  <div class="role-container">
    <div class="buttons">
      <el-button @click="getKeys">print id</el-button>
      <el-button @click="resetChecked">清空</el-button>
    </div>
    <el-tree
      ref="tree"
      :data="treeData"
      node-key="id"
      show-checkbox
      :default-expanded-keys="checkedList"
      :default-checked-keys="checkedList"
      :check-strictly="true"
      :props="defaultProps"></el-tree>
  </div>
</template>

<script>
import { getMockMenus } from '@/router'
import { isNotTrue } from '@/utils/util'
export default {
  data() {
    return {
      treeData: isNotTrue(process.env.VUE_APP_ONLINE) ? getMockMenus() : [],
      checkedList: [ 12, 13, 21 ],
      defaultProps: { children: 'children', label: 'name' }
    }
  },
  methods: {
    getKeys() {
      // 跟标签上的 ref="tree" 相对应
      const tree = this.$refs.tree

      const keysNotParent = tree.getCheckedKeys()
      console.debug('不包含父: ' + keysNotParent)

      // 使用 set 去重
      const set = new Set()
      keysNotParent.forEach(key => {
        tree.getNodePath(key).map(node => set.add(node.id))
        set.add(key)
      })
      const keysIncludeParent = [...set] // 或者使用 Array.from(set)
      console.debug('包含父: ' + keysIncludeParent)
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    }
  }
}
</script>

<style scoped>
.role-container {
  margin: 10px 10px 0;
}
</style>
