/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-06-23 17:53:09
 * @LastEditTime: 2022-06-24 10:58:35
 * @LastEditors: Author
 */

import CustomBreadcrumb from '@/components/CustomBreadcrumb'
import OperationSectionCard from './components/OperationSectionCard'
import './index.scss'
function OperationSection () {

   return (
    <>
      <CustomBreadcrumb title='作业区间详情'></CustomBreadcrumb>
      <OperationSectionCard></OperationSectionCard>
      <OperationSectionCard></OperationSectionCard>
      <OperationSectionCard></OperationSectionCard>
    </>
  )
}

export default OperationSection