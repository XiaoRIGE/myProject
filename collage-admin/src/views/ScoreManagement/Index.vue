<!--
 * @Author: lyh
 * @Date: 2021-11-09 14:10:03
 * @LastEditTime: 2021-11-09 14:36:12
 * @LastEditors: Please set LastEditors
 * @Description: 成绩管理
 * @FilePath: \collage-admin\src\views\ScoreManagement\Index.vue
-->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :is="Component"
        v-if="$route.meta.keepAlive"
        :key="$route.name"
      />
    </keep-alive>
    <component
      :is="Component"
      v-if="!$route.meta.keepAlive"
      :key="$route.name"
    />
  </router-view>
</template>
